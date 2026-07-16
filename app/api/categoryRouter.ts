import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllCategories,
  findActiveCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./queries/categories";

export const categoryRouter = createRouter({
  list: publicQuery.query(() => findAllCategories()),

  active: publicQuery.query(() => findActiveCategories()),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findCategoryById(input.id)),

  create: publicQuery
    .input(z.object({ name: z.string().min(1), sortOrder: z.number().optional() }))
    .mutation(({ input }) => createCategory(input)),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().min(1).optional(),
          sortOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateCategory(input.id, input.data)),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCategory(input.id)),
});
