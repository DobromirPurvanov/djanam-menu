import { getDb } from "./connection";
import { categories } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export async function findAllCategories() {
  return getDb().query.categories.findMany({
    orderBy: [asc(categories.sortOrder)],
  });
}

export async function findActiveCategories() {
  return getDb().query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [asc(categories.sortOrder)],
  });
}

export async function findCategoryById(id: number) {
  return getDb().query.categories.findFirst({
    where: eq(categories.id, id),
  });
}

export async function createCategory(data: { name: string; sortOrder?: number }) {
  const [{ id }] = await getDb()
    .insert(categories)
    .values({ ...data, isActive: true })
    .$returningId();
  return findCategoryById(id);
}

export async function updateCategory(
  id: number,
  data: { name?: string; sortOrder?: number; isActive?: boolean }
) {
  await getDb().update(categories).set(data).where(eq(categories.id, id));
  return findCategoryById(id);
}

export async function deleteCategory(id: number) {
  await getDb().delete(categories).where(eq(categories.id, id));
}
