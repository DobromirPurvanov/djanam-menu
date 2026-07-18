import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (
      process.env.NODE_ENV === "production" &&
      error.code === "INTERNAL_SERVER_ERROR"
    ) {
      return {
        ...shape,
        message: "Internal server error",
        data: {
          ...shape.data,
          stack: undefined,
        },
      };
    }
    return shape;
  },
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin authentication required",
    });
  return next();
});
