import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import {
  findAllTables,
  findTableById,
  findTableByQrToken,
  createTable,
  updateTable,
  deleteTable,
  incrementTableVisit,
} from "./queries/tables";

export const tableRouter = createRouter({
  list: adminProcedure.query(() => findAllTables()),

  byId: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findTableById(input.id)),

  byQrToken: publicQuery
    .input(z.object({ qrToken: z.string() }))
    .query(({ input }) => findTableByQrToken(input.qrToken)),

  create: adminProcedure
    .input(z.object({ name: z.string().min(1), qrToken: z.string().min(1) }))
    .mutation(({ input }) => createTable(input)),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().min(1).optional(),
          isActive: z.boolean().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateTable(input.id, input.data)),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTable(input.id)),

  visit: publicQuery
    .input(z.object({ qrToken: z.string() }))
    .mutation(({ input }) => incrementTableVisit(input.qrToken)),
});
