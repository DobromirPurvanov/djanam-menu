/**
 * Mock tRPC server for local preview — serves the real seed menu data
 * from api/seedRouter.ts without needing a MySQL database.
 *
 * Usage: node tools/mock-server.mjs  →  http://localhost:3100/api/trpc
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedSrc = readFileSync(path.join(__dirname, "../api/seedRouter.ts"), "utf8");

// --- Parse categories (insert order → id 1..N) ---
const catBlock = seedSrc.match(/insert\(categories\)[\s\S]*?\.values\(\[([\s\S]*?)\]\)/);
const categories = eval(`[${catBlock[1]}]`).map((c, i) => ({ id: i + 1, ...c }));

// --- Map catXxx constants to ids ---
const catIds = {};
for (const m of seedSrc.matchAll(/const (cat\w+) = cats\[(\d+)\]\.id;/g)) {
  catIds[m[1]] = Number(m[2]) + 1;
}

// --- Parse all product insert batches ---
let productId = 1;
const products = [];
for (const m of seedSrc.matchAll(/insert\(products\)\.values\(\[([\s\S]*?)\]\);/g)) {
  const resolved = m[1].replace(/\bcat[A-Z]\w*\b/g, (name) => catIds[name] ?? "null");
  for (const p of eval(`[${resolved}]`)) {
    products.push({ id: productId++, image: null, images: null, ...p });
  }
}

// --- Parse tables ---
const tablesBlock = seedSrc.match(/insert\(tables\)\.values\(\[([\s\S]*?)\]\);/);
const tables = eval(`[${tablesBlock[1]}]`).map((t, i) => ({ id: i + 1, ...t }));

console.log(`[mock] ${categories.length} categories, ${products.length} products, ${tables.length} tables`);

const procedures = {
  "category.active": () => categories.filter((c) => c.isActive),
  "product.active": () =>
    products.filter((p) => p.isAvailable).map((p) => ({
      ...p,
      category: categories.find((c) => c.id === p.categoryId) ?? null,
    })),
  "table.byQrToken": (input) =>
    tables.find((t) => t.qrToken === input?.qrToken) ?? null,
  "table.visit": () => ({ success: true }),
  "service.create": () => ({ ok: true }),
  "order.create": (input) => ({
    id: Math.floor(Math.random() * 10000),
    status: "pending",
    total: (input?.items || []).reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0).toFixed(2),
    items: input?.items || [],
  }),
};

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  if (req.method === "OPTIONS") return res.end();

  const url = new URL(req.url, "http://localhost");
  const match = url.pathname.match(/^\/api\/trpc\/(.+)$/);
  if (!match) {
    res.statusCode = 404;
    return res.end("not found");
  }

  const names = match[1].split(",");
  const isBatch = url.searchParams.get("batch") === "1" || names.length > 1;
  const batchInput = url.searchParams.get("input")
    ? JSON.parse(url.searchParams.get("input"))
    : {};

  const callOne = (name, idx) => {
    const fn = procedures[name];
    if (!fn) return { error: { message: `unknown procedure ${name}` } };
    const input = isBatch ? batchInput[idx]?.json : batchInput.json;
    try {
      return { result: { data: { json: fn(input) } } };
    } catch (e) {
      return { error: { message: String(e) } };
    }
  };

  const payload = isBatch
    ? names.map((n, i) => callOne(n, i))
    : callOne(names[0], 0);

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
});

server.listen(3100, () => console.log("[mock] listening on http://localhost:3100/api/trpc"));
