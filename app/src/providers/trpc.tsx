import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

// Read API URL from global config (set in config.js)
declare global {
  interface Window {
    __DJANAM_API_URL__?: string;
  }
}

const API_URL =
  (typeof window !== "undefined" && window.__DJANAM_API_URL__) ||
  "/menu/api/trpc";

// localStorage key holding the admin token (set on admin login).
export const ADMIN_TOKEN_KEY = "djanam_admin_token";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: API_URL,
      transformer: superjson,
      // Sent on every request; admin-only procedures require it. Read fresh
      // from storage each time so a login mid-session takes effect immediately.
      headers() {
        try {
          const token = localStorage.getItem(ADMIN_TOKEN_KEY);
          return token ? { "x-admin-token": token } : {};
        } catch {
          return {};
        }
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
