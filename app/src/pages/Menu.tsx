import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { bgNames } from "@/i18n/bg";
import { trDescriptions, trNames } from "@/i18n/tr";
import { ruNames } from "@/i18n/ru";
import {
  Beef,
  Bell,
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
  Instagram,
  LayoutGrid,
  Loader2,
  Martini,
  Minus,
  Plus,
  Receipt,
  RefreshCw,
  Salad,
  Sandwich,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
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
  tags: string[] | null;
  allergens: string[] | null;
  categoryId: number;
  category?: { name: string } | null;
  isAvailable: boolean;
  sortOrder: number;
};

type Lang = "bg" | "en" | "tr" | "ru";

// Product badges (Signature / Vegan / Spicy …) — keys stored in product.tags.
type BadgeMeta = {
  label: Record<Lang, string>;
  className: string;
};
const BADGE_META: Record<string, BadgeMeta> = {
  signature: {
    label: { bg: "Специалитет", en: "Signature", tr: "Özel", ru: "Фирменное" },
    className: "bg-[#E30614] text-white",
  },
  new: {
    label: { bg: "Ново", en: "New", tr: "Yeni", ru: "Новинка" },
    className: "bg-amber-400 text-black",
  },
  spicy: {
    label: { bg: "Люто", en: "Spicy", tr: "Acılı", ru: "Острое" },
    className: "bg-orange-600 text-white",
  },
  vegan: {
    label: { bg: "Веган", en: "Vegan", tr: "Vegan", ru: "Веган" },
    className: "bg-emerald-600 text-white",
  },
  vegetarian: {
    label: { bg: "Вегетарианско", en: "Vegetarian", tr: "Vejetaryen", ru: "Вегетарианское" },
    className: "bg-emerald-700 text-white",
  },
};
function badgeLabel(key: string, lang: Lang): string {
  return BADGE_META[key]?.label[lang] ?? key;
}

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
  ru: {
    Salads: "Свежие сочетания",
    Appetizer: "Идеальное начало",
    Bread: "Свежий и тёплый",
    Starters: "Начните со вкусом",
    Beef: "Отборный Black Angus",
    Lamb: "Нежное и ароматное",
    Poultry: "Тщательно отобрано",
    Fish: "Свежий улов",
    Desserts: "Сладкий финал",
    Whiskey: "Выдержанная коллекция",
    "Gin & Rum": "Классика и новинки",
    Vodka: "Премиум марки",
    "Anise Drinks": "Средиземноморская классика",
    Rakia: "Балканская традиция",
    Liquors: "Сладкие и ароматные",
    Tequila: "100% агава",
    Beer: "Идеально охлаждённое",
    "Soft Drinks": "Освежающие",
    "Fresh Juices": "Свежевыжатые",
    "Hot Drinks": "Кофе и чай",
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

const categoryNameRu: Record<string, string> = {
  Salads: "Салаты",
  Appetizer: "Закуски",
  Bread: "Хлеб",
  Starters: "Предзакуски",
  Beef: "Говядина",
  Lamb: "Баранина",
  Poultry: "Птица",
  Fish: "Рыба",
  Desserts: "Десерты",
  Whiskey: "Виски",
  "Gin & Rum": "Джин и Ром",
  Vodka: "Водка",
  "Anise Drinks": "Анисовые напитки",
  Rakia: "Ракия",
  Liquors: "Ликёры",
  Tequila: "Текила",
  Beer: "Пиво",
  "Soft Drinks": "Безалкогольные",
  "Fresh Juices": "Свежие соки",
  "Hot Drinks": "Горячие напитки",
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
    add: "Добави",
    cart: "Кошница",
    order: "Вашата поръчка",
    sendOrder: "Изпрати поръчка",
    sending: "Изпращане…",
    orderSent: "Поръчката е изпратена в кухнята!",
    orderError: "Неуспешно изпращане. Опитайте отново.",
    emptyCart: "Кошницата е празна",
    total: "Общо",
    orderNote: "Бележка към поръчката…",
    table: "Маса",
    scanToOrder: "Сканирайте QR кода на Вашата маса, за да поръчате.",
    inCart: "в кошницата",
    allergens: "Алергени",
    filters: "Филтри",
    allCategories: "Всички категории",
    callWaiter: "Извикай сервитьор",
    requestBill: "Сметка",
    serviceSent: "Сервитьорът е уведомен!",
    serviceError: "Възникна грешка. Опитайте отново.",
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
    add: "Add",
    cart: "Cart",
    order: "Your order",
    sendOrder: "Send order",
    sending: "Sending…",
    orderSent: "Your order was sent to the kitchen!",
    orderError: "Could not send the order. Try again.",
    emptyCart: "Your cart is empty",
    total: "Total",
    orderNote: "Note to the kitchen…",
    table: "Table",
    scanToOrder: "Scan your table's QR code to place an order.",
    inCart: "in cart",
    allergens: "Allergens",
    filters: "Filters",
    allCategories: "All categories",
    callWaiter: "Call waiter",
    requestBill: "Bill",
    serviceSent: "The waiter has been notified!",
    serviceError: "Something went wrong. Try again.",
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
    add: "Ekle",
    cart: "Sepet",
    order: "Siparişiniz",
    sendOrder: "Siparişi gönder",
    sending: "Gönderiliyor…",
    orderSent: "Siparişiniz mutfağa gönderildi!",
    orderError: "Sipariş gönderilemedi. Tekrar deneyin.",
    emptyCart: "Sepetiniz boş",
    total: "Toplam",
    orderNote: "Mutfağa not…",
    table: "Masa",
    scanToOrder: "Sipariş vermek için masanızın QR kodunu okutun.",
    inCart: "sepette",
    allergens: "Alerjenler",
    filters: "Filtreler",
    allCategories: "Tüm kategoriler",
    callWaiter: "Garson çağır",
    requestBill: "Hesap",
    serviceSent: "Garson bilgilendirildi!",
    serviceError: "Bir hata oluştu. Tekrar deneyin.",
  },
  ru: {
    tagline: "Стейк & рыба · Варна",
    heroSub: "Каждая деталь для вашего удовольствия",
    scroll: "Смотреть меню",
    menu: "Меню",
    categories: "Категории",
    search: "Поиск по меню…",
    noResults: "Ничего не найдено. Попробуйте другой запрос.",
    items: "позиций",
    shareNight: "Поделитесь вечером",
    stayLoop: "Оставайтесь с нами",
    tagUs: "Отметьте нас в истории — возможно, получите сюрприз",
    weight: "Порция",
    close: "Закрыть",
    language: "Выбор языка",
    loadError: "Не удалось загрузить меню.",
    retry: "Повторить",
    add: "Добавить",
    cart: "Корзина",
    order: "Ваш заказ",
    sendOrder: "Отправить заказ",
    sending: "Отправка…",
    orderSent: "Заказ отправлен на кухню!",
    orderError: "Не удалось отправить. Попробуйте снова.",
    emptyCart: "Корзина пуста",
    total: "Итого",
    orderNote: "Примечание к заказу…",
    table: "Стол",
    scanToOrder: "Отсканируйте QR-код вашего стола, чтобы сделать заказ.",
    inCart: "в корзине",
    allergens: "Аллергены",
    filters: "Фильтры",
    allCategories: "Все категории",
    callWaiter: "Позвать официанта",
    requestBill: "Счёт",
    serviceSent: "Официант уведомлён!",
    serviceError: "Произошла ошибка. Попробуйте снова.",
  },
} as const;

const ACCENT = "#E30614";
const MENU_IMAGE_BASE = "./images/menu";
const PRODUCT_IMAGE_BASE = "./images/products";

const unitLabel: Record<Lang, { g: string; ml: string; l: string }> = {
  bg: { g: "г", ml: "мл", l: "л" },
  en: { g: "g", ml: "ml", l: "l" },
  tr: { g: "g", ml: "ml", l: "l" },
  ru: { g: "г", ml: "мл", l: "л" },
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
  ru: new Intl.NumberFormat("ru-RU", {
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

export default function Menu() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("djanam-lang");
      return saved === "en" || saved === "tr" || saved === "ru"
        ? saved
        : "bg";
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
  const tabBarRef = useRef<HTMLDivElement>(null);
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

  // Per-table ordering context. qrToken comes from /menu/:qrToken (QR scan).
  const { qrToken } = useParams<{ qrToken: string }>();
  const { data: table } = trpc.table.byQrToken.useQuery(
    { qrToken: qrToken ?? "" },
    { enabled: Boolean(qrToken), staleTime: Infinity, retry: false }
  );
  const canOrder = Boolean(table?.id);

  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>(
    []
  );
  const [showCart, setShowCart] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const visitedRef = useRef<string | null>(null);

  const visitMutation = trpc.table.visit.useMutation();
  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      toast.success(s.orderSent);
      setCart([]);
      setOrderNote("");
      setShowCart(false);
    },
    onError: () => toast.error(s.orderError),
  });

  const serviceRequest = trpc.service.create.useMutation({
    onSuccess: () => toast.success(s.serviceSent),
    onError: () => toast.error(s.serviceError),
  });
  const callService = useCallback(
    (type: "waiter" | "bill") => {
      if (!qrToken || serviceRequest.isPending) return;
      serviceRequest.mutate({ qrToken, type });
    },
    [qrToken, serviceRequest]
  );

  const toggleFilter = useCallback((key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  // Record one visit per resolved table token (drives per-table analytics).
  useEffect(() => {
    if (!table?.id || !qrToken) return;
    if (visitedRef.current === qrToken) return;
    visitedRef.current = qrToken;
    visitMutation.mutate({ qrToken });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table?.id, qrToken]);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (sum, line) => sum + Number(line.product.priceEur) * line.quantity,
        0
      ),
    [cart]
  );

  const addToCart = useCallback((product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(line => line.product.id === product.id);
      if (existing) {
        return prev.map(line =>
          line.product.id === product.id
            ? { ...line, quantity: Math.min(line.quantity + 1, 99) }
            : line
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const changeQty = useCallback((productId: number, delta: number) => {
    setCart(prev =>
      prev
        .map(line =>
          line.product.id === productId
            ? { ...line, quantity: line.quantity + delta }
            : line
        )
        .filter(line => line.quantity > 0)
    );
  }, []);

  const submitOrder = useCallback(() => {
    const tableId = table?.id;
    if (!tableId || cart.length === 0 || createOrder.isPending) return;
    createOrder.mutate({
      tableId,
      items: cart.map(line => ({
        productId: line.product.id,
        quantity: line.quantity,
      })),
      notes: orderNote.trim() || undefined,
    });
  }, [table?.id, cart, orderNote, createOrder]);

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
          : lang === "ru"
            ? ruNames[product.name] || product.nameEn || product.name
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
      if (lang === "en" || lang === "ru") return en ?? bg;
      return trDescriptions[product.name] ?? en ?? bg;
    },
    [lang]
  );

  const categoryName = useCallback(
    (full: string) => {
      const names = splitCatName(full);
      if (lang === "tr") return categoryNameTr[names.en] || names.en;
      if (lang === "ru") return categoryNameRu[names.en] || names.en;
      return lang === "en" ? names.en : names.bg;
    },
    [lang]
  );

  // Badges that actually occur in the menu — used for the filter controls.
  const availableBadges = useMemo(() => {
    const present = new Set<string>();
    for (const product of (products as ProductItem[] | undefined) ?? []) {
      for (const tag of product.tags ?? []) {
        if (BADGE_META[tag]) present.add(tag);
      }
    }
    return Object.keys(BADGE_META).filter(key => present.has(key));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = (products as ProductItem[] | undefined) ?? [];

    if (activeFilters.length > 0) {
      list = list.filter(product =>
        (product.tags ?? []).some(tag => activeFilters.includes(tag))
      );
    }

    const query = searchQuery.trim().toLocaleLowerCase(lang);
    if (!query) return list;

    return list.filter(product => {
      const searchable = [
        product.name,
        product.nameEn,
        bgNames[product.name],
        trNames[product.name],
        ruNames[product.name],
        productDescription(product),
        product.category?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(lang);
      return searchable.includes(query);
    });
  }, [lang, productDescription, products, searchQuery, activeFilters]);

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
    const el = document.getElementById(`cat-section-${categoryId}`);
    if (!el) return;
    // Offset for the fixed header (64px) + sticky tab bar (~56px).
    const targetY = window.scrollY + el.getBoundingClientRect().top - 116;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Native smooth scroll is unreliable under `overflow-x: clip`, so animate
    // the window manually with requestAnimationFrame (also respects the offset).
    if (reduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 480;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
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
      // Top offset matches the fixed header (64px) + sticky tab bar (~52px)
      // so the tapped/scrolled category is the one highlighted as active.
      { rootMargin: "-118px 0px -65% 0px" }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [categoryOrder]);

  // Keep the active category chip centered in the sticky tab bar.
  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar || activeCategory == null) return;
    const chip = bar.querySelector<HTMLElement>(
      `[data-cat="${activeCategory}"]`
    );
    if (!chip) return;
    bar.scrollTo({
      left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeCategory]);

  useEffect(() => {
    if (showSearch) {
      window.setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  useEffect(() => {
    setImageIndex(0);
  }, [selectedProduct]);

  useEffect(() => {
    const modalOpen =
      showSearch ||
      showCart ||
      showCategories ||
      showFilters ||
      Boolean(selectedProduct);
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setSelectedProduct(null);
        setShowCart(false);
        setShowCategories(false);
        setShowFilters(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct, showSearch, showCart, showCategories, showFilters]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${s.menu} | Djanam Steak & Fish`;
  }, [lang, s.menu]);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#050505] text-[#f5f2ec]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          headerSolid
            ? "border-b border-white/[0.06] bg-[#0a0a0a] shadow-lg shadow-black/40"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]"
            aria-label="Djanam Steak & Fish"
          >
            <img src="./bull-icon.png" alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-[19px] leading-none tracking-wide">
              Djanam
            </span>
          </a>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(open => !open)}
                aria-label={s.language}
                aria-expanded={showLangMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.08] text-[11px] font-semibold uppercase tracking-wider text-neutral-100 backdrop-blur-md transition-colors hover:bg-white/[0.16] active:scale-95"
              >
                {lang}
              </button>
              {showLangMenu && (
                <>
                  <button
                    type="button"
                    aria-label={s.close}
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="animate-fade-in absolute right-0 top-[3.25rem] z-50 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/50">
                    {(
                      [
                        ["bg", "Български"],
                        ["en", "English"],
                        ["tr", "Türkçe"],
                        ["ru", "Русский"],
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.08] text-neutral-100 backdrop-blur-md transition-colors hover:bg-white/[0.16] active:scale-95"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {availableBadges.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                aria-label={s.filters}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.08] text-neutral-100 backdrop-blur-md transition-colors hover:bg-white/[0.16] active:scale-95"
              >
                <SlidersHorizontal className="h-[18px] w-[18px]" />
                {activeFilters.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E30614] px-1 text-[9px] font-semibold tabular-nums text-white ring-2 ring-[#0a0a0a]">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            )}

            {canOrder && (
              <button
                type="button"
                onClick={() => setShowCart(true)}
                aria-label={`${s.cart}${cartCount ? `, ${cartCount} ${s.inCart}` : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.08] text-neutral-100 backdrop-blur-md transition-colors hover:bg-white/[0.16] active:scale-95"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E30614] px-1 text-[9px] font-semibold tabular-nums text-white ring-2 ring-[#0a0a0a]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
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
          <div className="animate-hero-in relative px-6 text-center">
            <img
              src="./bull-icon.png"
              alt=""
              className="mx-auto mb-7 h-20 w-20 object-contain"
            />
            <p className="mb-5 text-[11px] uppercase tracking-[0.4em] text-[#FF4D5E]">
              {s.tagline}
            </p>
            <h1 className="font-display text-6xl leading-none tracking-wide md:text-8xl">
              Djanam
            </h1>
            <p className="mt-5 text-sm font-light tracking-wide text-neutral-400">
              {s.heroSub}
            </p>
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
          className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-16 pt-4 md:px-8"
        >
          {!dataLoading && !dataError && categoryOrder.length > 0 && (
            <nav
              aria-label={s.categories}
              className="sticky top-16 z-40 -mx-5 mb-3 flex items-center gap-2 border-b border-white/[0.06] bg-[#0a0a0a] px-5 shadow-md shadow-black/30 md:-mx-8 md:px-8"
            >
              <button
                type="button"
                onClick={() => setShowCategories(true)}
                aria-label={s.allCategories}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-neutral-300 transition-colors hover:bg-white/[0.12]"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <div
                ref={tabBarRef}
                className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto py-3"
              >
                {categoryOrder.map(category => {
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      type="button"
                      key={category.id}
                      data-cat={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-[#E30614] font-medium text-white"
                          : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {categoryName(category.name)}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          <div>
            <div className="mx-auto w-full max-w-4xl">
              <div className="flex items-center gap-4 pb-2 pt-1">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#FF4D5E]">
                  {s.menu}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[#2a2a2a] to-transparent" />
              </div>

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
                      className="scroll-mt-32 pt-8"
                    >
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

                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                        {categoryProducts.map(product => {
                          const customImages = customProductImages(product);
                          const hasCustomImage = customImages.length > 0;
                          const stockImage = stockProductImage(product);
                          const cardImage = customImages[0] ?? stockImage;
                          const badges = (product.tags ?? []).filter(
                            tag => BADGE_META[tag]
                          );

                          return (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.05]"
                            >
                                <span className="relative block aspect-square w-full overflow-hidden bg-[#0d0d0d]">
                                  <img
                                    src={cardImage}
                                    alt={
                                      hasCustomImage ? productName(product) : ""
                                    }
                                    aria-hidden={!hasCustomImage}
                                    width="400"
                                    height="400"
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
                                        image.setAttribute("aria-hidden", "true");
                                        return;
                                      }
                                      image.style.visibility = "hidden";
                                    }}
                                    className="menu-photo animate-photo-in h-full w-full object-cover"
                                  />
                                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent" />
                                  {badges.length > 0 && (
                                    <span className="absolute left-2 top-2 flex flex-wrap gap-1">
                                      {badges.map(badge => (
                                        <span
                                          key={badge}
                                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${BADGE_META[badge].className}`}
                                        >
                                          {badgeLabel(badge, lang)}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </span>
                                <span className="flex flex-1 flex-col gap-1 p-3">
                                  <span className="line-clamp-2 font-display text-[15px] leading-tight transition-colors duration-200 group-hover:text-[#FF4D5E] md:text-base">
                                    {productName(product)}
                                  </span>
                                  {product.weight && (
                                    <span className="text-[11px] tabular-nums text-[#8b8b8b]">
                                      {formatServing(product.weight, lang)}
                                    </span>
                                  )}
                                  <span className="mt-auto flex items-baseline gap-1.5 pt-1.5">
                                    <span className="font-display text-lg tabular-nums text-[#FF4D5E]">
                                      {formatPrice(product.priceEur, lang)}
                                      <span className="ml-0.5 text-sm">€</span>
                                    </span>
                                    <span className="text-[11px] tabular-nums text-[#8b8b8b]">
                                      {formatPrice(product.priceBgn, lang)}{" "}
                                      {lang === "bg" ? "лв." : "BGN"}
                                    </span>
                                  </span>
                                </span>
                              </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

              <div className="mt-16">
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
              </div>

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
                <div className="relative mx-auto flex aspect-square w-full max-w-[19rem] items-center justify-center">
                  {/* soft glow */}
                  <div className="absolute inset-2 rounded-full bg-[#E30614]/25 blur-3xl" />
                  {/* rotating accent ring */}
                  <div className="plate-ring absolute -inset-1.5 rounded-full opacity-70 blur-[1px]" />
                  {/* the plate: spins in on open */}
                  <div
                    key={`plate-${selectedProduct.id}-${imageIndex}`}
                    className="animate-plate-in absolute inset-1"
                  >
                    <div className="plate-float h-full w-full">
                      <img
                        src={sheetImages[imageIndex]}
                        alt={sheetUsesStock ? "" : productName(selectedProduct)}
                        aria-hidden={sheetUsesStock}
                        width="900"
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
                        className="h-full w-full rounded-full border border-white/10 object-cover shadow-2xl shadow-black/60"
                      />
                    </div>
                  </div>

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
                        className="absolute -left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setImageIndex((imageIndex + 1) % sheetImages.length)
                        }
                        aria-label="Next photo"
                        className="absolute -right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute -bottom-1 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
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
                {(() => {
                  const badges = (selectedProduct.tags ?? []).filter(
                    tag => BADGE_META[tag]
                  );
                  if (!badges.length) return null;
                  return (
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {badges.map(badge => (
                        <span
                          key={badge}
                          className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${BADGE_META[badge].className}`}
                        >
                          {badgeLabel(badge, lang)}
                        </span>
                      ))}
                    </span>
                  );
                })()}
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

              {selectedProduct.allergens &&
                selectedProduct.allergens.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8a8a]">
                      {s.allergens}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.allergens.map(allergen => (
                        <span
                          key={allergen}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-neutral-300"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
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

              {canOrder &&
                (() => {
                  const line = cart.find(
                    item => item.product.id === selectedProduct.id
                  );
                  if (!line) {
                    return (
                      <button
                        type="button"
                        onClick={() => addToCart(selectedProduct)}
                        className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#E30614] text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        <Plus className="h-5 w-5" />
                        {s.add}
                      </button>
                    );
                  }
                  return (
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                      <button
                        type="button"
                        onClick={() => changeQty(selectedProduct.id, -1)}
                        aria-label="-"
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-display text-xl tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(selectedProduct.id, 1)}
                        aria-label="+"
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E30614] transition-colors hover:bg-[#c40512]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={s.order}
          className="fixed inset-0 z-[70]"
        >
          <button
            type="button"
            aria-label={s.close}
            className="animate-fade-in absolute inset-0 h-full w-full cursor-default bg-black/75 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="animate-sheet-up absolute bottom-0 left-0 right-0 mx-auto flex max-h-[90svh] max-w-xl flex-col rounded-t-[2rem] border-t border-[#262626] bg-[#0b0b0b] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] border-b border-[#161616] bg-[#0b0b0b] px-6 pb-3 pt-4">
              <div>
                <h2 className="font-display text-2xl">{s.order}</h2>
                {table?.name && (
                  <p className="mt-0.5 text-xs text-[#8a8a8a]">
                    {s.table}: {table.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCart(false)}
                aria-label={s.close}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <p className="py-14 text-center text-sm text-[#8a8a8a]">
                  {s.emptyCart}
                </p>
              ) : (
                <ul className="space-y-3">
                  {cart.map(line => (
                    <li
                      key={line.product.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px]">
                          {productName(line.product)}
                        </p>
                        <p className="mt-0.5 text-xs tabular-nums text-[#FF4D5E]">
                          {formatPrice(line.product.priceEur, lang)}€
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => changeQty(line.product.id, -1)}
                          aria-label="-"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQty(line.product.id, 1)}
                          aria-label="+"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => changeQty(line.product.id, -line.quantity)}
                        aria-label={s.close}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#8a8a8a] transition-colors hover:bg-white/[0.06] hover:text-[#FF4D5E]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {cart.length > 0 && (
                <textarea
                  value={orderNote}
                  onChange={event => setOrderNote(event.target.value)}
                  placeholder={s.orderNote}
                  maxLength={1000}
                  rows={2}
                  className="mt-4 w-full resize-none rounded-2xl border border-[#2a2a2a] bg-[#111] p-3 text-sm text-white placeholder:text-[#8a8a8a] focus:border-[#E30614]/60 focus:outline-none"
                />
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#161616] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-wider text-[#8a8a8a]">
                    {s.total}
                  </span>
                  <span className="font-display text-2xl tabular-nums text-[#FF4D5E]">
                    {formatPrice(cartTotal.toFixed(2), lang)}€
                  </span>
                </div>
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={createOrder.isPending}
                  className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#E30614] text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {s.sending}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {s.sendOrder}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCategories && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={s.allCategories}
          className="fixed inset-0 z-[70]"
        >
          <button
            type="button"
            aria-label={s.close}
            className="animate-fade-in absolute inset-0 h-full w-full cursor-default bg-black/75 backdrop-blur-sm"
            onClick={() => setShowCategories(false)}
          />
          <div className="animate-sheet-up absolute bottom-0 left-0 right-0 mx-auto flex max-h-[85svh] max-w-xl flex-col rounded-t-[2rem] border-t border-[#262626] bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#161616] px-6 pb-3 pt-4">
              <h2 className="font-display text-2xl">{s.allCategories}</h2>
              <button
                type="button"
                onClick={() => setShowCategories(false)}
                aria-label={s.close}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {categoryOrder.map(category => {
                  const names = splitCatName(category.name);
                  const Icon = categoryIcon[names.en] || UtensilsCrossed;
                  const count = productsByCategory[category.id]?.length ?? 0;
                  return (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => {
                        setShowCategories(false);
                        scrollToCategory(category.id);
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E30614]/30 bg-[#E30614]/[0.08]">
                        <Icon className="h-4 w-4 text-[#FF4D5E]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          {categoryName(category.name)}
                        </span>
                        <span className="text-[11px] tabular-nums text-[#8a8a8a]">
                          {count} {s.items}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={s.filters}
          className="fixed inset-0 z-[70]"
        >
          <button
            type="button"
            aria-label={s.close}
            className="animate-fade-in absolute inset-0 h-full w-full cursor-default bg-black/75 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="animate-sheet-up absolute bottom-0 left-0 right-0 mx-auto max-w-xl rounded-t-[2rem] border-t border-[#262626] bg-[#0b0b0b] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#161616] px-6 pb-3 pt-4">
              <h2 className="font-display text-2xl">{s.filters}</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label={s.close}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex flex-wrap gap-2">
                {availableBadges.map(key => {
                  const active = activeFilters.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleFilter(key)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? BADGE_META[key].className
                          : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      {badgeLabel(key, lang)}
                    </button>
                  );
                })}
              </div>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilters([])}
                  className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm text-neutral-300 transition-colors hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                  {{ bg: "Изчисти", en: "Clear", tr: "Temizle", ru: "Сбросить" }[lang]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {canOrder && headerSolid && (
        <div className="animate-fade-in fixed bottom-5 right-4 z-[55] flex flex-col items-end gap-2.5">
          <button
            type="button"
            onClick={() => callService("waiter")}
            disabled={serviceRequest.isPending}
            className="flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-[#161616]/90 pl-3.5 pr-4 text-[13px] font-medium text-neutral-100 shadow-xl shadow-black/50 backdrop-blur-md transition-all hover:bg-[#202020] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Bell className="h-4 w-4 text-[#FF4D5E]" />
            {s.callWaiter}
          </button>
          <button
            type="button"
            onClick={() => callService("bill")}
            disabled={serviceRequest.isPending}
            className="flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-[#161616]/90 pl-3.5 pr-4 text-[13px] font-medium text-neutral-100 shadow-xl shadow-black/50 backdrop-blur-md transition-all hover:bg-[#202020] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Receipt className="h-4 w-4 text-[#FF4D5E]" />
            {s.requestBill}
          </button>
        </div>
      )}
    </div>
  );
}
