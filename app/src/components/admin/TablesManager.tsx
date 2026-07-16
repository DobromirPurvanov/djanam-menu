import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Plus, Trash2, Eye, EyeOff, Download, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TablesManager() {
  const [newTableName, setNewTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showQrDialog, setShowQrDialog] = useState(false);

  const utils = trpc.useUtils();
  const { data: tables, isLoading } = trpc.table.list.useQuery();

  const createTable = trpc.table.create.useMutation({
    onSuccess: () => {
      utils.table.list.invalidate();
      setNewTableName("");
    },
  });

  const updateTable = trpc.table.update.useMutation({
    onSuccess: () => utils.table.list.invalidate(),
  });

  const deleteTable = trpc.table.delete.useMutation({
    onSuccess: () => utils.table.list.invalidate(),
  });

  const handleCreate = () => {
    if (!newTableName.trim()) return;
    const qrToken = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    createTable.mutate({ name: newTableName.trim(), qrToken });
  };

  const handleDelete = (id: number) => {
    if (confirm("Сигурни ли сте, че искате да изтриете тази маса?")) {
      deleteTable.mutate({ id });
    }
  };

  const getMenuUrl = (qrToken: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu/${qrToken}`;
  };

  const handleDownloadQr = (qrToken: string, tableName: string) => {
    const svg = document.getElementById(`qr-${qrToken}`);
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement("a");
      link.download = `QR-${tableName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const selectedTableData = tables?.find((t) => t.id === selectedTable);

  return (
    <div className="space-y-6">
      {/* Add new table */}
      <Card className="bg-[#111] border-[#222] text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-500" />
            Добави нова маса
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Име на маса..."
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
            />
            <Button
              onClick={handleCreate}
              disabled={createTable.isPending || !newTableName.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добави
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tables list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables?.map((table) => (
          <Card key={table.id} className={`bg-[#111] border-[#222] text-white ${!table.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{table.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() =>
                      updateTable.mutate({
                        id: table.id,
                        data: { isActive: !table.isActive },
                      })
                    }
                  >
                    {table.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDelete(table.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant={table.isActive ? "default" : "secondary"} className={table.isActive ? "bg-red-600" : ""}>
                  {table.isActive ? "Активна" : "Неактивна"}
                </Badge>
                <Badge variant="outline" className="border-[#333] text-gray-400">Посещения: {table.visitCount}</Badge>
              </div>

              <div className="bg-white p-3 rounded-lg flex justify-center">
                <QRCodeSVG
                  id={`qr-${table.qrToken}`}
                  value={getMenuUrl(table.qrToken)}
                  size={160}
                  level="H"
                  includeMargin
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500 truncate">
                  {getMenuUrl(table.qrToken)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
                  onClick={() =>
                    handleDownloadQr(table.qrToken, table.name)
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Изтегли QR
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-[#222] text-white hover:bg-[#333]"
                  onClick={() => {
                    setSelectedTable(table.id);
                    setShowQrDialog(true);
                  }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Увеличи QR
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">Зареждане...</div>
      )}

      {tables?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Няма добавени маси. Добавете нова маса по-горе.
        </div>
      )}

      {/* Large QR Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-md bg-[#111] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedTableData?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {selectedTableData && (
              <>
                <QRCodeSVG
                  value={getMenuUrl(selectedTableData.qrToken)}
                  size={280}
                  level="H"
                  includeMargin
                />
                <p className="text-sm text-gray-500 text-center break-all px-4">
                  {getMenuUrl(selectedTableData.qrToken)}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedTableData) {
                  handleDownloadQr(
                    selectedTableData.qrToken,
                    selectedTableData.name
                  );
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Изтегли QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
