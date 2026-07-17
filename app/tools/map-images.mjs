/**
 * Maps product photos from app/public/images/products/ to products in the DB.
 *
 * Usage:
 *   DATABASE_URL="mysql://..." node tools/map-images.mjs
 *
 * - Renames each file to a slug (la-opera.jpg)
 * - Sets products.image = "/menu/images/products/<slug>.<ext>" on exact name match
 * - Prints a report of matched / unmatched files and products without photos
 */
import { readdirSync, renameSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "../public/images/products");
const EXT_OK = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL env");
  process.exit(1);
}

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [products] = await conn.query("SELECT id, name FROM products");
const bySlug = new Map(products.map((p) => [slugify(p.name), p]));

const files = readdirSync(DIR).filter((f) => EXT_OK.has(path.extname(f).toLowerCase()));
console.log(`Found ${files.length} image files, ${products.length} products in DB\n`);

let matched = 0;
const unmatched = [];
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const slug = slugify(path.basename(file, path.extname(file)));
  const product = bySlug.get(slug);
  if (!product) {
    unmatched.push(file);
    continue;
  }
  const newName = `${slug}${ext}`;
  if (file !== newName) {
    if (existsSync(path.join(DIR, newName))) {
      console.log(`skip rename (exists): ${file}`);
    } else {
      renameSync(path.join(DIR, file), path.join(DIR, newName));
    }
  }
  const url = `/menu/images/products/${newName}`;
  await conn.query("UPDATE products SET image = ? WHERE id = ?", [url, product.id]);
  matched++;
}

console.log(`Matched & updated: ${matched}`);
if (unmatched.length) {
  console.log(`\nUNMATCHED files (no product with that name):`);
  unmatched.forEach((f) => console.log("  -", f));
}
const [noImg] = await conn.query("SELECT name FROM products WHERE image IS NULL OR image = ''");
if (noImg.length) {
  console.log(`\nProducts still WITHOUT photo (${noImg.length}):`);
  noImg.forEach((p) => console.log("  -", p.name));
}
await conn.end();
