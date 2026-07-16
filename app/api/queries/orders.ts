import { getDb } from "./connection";
import { orders, orderItems, tables } from "@db/schema";
import { eq, desc, gte, sql } from "drizzle-orm";

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
    productName: string;
    quantity: number;
    unitPrice: string;
    notes?: string;
  }[];
  notes?: string;
}) {
  const total = data.items
    .reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
    .toFixed(2);

  const [{ id: orderId }] = await getDb()
    .insert(orders)
    .values({
      tableId: data.tableId,
      status: "pending",
      total,
      notes: data.notes,
    })
    .$returningId();

  if (data.items.length > 0) {
    await getDb().insert(orderItems).values(
      data.items.map((item) => ({
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes || null,
      }))
    );
  }

  return findOrderById(orderId);
}

export async function updateOrderStatus(id: number, status: string) {
  await getDb()
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id));
  return findOrderById(id);
}

export async function deleteOrder(id: number) {
  await getDb().delete(orderItems).where(eq(orderItems.orderId, id));
  await getDb().delete(orders).where(eq(orders.id, id));
}

export async function getTableStats() {
  const db = getDb();
  const result = await db
    .select({
      tableId: orders.tableId,
      tableName: tables.name,
      visitCount: tables.visitCount,
      totalRevenue: tables.totalRevenue,
      orderCount: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .innerJoin(tables, eq(orders.tableId, tables.id))
    .groupBy(orders.tableId)
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
