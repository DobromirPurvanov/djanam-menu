import { getDb } from "./connection";
import { serviceRequests, tables } from "@db/schema";
import { eq, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export async function createServiceRequest(
  qrToken: string,
  type: "waiter" | "bill"
) {
  const db = getDb();

  const table = await db.query.tables.findFirst({
    where: eq(tables.qrToken, qrToken),
  });
  if (!table) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Table not found" });
  }

  await db.insert(serviceRequests).values({
    tableId: table.id,
    type,
    status: "pending",
  });

  return { ok: true };
}

export async function findPendingServiceRequests() {
  return getDb().query.serviceRequests.findMany({
    where: eq(serviceRequests.status, "pending"),
    orderBy: [asc(serviceRequests.createdAt)],
    with: { table: true },
  });
}

export async function resolveServiceRequest(id: number) {
  await getDb()
    .update(serviceRequests)
    .set({ status: "done" })
    .where(eq(serviceRequests.id, id));
  return { ok: true };
}
