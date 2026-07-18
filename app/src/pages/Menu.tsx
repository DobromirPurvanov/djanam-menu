import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { bgNames } from "@/i18n/bg";
import { trDescriptions, trNames } from "@/i18n/tr";
import {
  Beef,
  Bird,
  CakeSlice,
  Check,
  ChevronLeft,
  ChevronRight,
  Citrus,
  Coffee,
  Croissant,
  CupSoda,
  Fish,
  GlassWater,
  Globe,
  Instagram,
  Martini,
  RefreshCw,
  Salad,
  Sandwich,
  Search,
  UtensilsCrossed,
  Wine,
  X,
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

const categoryIcon: Record<string, LucideIcon> = {
  Salads: Salad,
  Appetizer: Sandwich,
  Bread: Croissant,
  Starters: UtensilsCrossed,
  Beef,
  Lamb: Beef,
  Poultry: Bird,
  Fish,
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

const categorySubtitle: Record<Lang, Record<string, string>> = {
  bg: {
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
  },
  en: {
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
  },
  tr: {
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
  },
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

const t = {
  bg: {
    tagline: "Стейк & риба · Варна",
    heroSub: "Всеки детайл за Вашето удоволствие",
    scroll: "Разгледайте менюто",
    menu: "Меню",
    categories: "Категории",
    search: "Търсене в менюто…",
    noResults: "Няма намерени предложения. Опитайте с друга дума.",
    items: "предложения",
    shareNight: "Споделете вечерта",
    stayLoop: "Последвайте ни",
    tagUs: "Отбележете ни в сторито си — може да получите изненада",
    weight: "Количество",
    close: "Затвори",
    language: "Избор на език",
    loadError: "Менюто не можа да се зареди.",
    retry: "Опитайте отново",
  },
  en: {
    tagline: "Steak & Fish · Varna",
    heroSub: "Every detail for your pleasure",
    scroll: "Explore the menu",
    menu: "Menu",
    categories: "Categories",
    search: "Search the menu…",
    noResults: "No dishes found. Try another search.",
    items: "items",
    shareNight: "Share the night",
    stayLoop: "Stay in the loop",
    tagUs: "Tag us in your story — you might get a surprise",
    weight: "Serving",
    close: "Close",
    language: "Choose language",
    loadError: "The menu could not be loaded.",
    retry: "Try again",
  },
  tr: {
    tagline: "Biftek & Balık · Varna",
    heroSub: "Keyfiniz için her detay",
    scroll: "Menüyü keşfedin",
    menu: "Menü",
    categories: "Kategoriler",
    search: "Menüde ara…",
    noResults: "Sonuç bulunamadı. Başka bir kelime deneyin.",
    items: "ürün",
    shareNight: "Geceyi paylaşın",
    stayLoop: "Bizi takip edin",
    tagUs: "Hikayenizde bizi etiketleyin — sürpriz kazanabilirsiniz",
    weight: "Porsiyon",
    close: "Kapat",
    language: "Dil seçin",
    loadError: "Menü yüklenemedi.",
    retry: "Tekrar deneyin",
  },
} as const;

const ACCENT = "#E30614";
const MENU_IMAGE_BASE = "./images/menu";
const PRODUCT_IMAGE_BASE = "./images/products";

const unitLabel: Record<Lang, { g: string; ml: string; l: string }> = {
  bg: { g: "г", ml: "мл", l: "л" },
  en: { g: "g", ml: "ml", l: "l" },
  tr: { g: "g", ml: "ml", l: "l" },
};

const priceFormatter: Record<Lang, Intl.NumberFormat> = {
  bg: new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  en: new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  tr: new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

function splitCatName(full: string): { bg: string; en: string } {
  const parts = full.split(" / ");
  return { bg: parts[0], en: parts[1] || parts[0] };
}

function stripTrailingServing(name: string): string {
  return name
    .replace(/\s+\d+(?:[.,]\d+)?\s*(?:мл|ml|л|l|гр|г|gr|g)\.?$/i, "")
    .trim();
}

function formatServing(value: string, lang: Lang): string {
  const units = unitLabel[lang];
  return value
    .trim()
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:мл|ml)(?=$|\s|\/)/gi, `$1 ${units.ml}`)
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:гр|г|gr|g)(?=$|\s|\/)/gi, `$1 ${units.g}`)
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:л|l)(?=$|\s|\/)/gi, `$1 ${units.l}`)
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPrice(value: string, lang: Lang): string {
  const number = Number(value);
  return Number.isFinite(number) ? priceFormatter[lang].format(number) : value;
}

function customProductImages(product: ProductItem): string[] {
  const gallery = product.images?.filter(Boolean) ?? [];
  if (gallery.length) return gallery;
  return product.image ? [product.image] : [];
}

function productImageSlug(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stockProductImage(product: ProductItem): string {
  return `${PRODUCT_IMAGE_BASE}/${productImageSlug(product.name)}.jpg`;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function Menu() {
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
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const s = t[lang];

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = trpc.category.active.useQuery();
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = trpc.product.active.useQuery();

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    setShowLangMenu(false);
    try {
      localStorage.setItem("djanam-lang", next);
    } catch {
      // The menu still works when storage is disabled.
    }
  }, []);

  const productName = useCallback(
    (product: ProductItem) => {
      const translatedName =
        lang === "tr"
          ? trNames[product.name] || product.nameEn || product.name
          : lang === "en"
            ? product.nameEn || product.name
            : bgNames[product.name] || product.name;
      return stripTrailingServing(translatedName);
    },
    [lang]
  );

  const productDescription = useCallback(
    (product: ProductItem): string | null => {
      if (!product.description) return null;
      const parts = product.description.split(" / ");
      const bg = parts[0];
      const en = parts.length > 1 ? parts.slice(1).join(" / ") : null;
      if (lang === "bg") return bg;
      if (lang === "en") return en ?? bg;
      return trDescriptions[product.name] ?? en ?? bg;
    },
    [lang]
  );

  const categoryName = useCallback(
    (full: string) => {
      const names = splitCatName(full);
      if (lang === "tr") return categoryNameTr[names.en] || names.en;
      return lang === "en" ? names.en : names.bg;
    },
    [lang]
  );

  const filteredProducts = useMemo(() => {
    const list = (products as ProductItem[] | undefined) ?? [];
    const query = searchQuery
      .trim()
      .toLocaleLowerCase(lang === "tr" ? "tr" : "bg");
    if (!query) return list;

    return list.filter(product => {
      const searchable = [
        product.name,
        product.nameEn,
        bgNames[product.name],
        trNames[product.name],
        productDescription(product),
        product.category?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(lang === "tr" ? "tr" : "bg");
      return searchable.includes(query);
    });
  }, [lang, productDescription, products, searchQuery]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<number, ProductItem[]> = {};
    for (const product of filteredProducts) {
      (grouped[product.categoryId] ??= []).push(product);
    }
    return grouped;
  }, [filteredProducts]);

  const categoryOrder = useMemo(
    () =>
      [...(categories ?? [])]
        .filter(category => productsByCategory[category.id]?.length > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [categories, productsByCategory]
  );

  const sheetImages = useMemo(() => {
    if (!selectedProduct) return [];
    const customImages = customProductImages(selectedProduct);
    return customImages.length
      ? customImages
      : [stockProductImage(selectedProduct)];
  }, [selectedProduct]);

  const sheetUsesStock = selectedProduct
    ? customProductImages(selectedProduct).length === 0
    : false;

  const dataLoading = categoriesLoading || productsLoading;
  const dataError = categoriesError || productsError;

  const retryLoading = () => {
    void Promise.all([refetchCategories(), refetchProducts()]);
  };

  const scrollToCategory = (categoryId: number) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.getElementById(`cat-section-${categoryId}`)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!categoryOrder.length) return;
    const sections = categoryOrder
      .map(category => document.getElementById(`cat-section-${category.id}`))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          setActiveCategory(
            Number(visible.target.id.replace("cat-section-", ""))
          );
        }
      },
      { rootMargin: "-18% 0px -68% 0px" }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [categoryOrder]);

  useEffect(() => {
    if (showSearch) {
      window.setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  useEffect(() => {
    setImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    const modalOpen = showSearch || Boolean(selectedProduct);
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct, showSearch]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${s.menu} | Djanam Steak & Fish`;
  }, [lang, s.menu]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-[#f5f2ec]">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          headerSolid
            ? "border-white/[0.07] bg-[#050505]/95 shadow-2xl shadow-black/20 backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Djanam Steak & Fish"
          >
            <img
              src="./bull-icon.png"
              alt=""
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-base tracking-wide">Djanam</span>
          </a>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(open => !open)}
                aria-label={s.language}
                aria-expanded={showLangMenu}
                className="flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 backdrop-blur transition-colors hover:bg-white/[0.14]"
              >
                <Globe className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {lang}
                </span>
              </button>
              {showLangMenu && (
                <>
                  <button
                    type="button"
                    aria-label={s.close}
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="animate-fade-in absolute right-0 top-[3.25rem] z-50 w-40 overflow-hidden rounded-2xl border border-[#2b2b2b] bg-[#0e0e0e] shadow-2xl">
                    {(
                      [
                        ["bg", "Български"],
                        ["en", "English"],
                        ["tr", "Türkçe"],
                      ] as [Lang, string][]
                    ).map(([code, label]) => (
                      <button
                        type="button"
                        key={code}
                        onClick={() => changeLang(code)}
                        className={`flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                          lang === code
                            ? "bg-white/[0.06] text-[#FF4D5E]"
                            : "text-neutral-300 hover:bg-white/[0.05]"
                        }`}
                      >
                        {label}
                        {lang === code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSearch(true)}
              aria-label={s.search}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] backdrop-blur transition-colors hover:bg-white/[0.14]"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="top"
          className="relative flex h-[72svh] min-h-[540px] items-center justify-center overflow-hidden"
        >
          <img
            src={`${MENU_IMAGE_BASE}/steak.webp`}
            alt=""
            aria-hidden="true"
            width="1600"
            height="1200"
            fetchPriority="high"
            className="animate-kenburns absolute inset-0 h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/70 to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(227,6,20,0.18)_0%,_transparent_62%)]" />
          <div
            className="animate-hero-glow absolute left-1/2 top-1/2 h-[26rem] w-[26rem] rounded-full blur-[130px]"
            style={{ backgroundColor: ACCENT }}
          />
          <div className="relative px-6 text-center">
            <Reveal>
              <img
                src="./bull-icon.png"
                alt=""
                className="mx-auto mb-7 h-20 w-20 object-contain"
              />
            </Reveal>
            <Reveal delay={100}>
              <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-[#FF4D5E]">
                {s.tagline}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <h1 className="font-display text-6xl leading-none tracking-wide md:text-8xl">
                Djanam
              </h1>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-5 text-sm font-light tracking-wide text-neutral-400">
                {s.heroSub}
              </p>
            </Reveal>
          </div>
          <a
            href="#menu-content"
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[#8a8a8a] transition-colors hover:text-white"
          >
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.3em]">
              {s.scroll}
            </span>
            <span className="h-10 w-px bg-gradient-to-b from-current to-transparent" />
          </a>
        </section>

        <div
          id="menu-content"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-36 pt-4 md:px-8 lg:pb-24"
        >
          <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-3">
                <p className="px-3 pb-3 pt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8a8a8a]">
                  {s.categories}
                </p>
                <nav aria-label={s.categories} className="space-y-1">
                  {categoryOrder.map(category => {
                    const names = splitCatName(category.name);
                    const Icon = categoryIcon[names.en] || UtensilsCrossed;
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        type="button"
                        key={category.id}
                        onClick={() => scrollToCategory(category.id)}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-[#E30614] text-white"
                            : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {categoryName(category.name)}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="mx-auto w-full max-w-3xl">
              <Reveal className="pb-2 pt-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#FF4D5E]">
                    {s.menu}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#2a2a2a] to-transparent" />
                </div>
              </Reveal>

              {dataLoading && (
                <div aria-label="Loading menu" className="space-y-10 py-10">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <div className="skeleton h-7 w-44 rounded-lg" />
                      <div className="skeleton h-20 w-full rounded-2xl" />
                      <div className="skeleton h-20 w-full rounded-2xl" />
                    </div>
                  ))}
                </div>
              )}

              {dataError && !dataLoading && (
                <div className="my-12 rounded-3xl border border-[#E30614]/25 bg-[#E30614]/[0.06] px-6 py-10 text-center">
                  <p className="text-neutral-300">{s.loadError}</p>
                  <button
                    type="button"
                    onClick={retryLoading}
                    className="mx-auto mt-5 flex min-h-11 items-center gap-2 rounded-full bg-[#E30614] px-5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {s.retry}
                  </button>
                </div>
              )}

              {!dataLoading && !dataError && categoryOrder.length === 0 && (
                <p className="py-16 text-center text-sm text-[#8a8a8a]">
                  {s.noResults}
                </p>
              )}

              {!dataLoading &&
                !dataError &&
                categoryOrder.map(category => {
                  const categoryProducts =
                    productsByCategory[category.id] || [];
                  const names = splitCatName(category.name);
                  const Icon = categoryIcon[names.en] || UtensilsCrossed;
                  const subtitle = categorySubtitle[lang][names.en] || "";

                  return (
                    <section
                      key={category.id}
                      id={`cat-section-${category.id}`}
                      className="scroll-mt-24 pt-10"
                    >
                      <Reveal>
                        <div className="mb-1 flex items-end justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E30614]/30 bg-[#E30614]/[0.08]">
                              <Icon className="h-[18px] w-[18px] text-[#FF4D5E]" />
                            </span>
                            <div>
                              <h3 className="font-display text-2xl leading-tight">
                                {categoryName(category.name)}
                              </h3>
                              {subtitle && (
                                <p className="mt-0.5 text-[11px] tracking-wide text-[#8a8a8a]">
                                  {subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] tabular-nums text-[#777]">
                            {categoryProducts.length} {s.items}
                          </span>
                        </div>
                        <div className="mb-2 mt-4 h-px bg-gradient-to-r from-[#E30614]/30 to-transparent" />
                      </Reveal>

                      <div className="space-y-1">
                        {categoryProducts.map((product, index) => {
                          const customImages = customProductImages(product);
                          const hasCustomImage = customImages.length > 0;
                          const stockImage = stockProductImage(product);
                          const cardImage = customImages[0] ?? stockImage;

                          return (
                            <Reveal
                              key={product.id}
                              delay={Math.min(index * 30, 150)}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedProduct(product)}
                                className="group -mx-3 w-[calc(100%+1.5rem)] cursor-pointer rounded-[1.35rem] border border-transparent px-3 py-3.5 text-left transition-colors duration-200 hover:border-white/[0.06] hover:bg-white/[0.035]"
                              >
                                <span className="flex items-start gap-3.5 md:gap-4">
                                  <span className="block h-20 w-20 shrink-0 overflow-hidden rounded-[1.1rem] border border-white/[0.08] bg-[#0d0d0d] shadow-lg shadow-black/20 md:h-24 md:w-24">
                                    <img
                                      src={cardImage}
                                      alt={
                                        hasCustomImage
                                          ? productName(product)
                                          : ""
                                      }
                                      aria-hidden={!hasCustomImage}
                                      width="96"
                                      height="96"
                                      loading="lazy"
                                      decoding="async"
                                      onError={event => {
                                        const image = event.currentTarget;
                                        if (
                                          hasCustomImage &&
                                          image.dataset.stockApplied !== "true"
                                        ) {
                                          image.dataset.stockApplied = "true";
                                          image.src = stockImage;
                                          image.alt = "";
                                          image.setAttribute(
                                            "aria-hidden",
                                            "true"
                                          );
                                          return;
                                        }
                                        image.parentElement?.remove();
                                      }}
                                      className="menu-photo animate-photo-in h-full w-full object-cover"
                                    />
                                  </span>
                                  <span className="min-w-0 flex-1 pt-0.5">
                                    <span className="flex items-start justify-between gap-3">
                                      <span className="font-display text-[18px] leading-[1.3] transition-colors duration-200 group-hover:text-[#FF4D5E] md:text-[19px]">
                                        {productName(product)}
                                      </span>
                                      <span className="flex shrink-0 flex-col items-end">
                                        <span className="font-display text-lg tabular-nums text-[#FF4D5E] md:text-xl">
                                          {formatPrice(product.priceEur, lang)}
                                          <span className="ml-0.5 text-sm">
                                            €
                                          </span>
                                        </span>
                                        <span className="mt-0.5 text-xs tabular-nums text-[#8b8b8b]">
                                          {formatPrice(product.priceBgn, lang)}{" "}
                                          {lang === "bg" ? "лв." : "BGN"}
                                        </span>
                                      </span>
                                    </span>
                                    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                      {product.weight && (
                                        <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.045] px-2 py-1 text-[11px] font-medium tracking-wide text-neutral-300">
                                          {formatServing(product.weight, lang)}
                                        </span>
                                      )}
                                      {productDescription(product) && (
                                        <span className="line-clamp-2 min-w-0 flex-1 text-[13px] font-light leading-[1.5] text-[#999] md:text-sm">
                                          {productDescription(product)}
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                </span>
                              </button>
                            </Reveal>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

              <Reveal className="mt-16">
                <section className="space-y-5 border-t border-[#141414] py-10 text-center">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8a8a]">
                    {s.shareNight}
                  </p>
                  <h3 className="font-display text-3xl">{s.stayLoop}</h3>
                  <a
                    href="https://instagram.com/djanam.restaurant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2.5 text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    <Instagram className="h-4 w-4 text-[#FF4D5E]" />
                    @djanam.restaurant
                  </a>
                  <p className="mx-auto max-w-xs text-xs text-[#777]">
                    {s.tagUs}
                  </p>
                </section>
              </Reveal>

              <footer className="border-t border-[#141414] pb-2 pt-6 text-center">
                <img
                  src="./bull-icon.png"
                  alt=""
                  className="mx-auto mb-3 h-8 w-8 object-contain opacity-30"
                />
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#777]">
                  Djanam Steak & Fish
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>

      {showSearch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={s.search}
          className="animate-fade-in fixed inset-0 z-[60] bg-black/85 backdrop-blur-md"
          onMouseDown={event =>
            event.target === event.currentTarget && setShowSearch(false)
          }
        >
          <div className="mx-auto max-w-xl px-5 pt-20 md:pt-24">
            <div className="relative">
              <label htmlFor="menu-search" className="sr-only">
                {s.search}
              </label>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                id="menu-search"
                ref={searchInputRef}
                type="search"
                placeholder={s.search}
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111] py-4 pl-11 pr-12 text-base text-white placeholder:text-[#8a8a8a] focus:border-[#E30614]/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                aria-label={s.close}
                className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="mt-4 max-h-[65vh] overflow-y-auto rounded-2xl border border-[#1f1f1f] bg-[#0b0b0b] divide-y divide-[#181818]">
                {filteredProducts.length === 0 && (
                  <p className="p-5 text-sm text-[#8a8a8a]">{s.noResults}</p>
                )}
                {filteredProducts.map(product => {
                  const customImages = customProductImages(product);
                  const stockImage = stockProductImage(product);
                  const resultImage = customImages[0] ?? stockImage;

                  return (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowSearch(false);
                      }}
                      className="flex min-h-20 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <img
                        src={resultImage}
                        alt=""
                        aria-hidden="true"
                        width="52"
                        height="52"
                        loading="lazy"
                        onError={event => {
                          const image = event.currentTarget;
                          if (
                            customImages.length > 0 &&
                            image.dataset.stockApplied !== "true"
                          ) {
                            image.dataset.stockApplied = "true";
                            image.src = stockImage;
                            return;
                          }
                          image.remove();
                        }}
                        className="h-[52px] w-[52px] shrink-0 rounded-xl object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-base">
                          {productName(product)}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-[#929292]">
                          {product.weight && (
                            <span>{formatServing(product.weight, lang)}</span>
                          )}
                          {productDescription(product) && (
                            <span className="truncate">
                              {productDescription(product)}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-lg text-[#FF4D5E]">
                        {formatPrice(product.priceEur, lang)}€
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
          className="fixed inset-0 z-[60]"
        >
          <button
            type="button"
            aria-label={s.close}
            className="animate-fade-in absolute inset-0 h-full w-full cursor-default bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="animate-sheet-up absolute bottom-0 left-0 right-0 mx-auto max-h-[88svh] max-w-xl overflow-y-auto rounded-t-[2rem] border-t border-[#262626] bg-[#0b0b0b] pb-10 shadow-2xl">
            <div className="sticky top-0 z-10 flex justify-center rounded-t-[2rem] bg-[#0b0b0b] pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-neutral-700" />
            </div>
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label={s.close}
              className="absolute right-4 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-6 px-6 pt-4 md:px-8">
              {sheetImages.length > 0 && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#111]">
                  <img
                    key={sheetImages[imageIndex]}
                    src={sheetImages[imageIndex]}
                    alt={sheetUsesStock ? "" : productName(selectedProduct)}
                    aria-hidden={sheetUsesStock}
                    width="1200"
                    height="900"
                    decoding="async"
                    onError={event => {
                      const image = event.currentTarget;
                      if (
                        !sheetUsesStock &&
                        image.dataset.stockApplied !== "true"
                      ) {
                        image.dataset.stockApplied = "true";
                        image.src = stockProductImage(selectedProduct);
                        image.alt = "";
                        image.setAttribute("aria-hidden", "true");
                        return;
                      }
                      const wrapper = image.closest("div");
                      if (wrapper) wrapper.style.display = "none";
                    }}
                    className="animate-photo-in h-full w-full object-cover"
                  />
                  {sheetImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setImageIndex(
                            (imageIndex - 1 + sheetImages.length) %
                              sheetImages.length
                          )
                        }
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setImageIndex((imageIndex + 1) % sheetImages.length)
                        }
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {sheetImages.map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 w-1.5 rounded-full ${index === imageIndex ? "bg-white" : "bg-white/40"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#FF4D5E]">
                  {selectedProduct.category?.name
                    ? categoryName(selectedProduct.category.name)
                    : s.menu}
                </span>
                <h2
                  id="product-title"
                  className="mt-2 font-display text-3xl leading-tight"
                >
                  {productName(selectedProduct)}
                </h2>
                {lang === "bg" &&
                  selectedProduct.nameEn &&
                  selectedProduct.nameEn !== selectedProduct.name && (
                    <p className="mt-1 text-sm font-light italic text-[#8a8a8a]">
                      {stripTrailingServing(selectedProduct.nameEn)}
                    </p>
                  )}
              </div>

              {productDescription(selectedProduct) && (
                <p className="text-sm font-light leading-relaxed text-neutral-400">
                  {productDescription(selectedProduct)}
                </p>
              )}

              {selectedProduct.weight && (
                <div className="flex items-center gap-2 text-xs text-[#8a8a8a]">
                  <span className="uppercase tracking-wider">{s.weight}</span>
                  <span className="text-neutral-300">
                    {formatServing(selectedProduct.weight, lang)}
                  </span>
                </div>
              )}

              <div className="h-px bg-[#1c1c1c]" />
              <div className="flex items-end justify-between">
                <span className="flex items-baseline gap-1 font-display text-4xl tabular-nums text-[#FF4D5E]">
                  {formatPrice(selectedProduct.priceEur, lang)}
                  <span className="text-lg">€</span>
                </span>
                <span className="text-sm tabular-nums text-[#8a8a8a]">
                  {formatPrice(selectedProduct.priceBgn, lang)}{" "}
                  {lang === "bg" ? "лв." : "BGN"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!dataLoading && !dataError && categoryOrder.length > 0 && (
        <nav
          aria-label={s.categories}
          className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 lg:hidden"
        >
          <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-1">
            {categoryOrder.map(category => {
              const names = splitCatName(category.name);
              const Icon = categoryIcon[names.en] || UtensilsCrossed;
              const isActive = activeCategory === category.id;
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`flex h-11 shrink-0 items-center gap-2 rounded-2xl border px-4 text-xs transition-colors ${
                    isActive
                      ? "border-[#E30614] bg-[#E30614] font-medium text-white"
                      : "border-white/10 bg-[#111] text-neutral-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{categoryName(category.name)}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
