import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Instagram,
} from "lucide-react";

type ProductItem = {
  id: number;
  name: string;
  nameEn: string | null;
  description: string | null;
  weight: string | null;
  priceBgn: string;
  priceEur: string;
  image: string | null;
  images: string[] | null;
  categoryId: number;
  category?: { name: string } | null;
  isAvailable: boolean;
  sortOrder: number;
};

const categoryEmoji: Record<string, string> = {
  Salads: "🥗",
  Soups: "🍲",
  Starters: "🍤",
  Appetizer: "🫒",
  Bread: "🥖",
  "Pasta & Risotto": "🍝",
  Beef: "🥩",
  Fish: "🐟",
  Sides: "🍟",
  Desserts: "🍰",
};

const categorySubtitle: Record<string, string> = {
  Salads: "Свежи и вкусни",
  Soups: "Топли и ароматни",
  Starters: "Започнете със стил",
  Appetizer: "Перфектно допълнение",
  Bread: "Прежен и топъл",
  "Pasta & Risotto": "Италианска класика",
  Beef: "Black Angus Selection",
  Fish: "Прясно уловена",
  Sides: "Идеално допълнение",
  Desserts: "Сладък финал",
};

const GOLD = "#D4A853";
const GOLD_LIGHT = "#E8C97A";

export default function Menu() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: table, isLoading: tableLoading } = trpc.table.byQrToken.useQuery(
    { qrToken: qrToken || "" },
    { enabled: !!qrToken }
  );

  const visitMutation = trpc.table.visit.useMutation();

  useEffect(() => {
    if (qrToken && table) {
      visitMutation.mutate({ qrToken });
    }
  }, [qrToken, table]);

  const { data: categories } = trpc.category.active.useQuery();
  const { data: products } = trpc.product.active.useQuery();

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 4000);
  };

  const filteredProducts = useMemo(() => {
    let list = (products as ProductItem[]) || [];
    if (activeCategory) {
      list = list.filter((p) => p.categoryId === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<number, ProductItem[]> = {};
    for (const p of filteredProducts) {
      if (!grouped[p.categoryId]) grouped[p.categoryId] = [];
      grouped[p.categoryId].push(p);
    }
    return grouped;
  }, [filteredProducts]);

  const categoryOrder = categories
    ?.filter((c) => productsByCategory[c.id]?.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Auto-rotate product images slideshow
  useEffect(() => {
    if (!selectedProduct) return;
    const allImages = getProductImages(selectedProduct);
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedProduct]);

  const getProductImages = (product: ProductItem) => {
    const imgs: string[] = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imgs.push(...product.images);
    } else if (product.image) {
      imgs.push(product.image);
    }
    return imgs;
  };

  const openProductDetail = (product: ProductItem) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const nextImage = () => {
    if (!selectedProduct) return;
    const imgs = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
  };

  const prevImage = () => {
    if (!selectedProduct) return;
    const imgs = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  const scrollToCategory = (catId: number) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-section-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!qrToken) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-light tracking-widest uppercase">Djanam</h1>
          <p className="text-gray-500">
            Моля, сканирайте QR кода на Вашата маса, за да разгледате менюто.
          </p>
        </div>
      </div>
    );
  }

  if (tableLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: GOLD }} />
      </div>
    );
  }

  if (!table) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl mb-2" style={{ color: GOLD }}>Невалиден QR код</h1>
          <p className="text-gray-500">
            Тази маса не съществува в системата. Моля, сканирайте валиден QR код.
          </p>
        </div>
      </div>
    );
  }

  const detailImages = selectedProduct ? getProductImages(selectedProduct) : [];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ─── Transparent Minimal Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-medium tracking-wider uppercase">Djanam</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={handleCallWaiter}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${GOLD}20` }}
          >
            <Bell className="w-4 h-4" style={{ color: GOLD }} />
          </button>
          <span className="text-xs text-gray-400 bg-white/5 backdrop-blur px-3 py-1.5 rounded-full">
            Table {table.name.replace(/\D/g, "") || table.name}
          </span>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative w-full h-[70vh] min-h-[500px]">
        {/* Hero background — gradient or image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,83,0.08)_0%,_transparent_70%)]" />
        </div>

        {/* Decorative glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: GOLD }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">
            Steak & Fish Restaurant
          </p>
          <div className="w-24 h-24 mb-6">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-wider uppercase mb-3">
            Djanam
          </h1>
          <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
            Every Detail for Your Pleasure
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ─── Waiter Notification ─── */}
      {waiterCalled && (
        <div className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-sm">
          <div
            className="rounded-2xl px-5 py-4 flex items-center gap-3 text-sm backdrop-blur-md border"
            style={{ backgroundColor: `${GOLD}15`, borderColor: `${GOLD}40`, color: GOLD_LIGHT }}
          >
            <Bell className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <span>Сервитьорът беше извикан! Моля, изчакайте.</span>
          </div>
        </div>
      )}

      {/* ─── Search Overlay ─── */}
      {showSearch && (
        <div className="fixed top-16 left-0 right-0 z-40 px-4">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              autoFocus
              placeholder="Търсене в менюто..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 bg-[#111]/90 backdrop-blur-xl border-[#333] text-white placeholder:text-gray-600 h-12 rounded-2xl focus-visible:ring-1 focus-visible:ring-offset-0"
              style={{ focusVisibleRingColor: GOLD }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── EXPLORE MENU Section Label ─── */}
      <section className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xs tracking-[0.25em] uppercase text-gray-400 font-medium">
            Explore Menu
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#333] to-transparent" />
        </div>
      </section>

      {/* ─── Horizontal Scrolling Products by Category ─── */}
      <div className="space-y-10 pb-32">
        {categoryOrder?.map((cat) => {
          const catProducts = productsByCategory[cat.id] || [];
          const catNameEn = cat.name.split(" / ")[1] || cat.name.split(" / ")[0];
          const emoji = categoryEmoji[catNameEn] || "🍽️";
          const subtitle = categorySubtitle[catNameEn] || "";

          return (
            <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-20">
              {/* Category title */}
              <div className="px-5 mb-4 flex items-end justify-between">
                <div>
                  <span className="text-2xl mr-2">{emoji}</span>
                  <span className="text-lg font-light">{cat.name.split(" / ")[0]}</span>
                  {subtitle && (
                    <p className="text-xs text-gray-600 mt-0.5 ml-8">{subtitle}</p>
                  )}
                </div>
                <span className="text-xs text-gray-600">{catProducts.length} items</span>
              </div>

              {/* Horizontal scroll cards */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {catProducts.map((product) => {
                  const imgs = getProductImages(product);
                  return (
                    <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="snap-start shrink-0 w-[280px] h-[380px] rounded-3xl overflow-hidden relative cursor-pointer group"
                    >
                      {/* Image */}
                      {imgs.length > 0 ? (
                        <img
                          src={imgs[0]}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                          <img src="./bull-icon.png" alt="" className="w-16 h-16 object-contain opacity-10" />
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        {/* Weight badge */}
                        {product.weight && (
                          <span className="inline-block text-[10px] text-gray-400 bg-white/10 backdrop-blur px-2 py-0.5 rounded-full mb-2">
                            {product.weight}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-light leading-tight mb-1">
                          {product.name}
                        </h3>

                        {/* Description */}
                        {product.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-light" style={{ color: GOLD }}>
                            {Number(product.priceEur).toFixed(0)}
                          </span>
                          <span className="text-sm" style={{ color: GOLD_LIGHT }}>€</span>
                          <span className="text-xs text-gray-600 ml-2">
                            {Number(product.priceBgn).toFixed(2)} лв.
                          </span>
                        </div>
                      </div>

                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 100%, ${GOLD}15 0%, transparent 60%)`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ─── Instagram / Social Section ─── */}
      <section className="px-5 py-12 border-t border-[#111]">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
              Share the Night
            </p>
            <h3 className="text-2xl font-light">
              Stay in the <span style={{ color: GOLD }}>Loop</span>
            </h3>
          </div>

          {/* Instagram handle */}
          <a
            href="https://instagram.com/djanam.restaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="w-4 h-4" style={{ color: GOLD }} />
            @djanam.restaurant
          </a>

          {/* Tagline */}
          <p className="text-xs text-gray-600 max-w-xs mx-auto">
            Tag us in your story — you might get a surprise
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-5 py-8 text-center border-t border-[#111]">
        <div className="w-8 h-8 mx-auto mb-3 opacity-30">
          <img src="./bull-icon.png" alt="" className="w-full h-full object-contain" />
        </div>
        <p className="text-[10px] text-gray-700 tracking-wider uppercase">
          Djanam Steak & Fish
        </p>
      </footer>

      {/* ─── Bottom Fixed Category Navigation ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-transparent pt-8 pb-4 px-2">
        <div className="flex gap-2 overflow-x-auto px-3 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs transition-all duration-300 border ${
              activeCategory === null
                ? "bg-white text-black border-white font-medium"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="block text-center">🍽️</span>
            <span className="block mt-0.5">Всички</span>
          </button>

          {categories?.map((cat) => {
            const catNameEn = cat.name.split(" / ")[1] || cat.name.split(" / ")[0];
            const emoji = categoryEmoji[catNameEn] || "🍽️";
            const subtitle = categorySubtitle[catNameEn] || "";
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs transition-all duration-300 border text-left ${
                  isActive
                    ? "bg-white text-black border-white font-medium"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="block">{emoji} {cat.name.split(" / ")[0]}</span>
                {subtitle && (
                  <span className={`block mt-0.5 text-[10px] ${isActive ? "text-gray-500" : "text-gray-600"}`}>
                    {subtitle}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── Floating Call Waiter Button ─── */}
      <button
        onClick={handleCallWaiter}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: GOLD }}
      >
        <Bell className="w-5 h-5 text-black" />
      </button>

      {/* ─── Product Detail Dialog ─── */}
      <Dialog open={!!selectedProduct} onOpenChange={closeProductDetail}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-black border-[#222] text-white p-0 gap-0 rounded-3xl">
          {selectedProduct && (
            <>
              {/* Image Gallery */}
              <div className="relative w-full aspect-square bg-[#0a0a0a]">
                {detailImages.length > 0 ? (
                  <img
                    src={detailImages[currentImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src="./bull-icon.png" alt="" className="w-24 h-24 object-contain opacity-10" />
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={closeProductDetail}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Navigation arrows */}
                {detailImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {detailImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? "bg-white" : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Category */}
                <span
                  className="text-[10px] tracking-[0.2em] uppercase font-medium"
                  style={{ color: GOLD }}
                >
                  {selectedProduct.category?.name?.split(" / ")[0] || "МЕНЮ"}
                </span>

                {/* Title */}
                <h2 className="text-3xl font-light leading-tight">
                  {selectedProduct.name}
                </h2>

                {/* Description */}
                {selectedProduct.description && (
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}

                {/* Weight */}
                {selectedProduct.weight && (
                  <span className="inline-block text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {selectedProduct.weight}
                  </span>
                )}

                {/* Divider */}
                <div className="border-t border-[#222]" />

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light" style={{ color: GOLD }}>
                    {Number(selectedProduct.priceEur).toFixed(0)}
                  </span>
                  <span className="text-lg" style={{ color: GOLD_LIGHT }}>€</span>
                  <span className="text-sm text-gray-600 ml-3">
                    {Number(selectedProduct.priceBgn).toFixed(2)} лв.
                  </span>
                </div>

                {/* Call Waiter CTA */}
                <Button
                  onClick={() => {
                    handleCallWaiter();
                    closeProductDetail();
                  }}
                  className="w-full text-black font-medium py-6 rounded-2xl text-base transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: GOLD }}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Извикай сервитьор
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
