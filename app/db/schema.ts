import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  bigint,
  int,
  boolean,
  index,
  json,
} from "drizzle-orm/mysql-core";

// Tables (Маси)
export const tables = mysqlTable(
  "tables",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    qrToken: varchar("qr_token", { length: 255 }).notNull().unique(),
    visitCount: int("visit_count").notNull().default(0),
    totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull().default("0.00"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    qrTokenIdx: index("qr_token_idx").on(table.qrToken),
  })
);

export type Table = typeof tables.$inferSelect;
export type InsertTable = typeof tables.$inferInsert;

// Categories (Категории меню)
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Products (Продукти)
export const products = mysqlTable(
  "products",
  {
    id: serial("id").primaryKey(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
    description: text("description"),
    weight: varchar("weight", { length: 50 }),
    priceBgn: decimal("price_bgn", { precision: 10, scale: 2 }).notNull(),
    priceEur: decimal("price_eur", { precision: 10, scale: 2 }).notNull(),
    image: varchar("image", { length: 500 }),
    images: json("images").$type<string[]>(),
    isAvailable: boolean("is_available").notNull().default(true),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("category_idx").on(table.categoryId),
  })
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Orders (Поръчки)
export const orders = mysqlTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    tableId: bigint("table_id", { mode: "number", unsigned: true }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0.00"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tableIdx: index("order_table_idx").on(table.tableId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items (Артикули в поръчка)
export const orderItems = mysqlTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: bigint("order_id", { mode: "number", unsigned: true }).notNull(),
    productId: bigint("product_id", { mode: "number", unsigned: true }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    quantity: int("quantity").notNull().default(1),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("order_item_order_idx").on(table.orderId),
  })
);

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
