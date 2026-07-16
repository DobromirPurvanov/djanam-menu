import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  Tags,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  ArrowLeft,
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

export default function Admin() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || "tables");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Към менюто
          </Button>
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
