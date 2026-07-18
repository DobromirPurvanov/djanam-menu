import { createRouter, publicQuery } from "./middleware";
import { tableRouter } from "./tableRouter";
import { categoryRouter } from "./categoryRouter";
import { productRouter } from "./productRouter";
import { orderRouter } from "./orderRouter";
import { seedRouter } from "./seedRouter";
import { serviceRouter } from "./serviceRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  table: tableRouter,
  category: categoryRouter,
  product: productRouter,
  order: orderRouter,
  seed: seedRouter,
  service: serviceRouter,
});

export type AppRouter = typeof appRouter;
