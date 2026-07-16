import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Table, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: stats } = trpc.order.stats.useQuery();
  const { data: dailyRevenue } = trpc.order.dailyRevenue.useQuery({ days: 30 });

  const totalRevenue = stats?.reduce((sum, s) => sum + Number(s.totalRevenue || 0), 0) || 0;
  const totalVisits = stats?.reduce((sum, s) => sum + Number(s.visitCount || 0), 0) || 0;
  const totalOrders = stats?.reduce((sum, s) => sum + Number(s.orderCount || 0), 0) || 0;

  const tableData =
    stats?.map((s) => ({
      name: s.tableName || `Маса ${s.tableId}`,
      visits: Number(s.visitCount || 0),
      revenue: Number(s.totalRevenue || 0),
      orders: Number(s.orderCount || 0),
    })) || [];

  const revenueData =
    dailyRevenue?.map((d) => ({
      date: d.date?.slice(5) || "",
      revenue: Number(d.revenue || 0),
      orders: Number(d.orderCount || 0),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#111] border-[#222] text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-900/30 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Общи приходи</p>
                <p className="text-2xl font-bold">
                  {totalRevenue.toFixed(2)} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-[#222] text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-900/30 p-3 rounded-lg">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Общо посещения</p>
                <p className="text-2xl font-bold">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-[#222] text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Общо поръчки</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables ranking */}
      <Card className="bg-[#111] border-[#222] text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Table className="w-5 h-5 text-red-500" />
            Класиране на масите
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tableData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Няма данни за масите.
              </div>
            )}
            {tableData
              .sort((a, b) => b.visits - a.visits)
              .map((t, idx) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#222]"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={idx < 3 ? "default" : "secondary"}
                      className={
                        idx === 0
                          ? "bg-red-600"
                          : idx === 1
                          ? "bg-gray-500"
                          : idx === 2
                          ? "bg-red-800"
                          : "bg-[#222] text-gray-400 border-[#333]"
                      }
                    >
                      #{idx + 1}
                    </Badge>
                    <span className="font-medium">{t.name}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">
                      Посещения: <strong>{t.visits}</strong>
                    </span>
                    <span className="text-gray-500">
                      Поръчки: <strong>{t.orders}</strong>
                    </span>
                    <span className="text-red-500 font-semibold">
                      {t.revenue.toFixed(2)} EUR
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by table chart */}
      {tableData.length > 0 && (
        <Card className="bg-[#111] border-[#222] text-white">
          <CardHeader>
            <CardTitle className="text-white">Приходи по маси</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} EUR`}
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily revenue chart */}
      {revenueData.length > 0 && (
        <Card className="bg-[#111] border-[#222] text-white">
          <CardHeader>
            <CardTitle className="text-white">Дневни приходи (последни 30 дни)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} EUR`}
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: "#dc2626" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
