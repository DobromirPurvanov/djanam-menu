import { getDb } from "./connection";
import { tables } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function findAllTables() {
  return getDb().query.tables.findMany({
    orderBy: [desc(tables.createdAt)],
  });
}

export async function findTableById(id: number) {
  return getDb().query.tables.findFirst({
    where: eq(tables.id, id),
  });
}

export async function findTableByQrToken(qrToken: string) {
  return getDb().query.tables.findFirst({
    where: eq(tables.qrToken, qrToken),
  });
}

export async function createTable(data: { name: string; qrToken: string }) {
  const [{ id }] = await getDb()
    .insert(tables)
    .values({ ...data, isActive: true, visitCount: 0, totalRevenue: "0.00" })
    .$returningId();
  return findTableById(id);
}

export async function updateTable(
  id: number,
  data: { name?: string; isActive?: boolean }
) {
  await getDb().update(tables).set(data).where(eq(tables.id, id));
  return findTableById(id);
}

export async function deleteTable(id: number) {
  await getDb().delete(tables).where(eq(tables.id, id));
}

export async function incrementTableVisit(qrToken: string) {
  const table = await findTableByQrToken(qrToken);
  if (!table) return null;
  await getDb()
    .update(tables)
    .set({ visitCount: sql`${tables.visitCount} + 1` })
    .where(eq(tables.id, table.id));
  return findTableById(table.id);
}

export async function addTableRevenue(id: number, amount: string) {
  await getDb()
    .update(tables)
    .set({ totalRevenue: sql`${tables.totalRevenue} + ${amount}` })
    .where(eq(tables.id, id));
  return findTableById(id);
}
