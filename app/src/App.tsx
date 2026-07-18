import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import Menu from "./pages/Menu";

// Admin pulls in heavy deps (recharts, qrcode) that customers never need,
// so it is split into its own chunk and loaded on demand.
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0a0a0a] text-gray-500 flex items-center justify-center text-sm">
            Зареждане…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:qrToken" element={<Menu />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" theme="dark" richColors />
    </HashRouter>
  );
}
