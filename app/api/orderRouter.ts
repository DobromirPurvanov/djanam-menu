import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import {
  findAllOrders,
  findOrdersByTable,
  findOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getTableStats,
  getDailyRevenue,
} from "./queries/orders";

export const orderRouter = createRouter({
  list: adminProcedure.query(() => findAllOrders()),

  byTable: adminProcedure
    .input(z.object({ tableId: z.number() }))
    .query(({ input }) => findOrdersByTable(input.tableId)),

  byId: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findOrderById(input.id)),

  create: publicQuery
    .input(
      z.object({
        tableId: z.number().int().positive(),
        items: z
          .array(
            z.object({
              productId: z.number().int().positive(),
              quantity: z.number().int().min(1).max(99),
              notes: z.string().max(500).optional(),
            })
          )
          .min(1),
        notes: z.string().max(1000).optional(),
      })
    )
    .mutation(({ input }) => createOrder(input)),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]),
      })
    )
    .mutation(({ input }) => updateOrderStatus(input.id, input.status)),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteOrder(input.id)),

  stats: adminProcedure.query(() => getTableStats()),

  dailyRevenue: adminProcedure
    .input(z.object({ days: z.number().optional() }))
    .query(({ input }) => getDailyRevenue(input.days ?? 30)),
});
