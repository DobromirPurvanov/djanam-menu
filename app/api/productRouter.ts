import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllProducts,
  findActiveProducts,
  findProductsByCategory,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./queries/products";

export const productRouter = createRouter({
  list: publicQuery.query(() => findAllProducts()),

  active: publicQuery.query(() => findActiveProducts()),

  byCategory: publicQuery
    .input(z.object({ categoryId: z.number() }))
    .query(({ input }) => findProductsByCategory(input.categoryId)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findProductById(input.id)),

  create: publicQuery
    .input(
      z.object({
        categoryId: z.number(),
        name: z.string().min(1),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        weight: z.string().optional(),
        priceBgn: z.string().min(1),
        priceEur: z.string().min(1),
        image: z.string().optional(),
        images: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => createProduct(input)),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          categoryId: z.number().optional(),
          name: z.string().min(1).optional(),
          nameEn: z.string().optional(),
          description: z.string().optional(),
          weight: z.string().optional(),
          priceBgn: z.string().optional(),
          priceEur: z.string().optional(),
          image: z.string().optional(),
          images: z.array(z.string()).optional(),
          isAvailable: z.boolean().optional(),
          sortOrder: z.number().optional(),
        }),
      })
    )
    .mutation(({ input }) => updateProduct(input.id, input.data)),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProduct(input.id)),
});
