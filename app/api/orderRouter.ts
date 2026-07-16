import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
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
  list: publicQuery.query(() => findAllOrders()),

  byTable: publicQuery
    .input(z.object({ tableId: z.number() }))
    .query(({ input }) => findOrdersByTable(input.tableId)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findOrderById(input.id)),

  create: publicQuery
    .input(
      z.object({
        tableId: z.number(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            quantity: z.number().min(1),
            unitPrice: z.string(),
            notes: z.string().optional(),
          })
        ),
        notes: z.string().optional(),
      })
    )
    .mutation(({ input }) => createOrder(input)),

  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(({ input }) => updateOrderStatus(input.id, input.status)),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteOrder(input.id)),

  stats: publicQuery.query(() => getTableStats()),

  dailyRevenue: publicQuery
    .input(z.object({ days: z.number().optional() }))
    .query(({ input }) => getDailyRevenue(input.days ?? 30)),
});
