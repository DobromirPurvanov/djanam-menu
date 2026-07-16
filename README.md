# Djanam Steak & Fish — Digital QR Menu

Дигитално QR меню за ресторант **Djanam Steak & Fish** (Варна). Клиентите сканират QR код на масата и разглеждат менюто на телефона си; админ панел управлява маси, категории, продукти и аналитика.

Това репозиторий съдържа **компилирания статичен фронтенд** (React SPA, build output), готов за качване в `/menu/` подпапка на хостинга.

## Архитектура

- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui, HashRouter. Компилиран в `index.html` + `assets/`.
- **Backend:** Node.js + Hono + tRPC + Drizzle ORM, пакетиран като самодостатъчен `boot.js` (без `node_modules`). Хоства се на **Railway** (препоръчано) или cPanel Node.js App. *Backend-ът не е в това репо.*
- **База данни:** MySQL 8+ (`DATABASE_URL` env в Railway). Таблици: `tables`, `categories`, `products`, `orders`, `orderItems`.
- **Хостинг на фронтенда:** споделен cPanel хостинг (SuperHosting), файловете стоят в `public_html/menu/`.

## Как работи QR системата по маси

1. Всяка маса получава уникален `qrToken` (напр. `table-1-demo-001`) от админ панела, с QR код за изтегляне като PNG.
2. Клиент сканира QR → отваря `/menu/#/menu/{qrToken}` → менюто се зарежда за тази маса.
3. Всяко сканиране се записва — аналитиката показва посещения и приходи по маси.

## Админ панел (`/menu/#/admin`)

- **Маси** — CRUD + QR кодове (PNG изтегляне)
- **Категории** — управление на категориите (~20: храни и напитки)
- **Продукти** — име BG/EN, цена BGN/EUR, грамаж, описание, снимки, наличност (~190 продукта)
- **Поръчки** — преглед със статуси (поръчване от клиенти е изключено — менюто е само за преглед + „Извикай сервитьор")
- **Аналитика** — посещения и приходи по маси (recharts)
- **Seed:** `POST /api/trpc/seed.run` — попълва цялото меню еднократно

## Клиентско меню

- Тъмен дизайн със златисти акценти (стил noxroof.com/menu)
- Двуезично (BG + EN), основна цена в EUR, вторична в BGN
- Търсене, навигация по категории, продуктов модал с галерия
- Плаващ бутон „Извикай сервитьор"

## Конфигурация (`config.js`)

```js
// Same-domain (cPanel + /menu/ подпапка):
window.__DJANAM_API_URL__ = "/menu/api/trpc";

// Външен backend (Railway/Render):
// window.__DJANAM_API_URL__ = "https://YOUR-PROJECT.up.railway.app/api/trpc";
```

## Деплой

1. Качи съдържанието на репото в `public_html/menu/` (точно там, не в root).
2. Деплойни backend-а (`boot.js`) в Railway и задай env `DATABASE_URL=mysql://...`.
3. Впиши Railway URL-а в `config.js`.
4. Извикай веднъж `POST /api/trpc/seed.run` за първоначално пълнене на менюто.
5. При смяна на домейн се пипат само `config.js`, `sitemap.xml` и `robots.txt`.

## Важни особености (gotchas)

- **HashRouter, не BrowserRouter** — споделеният хостинг не поддържа SPA history routing.
- `<base href="/menu/">` в `index.html` + абсолютни пътища `/menu/assets/...` — заради подпапката.
- `config.js` и `bull-icon.png` се зареждат с относителни пътища (`./...`).
- Без backend менюто няма данни — фронтендът чете през tRPC API-то от `config.js`.
