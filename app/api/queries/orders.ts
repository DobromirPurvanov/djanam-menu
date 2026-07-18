import { getDb } from "./connection";
import { orders, orderItems, tables, products } from "@db/schema";
import { eq, desc, gte, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export async function findAllOrders() {
  return getDb().query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: { table: true, items: true },
  });
}

export async function findOrdersByTable(tableId: number) {
  return getDb().query.orders.findMany({
    where: eq(orders.tableId, tableId),
    orderBy: [desc(orders.createdAt)],
    with: { items: true },
  });
}

export async function findOrderById(id: number) {
  return getDb().query.orders.findFirst({
    where: eq(orders.id, id),
    with: { table: true, items: true },
  });
}

export async function createOrder(data: {
  tableId: number;
  items: {
    productId: number;
    quantity: number;
    notes?: string;
  }[];
  notes?: string;
}) {
  const db = getDb();

  // Verify table exists
  const table = await db.query.tables.findFirst({
    where: eq(tables.id, data.tableId),
  });
  if (!table) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });
  }

  // Load all referenced products in one query
  const productIds = data.items.map((item) => item.productId);
  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));
  const productMap = new Map(productRows.map((p) => [p.id, p]));

  // Compute server-side prices and validate availability
  const resolvedItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product || product.isAvailable === false) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Product ${item.productId} is not available`,
      });
    }
    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.priceEur,
      notes: item.notes || null,
    };
  });

  const total = resolvedItems
    .reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
    .toFixed(2);

  const orderId = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(orders)
      .values({
        tableId: data.tableId,
        status: "pending",
        total,
        notes: data.notes,
      })
      .$returningId();

    await tx.insert(orderItems).values(
      resolvedItems.map((item) => ({
        orderId: id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
      }))
    );

    return id;
  });

  return findOrderById(orderId);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await getDb()
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id));
  return findOrderById(id);
}

export async function deleteOrder(id: number) {
  await getDb().transaction(async (tx) => {
    await tx.delete(orderItems).where(eq(orderItems.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
}

export async function getTableStats() {
  const db = getDb();
  const result = await db
    .select({
      tableId: tables.id,
      tableName: tables.name,
      visitCount: tables.visitCount,
      totalRevenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
      orderCount: sql<number>`COUNT(${orders.id})`,
    })
    .from(tables)
    .leftJoin(orders, eq(orders.tableId, tables.id))
    .groupBy(tables.id, tables.name, tables.visitCount)
    .orderBy(desc(sql`COUNT(${orders.id})`));
  return result;
}

export async function getDailyRevenue(days: number = 30) {
  const db = getDb();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const result = await db
    .select({
      date: sql<string>`DATE(${orders.createdAt})`,
      revenue: sql<string>`SUM(${orders.total})`,
      orderCount: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .where(gte(orders.createdAt, since))
    .groupBy(sql`DATE(${orders.createdAt})`)
    .orderBy(sql`DATE(${orders.createdAt})`);
  return result;
}
