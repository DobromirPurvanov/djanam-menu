import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { env } from "./lib/env";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  isAdmin: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const token = opts.req.headers.get("x-admin-token");
  const isAdmin = env.adminToken !== "" && token === env.adminToken;
  return { req: opts.req, resHeaders: opts.resHeaders, isAdmin };
}
