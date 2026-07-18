import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc, ADMIN_TOKEN_KEY } from "@/providers/trpc";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  Tags,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  ArrowLeft,
  Lock,
  LogOut,
  Loader2,
} from "lucide-react";
import TablesManager from "@/components/admin/TablesManager";
import CategoriesManager from "@/components/admin/CategoriesManager";
import ProductsManager from "@/components/admin/ProductsManager";
import OrdersManager from "@/components/admin/OrdersManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

const tabs = [
  { id: "tables", label: "Маси", icon: Table },
  { id: "categories", label: "Категории", icon: Tags },
  { id: "products", label: "Продукти", icon: UtensilsCrossed },
  { id: "orders", label: "Поръчки", icon: ClipboardList },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
];

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const submit = async () => {
    const token = value.trim();
    if (!token || loading) return;
    setLoading(true);
    setError("");
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    try {
      // Any admin-only procedure verifies the token server-side.
      await utils.table.list.fetch();
      onSuccess();
    } catch {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setError("Невалиден токен за достъп.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-red-600/10">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-xl font-bold">Админ достъп</h1>
          <p className="text-sm text-gray-500">
            Въведете администраторския токен, за да продължите.
          </p>
        </div>
        <div className="space-y-3">
          <Input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Токен за достъп"
            className="bg-[#111] border-[#333] text-white placeholder:text-gray-600"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            onClick={submit}
            disabled={loading || !value.trim()}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Вход"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    try {
      return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
    } catch {
      return false;
    }
  });

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  // URL is the single source of truth, so back/forward stay in sync.
  const activeTab = tab || "tables";

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
    onLogout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold">Админ Панел</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/menu")}
              className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Към менюто
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Изход
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-[#111] border border-[#222]">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400"
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="tables">
            <TablesManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
