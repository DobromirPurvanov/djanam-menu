import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";

// Official fixed BGN↔EUR rate (mandatory dual pricing).
const BGN_PER_EUR = 1.95583;
const bgnToEur = (bgn: string): string => {
  const n = Number(bgn);
  return Number.isFinite(n) && n > 0 ? (n / BGN_PER_EUR).toFixed(2) : "";
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductForm {
  name: string;
  nameEn: string;
  description: string;
  weight: string;
  priceBgn: string;
  priceEur: string;
  categoryId: string;
  images: string; // newline separated URLs
  tags: string[]; // badge keys
  allergens: string; // comma separated
}

// Badge options (keys must match BADGE_META in the customer menu).
const BADGE_OPTIONS: { key: string; label: string }[] = [
  { key: "signature", label: "Специалитет" },
  { key: "new", label: "Ново" },
  { key: "spicy", label: "Люто" },
  { key: "vegan", label: "Веган" },
  { key: "vegetarian", label: "Вегетарианско" },
];

const EMPTY_FORM: ProductForm = {
  name: "",
  nameEn: "",
  description: "",
  weight: "",
  priceBgn: "",
  priceEur: "",
  categoryId: "",
  images: "",
  tags: [],
  allergens: "",
};

import { products as productsSchema } from "@db/schema";

type Product = typeof productsSchema.$inferSelect & {
  category?: { name: string } | null;
};

export default function ProductsManager() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  const utils = trpc.useUtils();
  const { data: products } = trpc.product.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      setShowAdd(false);
      setForm(EMPTY_FORM);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const parseImages = (raw: string): string[] => {
    return raw
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const stringifyImages = (imgs: string[] | null): string => {
    if (!imgs || !Array.isArray(imgs)) return "";
    return imgs.join("\n");
  };

  const parseCsv = (raw: string): string[] =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const toggleTag = (key: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(key)
        ? prev.tags.filter((t) => t !== key)
        : [...prev.tags, key],
    }));
  };

  const handleCreate = () => {
    if (!form.name.trim() || !form.priceBgn || !form.priceEur || !form.categoryId) return;
    const imgs = parseImages(form.images);
    const allergens = parseCsv(form.allergens);
    createProduct.mutate({
      name: form.name.trim(),
      nameEn: form.nameEn || undefined,
      description: form.description || undefined,
      weight: form.weight || undefined,
      priceBgn: form.priceBgn,
      priceEur: form.priceEur,
      categoryId: Number(form.categoryId),
      image: imgs[0] || undefined,
      images: imgs.length > 0 ? imgs : undefined,
      tags: form.tags.length > 0 ? form.tags : undefined,
      allergens: allergens.length > 0 ? allergens : undefined,
    });
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      nameEn: product.nameEn || "",
      description: product.description || "",
      weight: product.weight || "",
      priceBgn: product.priceBgn,
      priceEur: product.priceEur,
      categoryId: String(product.categoryId),
      images: stringifyImages(product.images),
      tags: Array.isArray(product.tags) ? product.tags : [],
      allergens: Array.isArray(product.allergens)
        ? product.allergens.join(", ")
        : "",
    });
  };

  const handleUpdate = () => {
    if (!editingId || !form.name.trim() || !form.priceBgn || !form.priceEur) return;
    const imgs = parseImages(form.images);
    const allergens = parseCsv(form.allergens);
    updateProduct.mutate({
      id: editingId,
      data: {
        name: form.name.trim(),
        nameEn: form.nameEn || undefined,
        description: form.description || undefined,
        weight: form.weight || undefined,
        priceBgn: form.priceBgn,
        priceEur: form.priceEur,
        categoryId: Number(form.categoryId),
        image: imgs[0] || undefined,
        images: imgs.length > 0 ? imgs : undefined,
        tags: form.tags,
        allergens,
      },
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Продукти в менюто</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowAdd(true);
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Нов продукт
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => {
          const firstImage = product.images && Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : product.image;
          return (
            <Card key={product.id} className={`bg-[#111] border-[#222] text-white ${!product.isAvailable ? "opacity-60" : ""}`}>
              {firstImage && (
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.nameEn && <p className="text-xs text-gray-400">{product.nameEn}</p>}
                  <Badge variant="secondary" className="text-xs mt-1 bg-[#222] text-gray-400 border-[#333]">
                    {product.category?.name || "Без категория"}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">
                    {Number(product.priceEur).toFixed(2)} EUR
                  </p>
                  <p className="text-xs text-gray-500">
                    {Number(product.priceBgn).toFixed(2)} лв.
                  </p>
                </div>
              </div>
              {product.weight && (
                <Badge variant="outline" className="text-xs border-[#333] text-gray-500">{product.weight}</Badge>
              )}
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="flex gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() =>
                    updateProduct.mutate({
                      id: product.id,
                      data: { isAvailable: !product.isAvailable },
                    })
                  }
                >
                  {product.isAvailable ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => startEdit(product)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => {
                    if (confirm("Изтриване на продукт?"))
                      deleteProduct.mutate({ id: product.id });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Няма добавени продукти.
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAdd || editingId !== null}
        onOpenChange={() => {
          setShowAdd(false);
          setEditingId(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#111] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? "Редактирай продукт" : "Нов продукт"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-name-bg" className="text-sm font-medium">Име (BG)</label>
              <Input
                id="product-name-bg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Име на продукт"
                className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="product-name-en" className="text-sm font-medium">Име (EN)</label>
              <Input
                id="product-name-en"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="English name"
                className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Категория</label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                  <SelectValue placeholder="Изберете категория" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333] text-white">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="price-bgn" className="text-sm font-medium">Цена (BGN)</label>
                <Input
                  id="price-bgn"
                  type="number"
                  step="0.01"
                  value={form.priceBgn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priceBgn: e.target.value,
                      // Keep EUR in sync via the official fixed rate.
                      priceEur: bgnToEur(e.target.value),
                    })
                  }
                  placeholder="0.00"
                  className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
                />
              </div>
              <div>
                <label htmlFor="price-eur" className="text-sm font-medium">Цена (EUR)</label>
                <Input
                  id="price-eur"
                  type="number"
                  step="0.01"
                  value={form.priceEur}
                  onChange={(e) => setForm({ ...form, priceEur: e.target.value })}
                  placeholder="0.00"
                  className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Авто по курс {BGN_PER_EUR}
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="product-weight" className="text-sm font-medium">Грамаж</label>
              <Input
                id="product-weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="напр. 300г"
                className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="product-description" className="text-sm font-medium">Описание</label>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Описание на продукта..."
                className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="product-images" className="text-sm font-medium">Снимки (URL-ове, по един на ред)</label>
              <Textarea
                id="product-images"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
                className="text-sm min-h-[80px] bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Баджове</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((opt) => {
                  const active = form.tags.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleTag(opt.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        active
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-[#333] bg-transparent text-gray-400 hover:bg-[#222]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="product-allergens" className="text-sm font-medium">Алергени (разделени със запетая)</label>
              <Input
                id="product-allergens"
                value={form.allergens}
                onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                placeholder="глутен, яйца, мляко"
                className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                setEditingId(null);
              }}
              className="bg-transparent border-[#333] text-gray-400 hover:bg-[#222] hover:text-white"
            >
              Отказ
            </Button>
            <Button
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={
                !form.name.trim() || !form.priceBgn || !form.priceEur || !form.categoryId
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {editingId ? "Запази" : "Създай"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}