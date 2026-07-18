/**
 * Build a one-to-one product image library from the menu seed data.
 *
 * Every seed product receives a distinct Pexels photo ID. The generated
 * manifest is also consumed by QA so category-level image reuse cannot slip
 * back into the menu unnoticed.
 *
 * Usage: node tools/build-product-images.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const seedSource = await readFile(
  path.join(appRoot, "api/seedRouter.ts"),
  "utf8"
);
const outputDirectory = path.join(appRoot, "public/images/products");

const categoryBlock = seedSource.match(
  /insert\(categories\)[\s\S]*?\.values\(\[([\s\S]*?)\]\)/
);
if (!categoryBlock)
  throw new Error("Could not parse categories from seedRouter.ts");

const categories = eval(`[${categoryBlock[1]}]`).map((category, index) => ({
  id: index + 1,
  ...category,
}));

const categoryIds = {};
for (const match of seedSource.matchAll(
  /const (cat\w+) = cats\[(\d+)\]\.id;/g
)) {
  categoryIds[match[1]] = Number(match[2]) + 1;
}

let productId = 1;
const products = [];
for (const match of seedSource.matchAll(
  /insert\(products\)\.values\(\[([\s\S]*?)\]\);/g
)) {
  const resolved = match[1].replace(
    /\bcat[A-Z]\w*\b/g,
    category => categoryIds[category] ?? "null"
  );
  for (const product of eval(`[${resolved}]`)) {
    products.push({ id: productId++, ...product });
  }
}

const photo = (...ids) => ids.map(String);

// Curated, category-specific Pexels search results. A global assignment set
// below guarantees that the same Pexels photo can never be used twice.
const pools = {
  steak: photo(
    28292008,
    7493599,
    18563182,
    27643037,
    9515248,
    675951,
    4871104,
    25389772,
    27643030,
    31779503,
    27200330,
    1639561,
    20584828,
    27305335,
    27305263,
    31587904,
    13651183,
    27643031,
    17130434,
    6542791,
    36850068,
    13749940,
    6166801
  ),
  salad: photo(
    20085552,
    13630358,
    36378880,
    8954228,
    16313570,
    33257006,
    18281687,
    18281696,
    20243914,
    7660433,
    38399723,
    13350111,
    36627080,
    9275180,
    27950111,
    17676350,
    32754776,
    31194325,
    17303318,
    37901993,
    842545,
    16297413,
    33323285,
    13350113
  ),
  appetizer: photo(
    16436245,
    19863267,
    33691792,
    5639762,
    29173090,
    34767653,
    20446395,
    17800183,
    30446148,
    29910809,
    4161712,
    10275169,
    16845336,
    4846621,
    14695626,
    34556825,
    2531051,
    36701453,
    7140426,
    4001867,
    30738177,
    36480304,
    13788482,
    19240003
  ),
  bread: photo(20106930, 25070490, 7543099, 35993723),
  poultry: photo(28635476, 27777833, 36850691, 33800905, 5704254),
  fish: photo(
    37642157,
    27381531,
    28843593,
    8629032,
    6509835,
    8694615,
    12475136,
    37534681
  ),
  dessert: photo(
    18784859,
    1123252,
    18580208,
    15062601,
    37124654,
    14996603,
    14766281,
    32318140,
    4187673,
    19314163,
    33731584,
    33731578,
    17346228,
    15671425,
    18416956,
    33731580,
    16544183,
    6605961
  ),
  brandy: photo(
    7253930,
    28843270,
    7254755,
    17419477,
    8527117,
    7254446,
    8527092,
    8527114,
    8148448,
    7254864,
    29436573,
    31332328,
    7253621,
    7254847,
    17986734,
    8527103,
    8527109,
    7253820,
    7254692,
    7253927,
    15344862,
    7254144,
    7254754,
    7253970
  ),
  gin: photo(
    7841374,
    13999929,
    16550820,
    14162012,
    16841304,
    2336667,
    14361692,
    17509985,
    8679550,
    8679352,
    616836,
    18347951,
    17373066,
    225236,
    14161887,
    2663973,
    1304542,
    4786627
  ),
  rum: photo(
    16845291,
    7451984,
    2789328,
    10322500,
    2380336,
    16845292,
    1189261,
    19035106,
    12954736
  ),
  vodka: photo(
    16515029,
    30271788,
    9002995,
    5176025,
    14200594,
    12549083,
    11430606,
    15750736,
    24871479,
    4271812,
    36064572,
    13723034,
    5192522,
    5192526,
    18635238,
    8919707,
    17564452,
    16790800,
    6004646,
    27897590,
    35758453,
    8679539,
    24871500,
    19567689
  ),
  liquor: photo(
    11325915,
    11912813,
    6530930,
    11840631,
    10577740,
    7518788,
    35831956,
    10577739,
    12549083,
    6761501,
    8084637,
    5537952,
    17541188,
    7282935,
    7282940,
    7270403,
    7283342,
    11114978,
    7061467,
    11739092,
    19594599,
    28843270,
    7253705,
    7253930
  ),
  tequila: photo(
    25858421,
    8920127,
    8920159,
    8158880,
    8920151,
    8920156,
    8919700,
    29683260,
    8158779,
    8920147,
    8919715,
    8919698,
    8920176,
    8919746,
    8919707,
    8920154,
    8919750,
    8919712,
    17347142,
    19567691,
    3858806,
    8919704,
    26508106,
    34875038
  ),
  beer: photo(
    12489338,
    17299781,
    10183871,
    5537952,
    4620723,
    4833632,
    7016492,
    15235096,
    11631295,
    13229769,
    1267681,
    14356408,
    1267702,
    17299780,
    11331625,
    12089508,
    1267289,
    30553178
  ),
  juice: photo(
    18071816,
    4958852,
    30900665,
    32751740,
    17612823,
    6414118,
    28053225,
    17612821,
    8215136,
    17612826,
    17612827,
    28053287,
    28053286,
    31823001,
    10277953,
    28053226,
    8882541,
    10277954,
    27626316,
    8679377,
    5511227,
    2479242
  ),
  coffee: photo(
    27860686,
    31711944,
    16608331,
    5373242,
    13013307,
    997670,
    459489,
    4913342,
    111159,
    31139336,
    19252265,
    32582469,
    765162,
    37676681,
    1235706,
    36238393,
    5600707,
    8700714,
    2226091
  ),
};

const categoryPools = {
  Salads: pools.salad,
  Appetizer: pools.appetizer,
  Bread: pools.bread,
  Starters: pools.appetizer,
  Beef: pools.steak,
  Lamb: pools.steak,
  Poultry: pools.poultry,
  Fish: pools.fish,
  Desserts: pools.dessert,
  Whiskey: pools.brandy,
  "Gin & Rum": [...pools.gin, ...pools.rum],
  Vodka: pools.vodka,
  "Anise Drinks": [...pools.vodka, ...pools.liquor],
  Rakia: [...pools.brandy, ...pools.liquor],
  Liquors: pools.liquor,
  Tequila: pools.tequila,
  Beer: pools.beer,
  "Soft Drinks": pools.juice,
  "Fresh Juices": pools.juice,
  "Hot Drinks": pools.coffee,
};

const sourceExtensions = {
  16313570: "png",
};

function englishCategoryName(categoryName) {
  const parts = categoryName.split(" / ");
  return parts[1] ?? parts[0];
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const usedPhotoIds = new Set();
const usedSlugs = new Set();
const categoryOffsets = new Map();
const manifest = [];

for (const product of products) {
  const category = categories.find(item => item.id === product.categoryId);
  if (!category) throw new Error(`Missing category for ${product.name}`);

  const categoryName = englishCategoryName(category.name);
  const pool = categoryPools[categoryName];
  if (!pool) throw new Error(`Missing image pool for ${categoryName}`);

  let offset = categoryOffsets.get(categoryName) ?? 0;
  let photoId;
  while (offset < pool.length) {
    const candidate = pool[offset++];
    if (!usedPhotoIds.has(candidate)) {
      photoId = candidate;
      break;
    }
  }
  categoryOffsets.set(categoryName, offset);
  if (!photoId) {
    throw new Error(
      `Not enough unique photos for ${categoryName} (${product.name})`
    );
  }
  usedPhotoIds.add(photoId);

  let slug = slugify(product.name);
  if (!slug || usedSlugs.has(slug)) slug = `${slug || "product"}-${product.id}`;
  usedSlugs.add(slug);

  const fileName = `${slug}.jpg`;
  const sourceExtension = sourceExtensions[photoId] ?? "jpeg";
  const downloadUrl =
    `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.${sourceExtension}` +
    "?auto=compress&cs=tinysrgb&w=640&h=480&fit=crop&fm=jpg";

  manifest.push({
    productId: product.id,
    productName: product.name,
    category: categoryName,
    file: `./images/products/${fileName}`,
    photoId,
    source: `https://www.pexels.com/photo/${photoId}/`,
    downloadUrl,
  });
}

if (
  manifest.length !== products.length ||
  usedPhotoIds.size !== products.length
) {
  throw new Error("Product/photo one-to-one invariant failed");
}

await mkdir(outputDirectory, { recursive: true });

const concurrency = 8;
let cursor = 0;
async function worker() {
  while (cursor < manifest.length) {
    const item = manifest[cursor++];
    const target = path.join(outputDirectory, path.basename(item.file));
    const response = await fetch(item.downloadUrl, {
      headers: { "User-Agent": "DjanamMenuImageBuilder/1.0" },
    });
    if (!response.ok) {
      throw new Error(`${response.status} downloading ${item.productName}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new Error(
        `Non-image response for ${item.productName}: ${contentType}`
      );
    }
    await writeFile(target, Buffer.from(await response.arrayBuffer()));
    process.stdout.write(`✓ ${item.productName}\n`);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await writeFile(
  path.join(outputDirectory, "manifest.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      license: "https://www.pexels.com/legal-pages/license/",
      count: manifest.length,
      products: manifest,
    },
    null,
    2
  )}\n`
);

console.log(
  `Built ${manifest.length} unique product images in ${outputDirectory}`
);
