# Djanam Steak & Fish — Digital QR Menu

Статичен фронтенд за дигиталното QR меню на ресторант Djanam Steak & Fish.

## Съдържание

- `index.html` / `404.html` — входни страници
- `assets/` — компилирани JS/CSS файлове (build output)
- `config.js` — конфигурация на API адреса (виж коментарите във файла)
- `bull-icon.png` — лого / favicon
- `robots.txt`, `sitemap.xml` — SEO

## Конфигурация

API адресът се задава в `config.js`:

- **Same-domain (cPanel + `/menu/` подпапка):** `window.__DJANAM_API_URL__ = "/menu/api/trpc";`
- **Външен backend (Railway/Render):** `window.__DJANAM_API_URL__ = "https://YOUR-PROJECT.up.railway.app/api/trpc";`

## Деплой

Сайтът е статичен — качва се директно в `/menu/` подпапка на хостинга или на GitHub Pages.
