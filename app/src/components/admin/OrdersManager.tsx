import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, CheckCircle, Clock, ChefHat } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
  preparing: "bg-blue-900/30 text-blue-400 border-blue-700",
  ready: "bg-green-900/30 text-green-400 border-green-700",
  served: "bg-gray-800 text-gray-400 border-gray-600",
  cancelled: "bg-red-900/30 text-red-400 border-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "В очакване",
  preparing: "Приготвяне",
  ready: "Готова",
  served: "Сервирана",
  cancelled: "Отказана",
};

const statusOptions = ["pending", "preparing", "ready", "served", "cancelled"];

export default function OrdersManager() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.order.list.useQuery();

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  const deleteOrder = trpc.order.delete.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  const selectedOrderData = orders?.find((o) => o.id === selectedOrder);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Поръчки</h2>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Зареждане...</div>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <Card key={order.id} className="overflow-hidden bg-[#111] border-[#222] text-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Поръчка #{order.id}</span>
                    <Badge
                      variant="outline"
                      className={statusColors[order.status] || ""}
                    >
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Маса: {order.table?.name || "?"} |{" "}
                    {new Date(order.createdAt).toLocaleString("bg-BG")}
                  </p>
                </div>
                <p className="font-bold text-lg text-red-500">
                  {Number(order.total).toFixed(2)} EUR
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {order.items?.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-[#222] text-gray-400 border-[#333]">
                    {item.productName} x{item.quantity}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order.id)}
                  className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Детайли
                </Button>
                <div className="flex gap-1 ml-auto">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={order.status === status ? "default" : "outline"}
                      size="sm"
                      className={
                        order.status === status
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-transparent border-[#333] text-gray-400 hover:bg-[#222]"
                      }
                      onClick={() =>
                        updateStatus.mutate({ id: order.id, status })
                      }
                    >
                      {status === "pending" && <Clock className="w-3 h-3" />}
                      {status === "preparing" && <ChefHat className="w-3 h-3" />}
                      {status === "ready" && <CheckCircle className="w-3 h-3" />}
                      {status === "served" && <CheckCircle className="w-3 h-3" />}
                      {status === "cancelled" && <Trash2 className="w-3 h-3" />}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => {
                      if (confirm("Изтриване на поръчка?"))
                        deleteOrder.mutate({ id: order.id });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Няма поръчки.
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={selectedOrder !== null}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-lg bg-[#111] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Поръчка #{selectedOrderData?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Маса:</span>
              <span className="font-medium">
                {selectedOrderData?.table?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Статус:</span>
              <Badge
                variant="outline"
                className={
                  statusColors[selectedOrderData?.status || ""] || ""
                }
              >
                {statusLabels[selectedOrderData?.status || ""] ||
                  selectedOrderData?.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Дата:</span>
              <span>
                {selectedOrderData?.createdAt &&
                  new Date(selectedOrderData.createdAt).toLocaleString(
                    "bg-BG"
                  )}
              </span>
            </div>
            <div className="border-t border-[#333] pt-3">
              <p className="font-medium mb-2">Артикули:</p>
              <div className="space-y-2">
                {selectedOrderData?.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {Number(item.unitPrice).toFixed(2)} лв.
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500">
                          Бележка: {item.notes}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-red-500">
                      {(Number(item.unitPrice) * item.quantity).toFixed(2)} EUR
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[#333] pt-3 flex justify-between text-xl font-bold">
              <span>Общо:</span>
              <span className="text-red-500">
                {selectedOrderData?.total
                  ? Number(selectedOrderData.total).toFixed(2)
                  : "0.00"}{" "}
                EUR
              </span>
            </div>
            {selectedOrderData?.notes && (
              <div className="bg-[#222] p-3 rounded-lg">
                <p className="text-sm text-gray-500">Бележки:</p>
                <p>{selectedOrderData.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
