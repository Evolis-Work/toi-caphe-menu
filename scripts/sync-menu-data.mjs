import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outputPaths = [
  path.join(rootDir, "frontend", "src", "data", "menu.generated.json"),
  path.join(rootDir, "frontend", "public", "menu.generated.json")
];
const envFiles = [path.join(rootDir, ".env"), path.join(rootDir, "frontend", ".env")];

function parseEnvContent(content) {
  const result = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

async function loadEnvFiles() {
  for (const filePath of envFiles) {
    try {
      const content = await readFile(filePath, "utf8");
      const parsed = parseEnvContent(content);
      for (const [key, value] of Object.entries(parsed)) {
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch {
      // Ignore missing local env files.
    }
  }
}

async function loadSampleRows() {
  const samplePath = path.join(rootDir, "frontend", "src", "data", "menu.sample.json");
  const content = await readFile(samplePath, "utf8");
  return JSON.parse(content);
}

async function loadExistingGeneratedRows() {
  try {
    const generatedPath = path.join(rootDir, "frontend", "src", "data", "menu.generated.json");
    const content = await readFile(generatedPath, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function normalizeBaseUrl(input) {
  return input.endsWith("/") ? input : `${input}/`;
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
}

function parsePrice(value) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const clean = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(clean);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

function parseOrder(value) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function inferTempFromCategory(category) {
  const key = String(category ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (key.includes("tra") || key.includes("da xay")) {
    return "cold";
  }
  return "none";
}

function parseTemp(value, category) {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "hot" || normalized === "nong") {
      return "hot";
    }
    if (normalized === "cold" || normalized === "da" || normalized === "lanh") {
      return "cold";
    }
    if (normalized === "both" || normalized === "ca-hai" || normalized === "all") {
      return "both";
    }
    if (normalized === "none" || normalized === "khong") {
      return "none";
    }
  }
  return inferTempFromCategory(category);
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unwrapRecord(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  if (entry.attributes && typeof entry.attributes === "object") {
    return entry.attributes;
  }

  if ("data" in entry && entry.data) {
    return unwrapRecord(entry.data);
  }

  return entry;
}

function getCategoryName(value) {
  const category = unwrapRecord(value);
  if (!category) {
    return "";
  }

  return String(category.name ?? category.slug ?? "").trim();
}

function getMediaUrl(value) {
  const media = unwrapRecord(value);
  if (!media) {
    return "";
  }

  if (typeof media === "string") {
    return media.trim();
  }

  if (typeof media.url === "string" && media.url.trim()) {
    return media.url.trim();
  }

  return "";
}

function resolveImageUrl(baseUrl, value) {
  const mediaUrl = getMediaUrl(value);
  if (!mediaUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  if (!baseUrl) {
    return mediaUrl;
  }

  return new URL(mediaUrl, normalizeBaseUrl(baseUrl)).toString();
}

async function fetchJson(baseUrl, path, token, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(path, normalizeBaseUrl(baseUrl)).toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Strapi request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Strapi request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function toRow(item, categoryName, baseUrl) {
  return {
    category: categoryName,
    name: String(item.name ?? "").trim(),
    price: Number(item.price ?? 0),
    description: String(item.description ?? "").trim(),
    image: resolveImageUrl(baseUrl, item.image),
    available: parseBoolean(item.available),
    bestseller: parseBoolean(item.bestseller),
    temp: parseTemp(item.temp, categoryName)
  };
}

function toGeneratedRows(categoriesPayload, menuItemsPayload, baseUrl) {
  const categories = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : [];
  const menuItems = Array.isArray(menuItemsPayload?.data) ? menuItemsPayload.data : [];

  const parsedCategories = categories
    .map((entry) => {
      const category = unwrapRecord(entry);
      const name = String(category?.name ?? "").trim();
      if (!name) {
        return null;
      }

      return {
        name,
        slug: String(category?.slug ?? "").trim() || slugify(name),
        order: parseOrder(category?.order)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));

  const parsedItems = menuItems
    .map((entry) => {
      const item = unwrapRecord(entry);
      const name = String(item?.name ?? "").trim();
      const price = parsePrice(item?.price);
      const categoryName = getCategoryName(item?.category);

      if (!name || Number.isNaN(price) || !categoryName) {
        return null;
      }

      return {
        categoryName,
        row: {
          categoryName,
          name,
          price,
          description: String(item?.description ?? "").trim(),
          image: resolveImageUrl(baseUrl, item?.image),
          available: parseBoolean(item?.available),
          bestseller: parseBoolean(item?.bestseller),
          temp: parseTemp(item?.temp, categoryName),
          order: parseOrder(item?.order)
        }
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.row.order - b.row.order || a.row.name.localeCompare(b.row.name, "vi"));

  const itemsByCategory = new Map();
  for (const item of parsedItems) {
    const matchedCategory =
      parsedCategories.find((category) => category.name === item.categoryName || category.slug === item.categoryName)?.name ??
      item.categoryName;
    const existing = itemsByCategory.get(matchedCategory) ?? [];
    existing.push(toRow(item.row, matchedCategory, baseUrl));
    itemsByCategory.set(matchedCategory, existing);
  }

  const categoryOrder = parsedCategories.length
    ? parsedCategories.map((category) => category.name)
    : [...new Set(parsedItems.map((item) => item.categoryName))];

  return categoryOrder.flatMap((name) => itemsByCategory.get(name) ?? []);
}

async function main() {
  await loadEnvFiles();
  const sampleRows = await loadSampleRows();
  const existingGeneratedRows = await loadExistingGeneratedRows();

  const baseUrl = process.env.PUBLIC_STRAPI_URL?.trim();
  const token = process.env.STRAPI_API_TOKEN?.trim();

  let rows = existingGeneratedRows.length > 0 ? existingGeneratedRows : sampleRows;

  if (baseUrl) {
    try {
      const [categoriesPayload, menuItemsPayload] = await Promise.all([
        fetchJson(baseUrl, "/api/categories?sort[0]=order:asc", token),
        fetchJson(baseUrl, "/api/menu-items?sort[0]=order:asc&populate=*", token)
      ]);
      const generatedRows = toGeneratedRows(categoriesPayload, menuItemsPayload, baseUrl);
      if (generatedRows.length > 0) {
        rows = generatedRows;
        console.log(`[sync-menu] Generated ${rows.length} rows from Strapi.`);
      } else {
        console.warn("[sync-menu] Strapi returned no rows, keeping existing generated menu if available.");
      }
    } catch (error) {
      console.warn("[sync-menu] Failed to fetch Strapi data, keeping existing generated menu if available.", error);
    }
  } else {
    console.warn("[sync-menu] PUBLIC_STRAPI_URL missing, keeping existing generated menu if available.");
  }

  for (const outputPath of outputPaths) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  }
}

await main();
