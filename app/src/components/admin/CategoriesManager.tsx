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
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CategoriesManager() {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const utils = trpc.useUtils();
  const { data: categories } = trpc.category.list.useQuery();

  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.list.invalidate();
      setNewName("");
    },
  });

  const updateCategory = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.list.invalidate();
      setEditingId(null);
    },
  });

  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => utils.category.list.invalidate(),
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    const maxOrder = categories?.length ? Math.max(...categories.map((c) => c.sortOrder)) : 0;
    createCategory.mutate({ name: newName.trim(), sortOrder: maxOrder + 1 });
  };

  const startEdit = (cat: { id: number; name: string }) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdate = () => {
    if (!editingId || !editName.trim()) return;
    updateCategory.mutate({ id: editingId, data: { name: editName.trim() } });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#111] border-[#222] text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-500" />
            Добави нова категория
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Име на категория..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
            />
            <Button
              onClick={handleCreate}
              disabled={createCategory.isPending || !newName.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добави
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <Card key={cat.id} className={`bg-[#111] border-[#222] text-white ${!cat.isActive ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <Badge variant="outline" className="text-xs mt-1 border-[#333] text-gray-400">
                      Ред: {cat.sortOrder}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => startEdit(cat)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => {
                      if (confirm("Изтриване на категория?"))
                        deleteCategory.mutate({ id: cat.id });
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

      {categories?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Няма добавени категории.
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editingId !== null} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="bg-[#111] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Редактирай категория</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className="bg-[#0a0a0a] border-[#333] text-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)} className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white">
              Отказ
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateCategory.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Запази
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
