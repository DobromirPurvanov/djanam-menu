import { createRoot } from "react-dom/client";
import "./index.css";
import { TRPCProvider } from "@/providers/trpc";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <TRPCProvider>
    <App />
  </TRPCProvider>
);
