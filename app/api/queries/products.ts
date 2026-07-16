import { getDb } from "./connection";
import { products } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export async function findAllProducts() {
  return getDb().query.products.findMany({
    orderBy: [asc(products.sortOrder)],
    with: { category: true },
  });
}

export async function findActiveProducts() {
  return getDb().query.products.findMany({
    where: eq(products.isAvailable, true),
    orderBy: [asc(products.sortOrder)],
    with: { category: true },
  });
}

export async function findProductsByCategory(categoryId: number) {
  return getDb().query.products.findMany({
    where: eq(products.categoryId, categoryId),
    orderBy: [asc(products.sortOrder)],
  });
}

export async function findProductById(id: number) {
  return getDb().query.products.findFirst({
    where: eq(products.id, id),
  });
}

export async function createProduct(data: {
  categoryId: number;
  name: string;
  nameEn?: string;
  description?: string;
  weight?: string;
  priceBgn: string;
  priceEur: string;
  image?: string;
  images?: string[];
  sortOrder?: number;
}) {
  const [{ id }] = await getDb()
    .insert(products)
    .values({ ...data, isAvailable: true })
    .$returningId();
  return findProductById(id);
}

export async function updateProduct(
  id: number,
  data: {
    categoryId?: number;
    name?: string;
    nameEn?: string;
    description?: string;
    weight?: string;
    priceBgn?: string;
    priceEur?: string;
    image?: string;
    images?: string[];
    isAvailable?: boolean;
    sortOrder?: number;
  }
) {
  await getDb().update(products).set(data).where(eq(products.id, id));
  return findProductById(id);
}

export async function deleteProduct(id: number) {
  await getDb().delete(products).where(eq(products.id, id));
}
