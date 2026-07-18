import { relations } from "drizzle-orm";
import {
  tables,
  categories,
  products,
  orders,
  orderItems,
  serviceRequests,
} from "./schema";

export const tablesRelations = relations(tables, ({ many }) => ({
  orders: many(orders),
  serviceRequests: many(serviceRequests),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  table: one(tables, {
    fields: [serviceRequests.tableId],
    references: [tables.id],
  }),
}));
