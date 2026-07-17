import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { trNames, trDescriptions } from "@/i18n/tr";
import { bgNames } from "@/i18n/bg";
import {
  Search,
  X,
  Bell,
  Instagram,
  Globe,
  Salad,
  Sandwich,
  Croissant,
  UtensilsCrossed,
  Beef,
  Drumstick,
  Bird,
  Fish,
  CakeSlice,
  Wine,
  Martini,
  GlassWater,
  CupSoda,
  Citrus,
  Coffee,
  Check,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
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

type Lang = "bg" | "en" | "tr";

/* ─── Category presentation ─── */
const categoryIcon: Record<string, LucideIcon> = {
  Salads: Salad,
  Appetizer: Sandwich,
  Bread: Croissant,
  Starters: UtensilsCrossed,
  Beef: Beef,
  Lamb: Drumstick,
  Poultry: Bird,
  Fish: Fish,
  Desserts: CakeSlice,
  Whiskey: Wine,
  "Gin & Rum": Martini,
  Vodka: GlassWater,
  "Anise Drinks": GlassWater,
  Rakia: Wine,
  Liquors: Martini,
  Tequila: Citrus,
  Beer: Wine,
  "Soft Drinks": CupSoda,
  "Fresh Juices": Citrus,
  "Hot Drinks": Coffee,
};

const categorySubtitleBg: Record<string, string> = {
  Salads: "Свежи комбинации",
  Appetizer: "Перфектно начало",
  Bread: "Пресен и топъл",
  Starters: "Започнете със стил",
  Beef: "Black Angus селекция",
  Lamb: "Нежно и ароматно",
  Poultry: "Внимателно подбрано",
  Fish: "Прясно уловена",
  Desserts: "Сладък финал",
  Whiskey: "Отлежала селекция",
  "Gin & Rum": "Класика и новост",
  Vodka: "Премиум марки",
  "Anise Drinks": "Медитерански класики",
  Rakia: "Българска традиция",
  Liquors: "Сладки и ароматни",
  Tequila: "100% агаве",
  Beer: "Точно охладена",
  "Soft Drinks": "Освежаващи",
  "Fresh Juices": "Прясно изцедени",
  "Hot Drinks": "Кафе и чай",
};

const categorySubtitleEn: Record<string, string> = {
  Salads: "Fresh combinations",
  Appetizer: "The perfect start",
  Bread: "Fresh & warm",
  Starters: "Begin in style",
  Beef: "Black Angus selection",
  Lamb: "Tender & aromatic",
  Poultry: "Carefully sourced",
  Fish: "Freshly caught",
  Desserts: "A sweet finale",
  Whiskey: "Aged selection",
  "Gin & Rum": "Classics & new",
  Vodka: "Premium labels",
  "Anise Drinks": "Mediterranean classics",
  Rakia: "Bulgarian tradition",
  Liquors: "Sweet & aromatic",
  Tequila: "100% agave",
  Beer: "Perfectly chilled",
  "Soft Drinks": "Refreshing",
  "Fresh Juices": "Freshly squeezed",
  "Hot Drinks": "Coffee & tea",
};

const categorySubtitleTr: Record<string, string> = {
  Salads: "Taze kombinasyonlar",
  Appetizer: "Mükemmel bir başlangıç",
  Bread: "Taze ve sıcak",
  Starters: "Tarz bir başlangıç",
  Beef: "Black Angus seçkisi",
  Lamb: "Yumuşak ve aromatik",
  Poultry: "Özenle seçilmiş",
  Fish: "Taze tutulmuş",
  Desserts: "Tatlı bir final",
  Whiskey: "Yıllanmış seçki",
  "Gin & Rum": "Klasikler ve yeniler",
  Vodka: "Premium markalar",
  "Anise Drinks": "Akdeniz klasikleri",
  Rakia: "Balkan geleneği",
  Liquors: "Tatlı ve aromatik",
  Tequila: "%100 agave",
  Beer: "Buz gibi",
  "Soft Drinks": "Serinletici",
  "Fresh Juices": "Taze sıkılmış",
  "Hot Drinks": "Kahve ve çay",
};

const categoryNameTr: Record<string, string> = {
  Salads: "Salatalar",
  Appetizer: "Mezeler",
  Bread: "Ekmek",
  Starters: "Başlangıçlar",
  Beef: "Dana Eti",
  Lamb: "Kuzu Eti",
  Poultry: "Kümes Hayvanları",
  Fish: "Balık",
  Desserts: "Tatlılar",
  Whiskey: "Viski",
  "Gin & Rum": "Cin & Rom",
  Vodka: "Votka",
  "Anise Drinks": "Anason İçkileri",
  Rakia: "Rakı",
  Liquors: "Likörler",
  Tequila: "Tekila",
  Beer: "Bira",
  "Soft Drinks": "Alkolsüz İçecekler",
  "Fresh Juices": "Taze Sıkma",
  "Hot Drinks": "Sıcak İçecekler",
};

const categorySubtitle: Record<Lang, Record<string, string>> = {
  bg: categorySubtitleBg,
  en: categorySubtitleEn,
  tr: categorySubtitleTr,
};

/* ─── UI strings ─── */
const t = {
  bg: {
    tagline: "Стейк & риба · Варна",
    heroSub: "Всеки детайл за Вашето удоволствие",
    scroll: "Разгледайте менюто",
    explore: "Меню",
    search: "Търсене в менюто…",
    searchResults: "резултата",
    noResults: "Нищо не е намерено. Опитайте с друга дума.",
    items: "артикула",
    all: "Всички",
    callWaiter: "Извикай сервитьор",
    waiterCalled: "Сервитьорът беше извикан! Моля, изчакайте.",
    table: "Маса",
    scanPrompt: "Моля, сканирайте QR кода на Вашата маса, за да разгледате менюто.",
    invalidQr: "Невалиден QR код",
    invalidQrSub: "Тази маса не съществува в системата. Моля, сканирайте валиден QR код.",
    shareNight: "Споделете вечерта",
    stayLoop: "Последвайте ни",
    tagUs: "Отбележете ни в сторито си — може да получите изненада",
    weight: "Грамаж",
    menu: "Меню",
  },
  en: {
    tagline: "Steak & Fish · Varna",
    heroSub: "Every detail for your pleasure",
    scroll: "Explore the menu",
    explore: "Menu",
    search: "Search the menu…",
    searchResults: "results",
    noResults: "Nothing found. Try another word.",
    items: "items",
    all: "All",
    callWaiter: "Call the waiter",
    waiterCalled: "The waiter has been called! Please wait.",
    table: "Table",
    scanPrompt: "Please scan the QR code on your table to view the menu.",
    invalidQr: "Invalid QR code",
    invalidQrSub: "This table does not exist. Please scan a valid QR code.",
    shareNight: "Share the night",
    stayLoop: "Stay in the loop",
    tagUs: "Tag us in your story — you might get a surprise",
    weight: "Weight",
    menu: "Menu",
  },
  tr: {
    tagline: "Biftek & Balık · Varna",
    heroSub: "Keyfiniz için her detay",
    scroll: "Menüyü keşfedin",
    explore: "Menü",
    search: "Menüde ara…",
    searchResults: "sonuç",
    noResults: "Sonuç bulunamadı. Başka bir kelime deneyin.",
    items: "ürün",
    all: "Tümü",
    callWaiter: "Garsonu çağır",
    waiterCalled: "Garson çağrıldı! Lütfen bekleyin.",
    table: "Masa",
    scanPrompt: "Menüyü görüntülemek için lütfen masanızdaki QR kodu okutun.",
    invalidQr: "Geçersiz QR kod",
    invalidQrSub: "Bu masa sistemde mevcut değil. Lütfen geçerli bir QR kod okutun.",
    shareNight: "Geceyi paylaşın",
    stayLoop: "Bizi takip edin",
    tagUs: "Hikayenizde bizi etiketleyin — sürpriz kazanabilirsiniz",
    weight: "Gramaj",
    menu: "Menü",
  },
} as const;

const ACCENT = "#E30614";
const ACCENT_LIGHT = "#FF4D5E";

/* ─── Helpers ─── */
function splitCatName(full: string): { bg: string; en: string } {
  const parts = full.split(" / ");
  return { bg: parts[0], en: parts[1] || parts[0] };
}

/* ─── Scroll reveal wrapper ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export default function Menu() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("djanam-lang");
      return saved === "en" || saved === "tr" ? saved : "bg";
    } catch {
      return "bg";
    }
  });
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const s = t[lang];

  /* Browse mode: /menu/browse — public menu view from the website (no table, no waiter) */
  const isBrowse = qrToken === "browse";

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    setShowLangMenu(false);
    try {
      localStorage.setItem("djanam-lang", next);
    } catch {}
  }, []);

  const { data: table, isLoading: tableLoading } = trpc.table.byQrToken.useQuery(
    { qrToken: qrToken || "" },
    { enabled: !!qrToken && !isBrowse }
  );

  const visitMutation = trpc.table.visit.useMutation();

  useEffect(() => {
    if (qrToken && table && !isBrowse) {
      visitMutation.mutate({ qrToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrToken, table]);

  const { data: categories, isLoading: catsLoading } = trpc.category.active.useQuery();
  const { data: products, isLoading: prodsLoading } = trpc.product.active.useQuery();

  const handleCallWaiter = useCallback(() => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 4000);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = (products as ProductItem[]) || [];
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
  }, [products, searchQuery]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<number, ProductItem[]> = {};
    for (const p of filteredProducts) {
      if (!grouped[p.categoryId]) grouped[p.categoryId] = [];
      grouped[p.categoryId].push(p);
    }
    return grouped;
  }, [filteredProducts]);

  const categoryOrder = useMemo(
    () =>
      categories
        ?.filter((c) => productsByCategory[c.id]?.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories, productsByCategory]
  );

  /* Scrollspy — highlight the category currently in view */
  useEffect(() => {
    if (!categoryOrder?.length) return;
    const sections = categoryOrder
      .map((c) => document.getElementById(`cat-section-${c.id}`))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = Number(e.target.id.replace("cat-section-", ""));
            setActiveCategory(id);
          }
        }
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    sections.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [categoryOrder]);

  const scrollToCategory = (catId: number) => {
    const el = document.getElementById(`cat-section-${catId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const productName = (p: ProductItem) =>
    lang === "tr"
      ? trNames[p.name] || p.nameEn || p.name
      : lang === "en"
        ? p.nameEn || p.name
        : bgNames[p.name] || p.name;

  const productDesc = (p: ProductItem): string | null => {
    if (!p.description) return null;
    const parts = p.description.split(" / ");
    const bg = parts[0];
    const en = parts.length > 1 ? parts.slice(1).join(" / ") : null;
    if (lang === "bg") return bg;
    if (lang === "en") return en ?? bg;
    return trDescriptions[p.name] ?? en ?? bg;
  };

  const catName = (full: string) => {
    const names = splitCatName(full);
    return lang === "tr" ? categoryNameTr[names.en] || names.en : lang === "en" ? names.en : names.bg;
  };

  const searchResults = searchQuery.trim() ? filteredProducts : [];

  /* Gallery images for the open product sheet */
  const sheetImages = useMemo(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.images && selectedProduct.images.length > 0) return selectedProduct.images;
    return selectedProduct.image ? [selectedProduct.image] : [];
  }, [selectedProduct]);

  useEffect(() => {
    setImgIdx(0);
  }, [selectedProduct]);

  /* ─── Landing (no QR) ─── */
  if (!qrToken) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-display text-5xl tracking-wide">Djanam</h1>
            <p className="mt-2 text-[11px] tracking-[0.35em] uppercase text-neutral-500">Steak & Fish</p>
          </div>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: `${ACCENT}60` }} />
          <p className="text-neutral-400 leading-relaxed">{s.scanPrompt}</p>
        </div>
      </div>
    );
  }

  /* ─── Loading ─── */
  if (tableLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 p-6">
        <div className="skeleton w-20 h-20 rounded-full" />
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded" />
      </div>
    );
  }

  if (!isBrowse && !table) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="font-display text-2xl" style={{ color: ACCENT_LIGHT }}>{s.invalidQr}</h1>
          <p className="text-neutral-500">{s.invalidQrSub}</p>
        </div>
      </div>
    );
  }

  const dataLoading = catsLoading || prodsLoading;

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f2ec] overflow-x-hidden">
      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9">
            <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
          </div>
          <span className="font-display text-base tracking-wide">Djanam</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              aria-label="Switch language"
              aria-expanded={showLangMenu}
              className="h-9 px-3 rounded-full bg-white/[0.07] backdrop-blur flex items-center gap-1.5 hover:bg-white/[0.14] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[11px] font-medium tracking-wider uppercase">{lang}</span>
            </button>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="animate-fade-in absolute right-0 top-11 z-50 w-40 rounded-2xl border border-[#262626] bg-[#0e0e0e] shadow-2xl overflow-hidden">
                  {([
                    ["bg", "Български"],
                    ["en", "English"],
                    ["tr", "Türkçe"],
                  ] as [Lang, string][]).map(([code, label]) => (
                    <button
                      key={code}
                      onClick={() => changeLang(code)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        lang === code ? "text-[#E8C97A] bg-white/[0.06]" : "text-neutral-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      {label}
                      {lang === code && <Check className="w-4 h-4" style={{ color: ACCENT_LIGHT }} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            aria-label={s.search}
            className="w-9 h-9 rounded-full bg-white/[0.07] backdrop-blur flex items-center justify-center hover:bg-white/[0.14] transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
          {!isBrowse && table && (
            <span className="text-[11px] text-neutral-300 bg-white/[0.07] backdrop-blur px-3 py-2 rounded-full tracking-wide">
              {s.table} {table.name.replace(/\D/g, "") || table.name}
            </span>
          )}
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[72vh] min-h-[520px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(227,6,20,0.07)_0%,_transparent_65%)]" />
        <div
          className="animate-hero-glow absolute top-1/2 left-1/2 w-[26rem] h-[26rem] rounded-full blur-[130px]"
          style={{ backgroundColor: ACCENT }}
        />
        <div className="relative text-center px-6">
          <Reveal>
            <div className="w-20 h-20 mx-auto mb-7">
              <img src="./bull-icon.png" alt="Djanam" className="w-full h-full object-contain" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[11px] tracking-[0.4em] uppercase mb-5" style={{ color: ACCENT_LIGHT }}>
              {s.tagline}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <h1 className="font-display text-6xl md:text-8xl tracking-wide leading-none">Djanam</h1>
          </Reveal>
          <Reveal delay={340}>
            <p className="mt-5 text-sm text-neutral-400 tracking-wide font-light">{s.heroSub}</p>
          </Reveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">{s.scroll}</span>
          <div className="w-px h-10 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </section>

      {/* ─── Waiter toast ─── */}
      {waiterCalled && (
        <div className="animate-fade-in fixed top-20 left-4 right-4 z-50 mx-auto max-w-sm">
          <div
            className="rounded-2xl px-5 py-4 flex items-center gap-3 text-sm backdrop-blur-md border shadow-2xl"
            style={{ backgroundColor: `${ACCENT}18`, borderColor: `${ACCENT}45`, color: ACCENT_LIGHT }}
          >
            <Bell className="w-5 h-5 shrink-0" style={{ color: ACCENT_LIGHT }} />
            <span>{s.waiterCalled}</span>
          </div>
        </div>
      )}

      {/* ─── Search overlay ─── */}
      {showSearch && (
        <div className="animate-fade-in fixed inset-0 z-50 bg-black/85 backdrop-blur-md" onClick={() => setShowSearch(false)}>
          <div className="max-w-lg mx-auto px-5 pt-24" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                autoFocus
                placeholder={s.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-[#111] border border-[#2a2a2a] rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E30614]/50 text-base"
              />
              <button
                onClick={() => { setSearchQuery(""); setShowSearch(false); }}
                aria-label="Close search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] divide-y divide-[#161616]">
                {searchResults.length === 0 && (
                  <p className="p-5 text-sm text-neutral-500">{s.noResults}</p>
                )}
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProduct(p); setShowSearch(false); }}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="font-display text-[15px] truncate">{productName(p)}</p>
                      {productDesc(p) && (
                        <p className="text-xs text-neutral-500 truncate mt-0.5">{productDesc(p)}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-display text-lg" style={{ color: ACCENT_LIGHT }}>
                      {Number(p.priceEur).toFixed(2)}€
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Menu sections ─── */}
      <main className="max-w-2xl mx-auto px-5 pb-44">
        <Reveal className="pt-4 pb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] tracking-[0.35em] uppercase font-medium" style={{ color: ACCENT_LIGHT }}>
              {s.explore}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
          </div>
        </Reveal>

        {dataLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-8 space-y-4">
              <div className="skeleton h-6 w-40 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
            </div>
          ))}

        {categoryOrder?.map((cat) => {
          const catProducts = productsByCategory[cat.id] || [];
          const names = splitCatName(cat.name);
          const Icon = categoryIcon[names.en] || UtensilsCrossed;
          const subtitle = categorySubtitle[lang][names.en] || "";

          return (
            <section key={cat.id} id={`cat-section-${cat.id}`} className="scroll-mt-24 pt-10">
              <Reveal>
                <div className="flex items-end justify-between mb-1">
                  <div className="flex items-center gap-3.5">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: `${ACCENT}12`, borderColor: `${ACCENT}30` }}
                    >
                      <Icon className="w-[18px] h-[18px]" style={{ color: ACCENT_LIGHT }} />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl leading-tight">
                        {catName(cat.name)}
                      </h3>
                      {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5 tracking-wide">{subtitle}</p>}
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-600 tabular-nums">
                    {catProducts.length} {s.items}
                  </span>
                </div>
                <div className="h-px mt-4 mb-2" style={{ background: `linear-gradient(to right, ${ACCENT}50, transparent)` }} />
              </Reveal>

              <div>
                {catProducts.map((p, idx) => (
                  <Reveal key={p.id} delay={Math.min(idx * 40, 200)}>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="w-full text-left py-4 group cursor-pointer border-b border-[#121212] last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product photo (when available) */}
                        {p.image && (
                          <span className="block w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#222] bg-[#0d0d0d]">
                            <img
                              src={p.image}
                              alt={productName(p)}
                              loading="lazy"
                              onError={(e) => {
                                const wrap = e.currentTarget.closest("span");
                                if (wrap) wrap.style.display = "none";
                              }}
                              className="animate-photo-in w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-4">
                            <h4 className="font-display text-[17px] leading-snug group-hover:text-[#E8C97A] transition-colors duration-300">
                              {productName(p)}
                            </h4>
                            <div className="flex items-baseline gap-2 shrink-0">
                              <span className="font-display text-lg tabular-nums" style={{ color: ACCENT_LIGHT }}>
                                {Number(p.priceEur).toFixed(2)}
                                <span className="text-sm ml-0.5">€</span>
                              </span>
                              <span className="text-[11px] text-neutral-600 tabular-nums">
                                {Number(p.priceBgn).toFixed(2)} лв.
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {p.weight && (
                              <span className="text-[10px] text-neutral-500 tracking-wide uppercase shrink-0">
                                {p.weight}
                              </span>
                            )}
                            {productDesc(p) && (
                              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
                                {productDesc(p)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}

        {/* ─── Instagram ─── */}
        <Reveal className="mt-16">
          <section className="text-center space-y-5 py-10 border-t border-[#141414]">
            <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-500">{s.shareNight}</p>
            <h3 className="font-display text-3xl">
              {s.stayLoop}
            </h3>
            <a
              href="https://instagram.com/djanam.restaurant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" style={{ color: ACCENT_LIGHT }} />
              @djanam.restaurant
            </a>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">{s.tagUs}</p>
          </section>
        </Reveal>

        <footer className="pt-6 pb-2 text-center border-t border-[#141414]">
          <div className="w-8 h-8 mx-auto mb-3 opacity-30">
            <img src="./bull-icon.png" alt="" className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] text-neutral-700 tracking-[0.25em] uppercase">Djanam Steak & Fish</p>
        </footer>
      </main>

      {/* ─── Bottom category nav ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
          {categoryOrder?.map((cat) => {
            const names = splitCatName(cat.name);
            const Icon = categoryIcon[names.en] || UtensilsCrossed;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                aria-label={catName(cat.name)}
                className={`shrink-0 flex items-center gap-2 px-4 h-11 rounded-2xl text-xs transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "text-white font-medium"
                    : "bg-white/[0.05] text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
                style={isActive ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{catName(cat.name)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── Floating waiter button ─── */}
      {!isBrowse && (
        <button
          onClick={handleCallWaiter}
          aria-label={s.callWaiter}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/50 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          style={{ backgroundColor: ACCENT }}
        >
          <Bell className="w-5 h-5 text-white" />
        </button>
      )}

      {/* ─── Product bottom sheet ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="animate-sheet-up absolute bottom-0 left-0 right-0 max-w-lg mx-auto max-h-[85vh] overflow-y-auto bg-[#0b0b0b] border-t border-[#262626] rounded-t-[2rem] pb-10">
            {/* Handle */}
            <div className="sticky top-0 pt-3 pb-2 bg-[#0b0b0b] flex justify-center rounded-t-[2rem]">
              <div className="w-10 h-1 rounded-full bg-neutral-700" />
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
              className="absolute top-4 right-5 w-9 h-9 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-7 pt-4 space-y-6">
              {sheetImages.length > 0 && (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#111]">
                  <img
                    key={sheetImages[imgIdx]}
                    src={sheetImages[imgIdx]}
                    alt={productName(selectedProduct)}
                    onError={(e) => {
                      const wrap = e.currentTarget.closest("div");
                      if (wrap) wrap.style.display = "none";
                    }}
                    className="animate-photo-in animate-kenburns w-full h-full object-cover"
                  />
                  {sheetImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx((imgIdx - 1 + sheetImages.length) % sheetImages.length)}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setImgIdx((imgIdx + 1) % sheetImages.length)}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {sheetImages.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/40"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: ACCENT_LIGHT }}>
                  {selectedProduct.category?.name ? catName(selectedProduct.category.name) : s.menu}
                </span>
                <h2 className="font-display text-3xl leading-tight mt-2">{productName(selectedProduct)}</h2>
                {lang === "bg" && selectedProduct.nameEn && selectedProduct.nameEn !== selectedProduct.name && (
                  <p className="text-sm text-neutral-500 mt-1 font-light italic">{selectedProduct.nameEn}</p>
                )}
              </div>

              {productDesc(selectedProduct) && (
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {productDesc(selectedProduct)}
                </p>
              )}

              {selectedProduct.weight && (
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="uppercase tracking-wider">{s.weight}</span>
                  <span className="text-neutral-300">{selectedProduct.weight}</span>
                </div>
              )}

              <div className="h-px bg-[#1c1c1c]" />

              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl tabular-nums" style={{ color: ACCENT_LIGHT }}>
                    {Number(selectedProduct.priceEur).toFixed(2)}
                  </span>
                  <span className="text-lg" style={{ color: ACCENT_LIGHT }}>€</span>
                </div>
                <span className="text-sm text-neutral-500 tabular-nums">
                  {Number(selectedProduct.priceBgn).toFixed(2)} лв.
                </span>
              </div>

              {!isBrowse && (
                <button
                  onClick={() => {
                    handleCallWaiter();
                    setSelectedProduct(null);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 text-white font-medium py-4 rounded-2xl text-[15px] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {s.callWaiter}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
