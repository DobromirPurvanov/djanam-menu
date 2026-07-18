import { z } from "zod";
import { createRouter, publicQuery, adminProcedure } from "./middleware";
import {
  createServiceRequest,
  findPendingServiceRequests,
  resolveServiceRequest,
} from "./queries/serviceRequests";

export const serviceRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        qrToken: z.string().min(1),
        type: z.enum(["waiter", "bill"]),
      })
    )
    .mutation(({ input }) => createServiceRequest(input.qrToken, input.type)),

  pending: adminProcedure.query(() => findPendingServiceRequests()),

  resolve: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => resolveServiceRequest(input.id)),
});
