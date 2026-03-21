import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const rootDir = process.cwd();
const outputPaths = [
  path.join(rootDir, "src", "data", "menu.generated.json"),
  path.join(rootDir, "public", "menu.generated.json")
];
const imageOutputDir = path.join(rootDir, "public", "menu-images");
const envFiles = [path.join(rootDir, ".env")];

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
  const samplePath = path.join(rootDir, "src", "data", "menu.sample.json");
  const content = await readFile(samplePath, "utf8");
  return JSON.parse(content);
}

async function loadExistingGeneratedRows() {
  try {
    const generatedPath = path.join(rootDir, "src", "data", "menu.generated.json");
    const content = await readFile(generatedPath, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function normalizeBaseUrl(input) {
  return input.endsWith("/") ? input : `${input}/`;
}

function normalizePublicBasePath(input) {
  const raw = String(input ?? "").trim();
  if (!raw) {
    return "/";
  }

  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
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
  if (typeof value === "string") {
    return value.trim();
  }

  const media = unwrapRecord(value);
  if (!media) {
    return "";
  }

  if (typeof media.url === "string" && media.url.trim()) {
    return media.url.trim();
  }

  const formats = media.formats;
  if (formats && typeof formats === "object") {
    for (const format of ["small", "medium", "large", "thumbnail"]) {
      const candidate = formats[format];
      if (candidate && typeof candidate.url === "string" && candidate.url.trim()) {
        return candidate.url.trim();
      }
    }
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

function getImageFileExtension(sourceUrl) {
  try {
    const pathname = new URL(sourceUrl).pathname;
    const ext = path.extname(pathname);
    return ext || ".jpg";
  } catch {
    return ".jpg";
  }
}

function makeImageFileName(categoryName, itemName, sourceUrl) {
  const hash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 10);
  const categorySlug = slugify(categoryName);
  const itemSlug = slugify(itemName);
  return `${categorySlug}-${itemSlug}-${hash}${getImageFileExtension(sourceUrl)}`;
}

function buildPublicImagePath(fileName) {
  const basePath = process.env.PUBLIC_BASE_PATH ?? process.env.REPO_NAME ?? "/toi-caphe-menu/";
  return `${normalizePublicBasePath(basePath)}menu-images/${fileName}`;
}

async function downloadImageAsset(sourceUrl, targetPath) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Image request failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(targetPath, buffer);
}

async function downloadMenuImages(items) {
  const sourceToFile = new Map();
  const downloads = [];

  for (const item of items) {
    if (!item.image || !/^https?:\/\//i.test(item.image)) {
      continue;
    }

    if (sourceToFile.has(item.image)) {
      continue;
    }

    const fileName = makeImageFileName(item.category, item.name, item.image);
    sourceToFile.set(item.image, fileName);
    downloads.push({ sourceUrl: item.image, targetPath: path.join(imageOutputDir, fileName) });
  }

  if (downloads.length === 0) {
    return sourceToFile;
  }

  await rm(imageOutputDir, { recursive: true, force: true });
  await mkdir(imageOutputDir, { recursive: true });

  for (const job of downloads) {
    await downloadImageAsset(job.sourceUrl, job.targetPath);
  }

  return sourceToFile;
}

async function fetchJson(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Sheet request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Sheet request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function toRow(item, categoryName) {
  return {
    category: categoryName,
    name: String(item.name ?? "").trim(),
    price: Number(item.price ?? 0),
    description: String(item.description ?? "").trim(),
    image: String(item.image ?? "").trim(),
    available: parseBoolean(item.available),
    bestseller: parseBoolean(item.bestseller),
    temp: parseTemp(item.temp, categoryName),
    order: parseOrder(item.order)
  };
}

function normalizeSheetPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidates = [payload.rows, payload.data, payload.items];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  if (Array.isArray(payload.values) && payload.values.length > 0) {
    const [headers, ...rows] = payload.values;
    if (!Array.isArray(headers)) {
      return [];
    }

    return rows
      .filter((row) => Array.isArray(row))
      .map((row) =>
        headers.reduce((acc, header, index) => {
          if (typeof header === "string" && header.trim()) {
            acc[header.trim()] = row[index];
          }
          return acc;
        }, {})
      );
  }

  return [];
}

function extractCategoryOrder(sheetPayload) {
  if (!sheetPayload || typeof sheetPayload !== "object" || !Array.isArray(sheetPayload.categories)) {
    return [];
  }

  return sheetPayload.categories
    .map((category) => String(category?.name ?? category?.category ?? "").trim())
    .filter(Boolean);
}

function sortGeneratedRows(rows, categoryOrder = []) {
  const orderedCategories = categoryOrder.length > 0 ? categoryOrder : [...new Set(rows.map((row) => row.category))];
  const categoryIndex = new Map(orderedCategories.map((name, index) => [name, index]));

  return [...rows].sort((a, b) => {
    const categoryDelta = (categoryIndex.get(a.category) ?? Number.MAX_SAFE_INTEGER) - (categoryIndex.get(b.category) ?? Number.MAX_SAFE_INTEGER);
    if (categoryDelta !== 0) {
      return categoryDelta;
    }
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.available !== b.available) {
      return a.available ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "vi");
  });
}

function toGeneratedRows(sheetPayload) {
  const rows = normalizeSheetPayload(sheetPayload);
  const categoryOrder = extractCategoryOrder(sheetPayload);
  const normalizedRows = rows
    .map((row) => toRow(row, String(row.category ?? "")))
    .filter((item) => item.category && item.name && !Number.isNaN(item.price));

  return sortGeneratedRows(normalizedRows, categoryOrder);
}

async function main() {
  await loadEnvFiles();
  const sampleRows = await loadSampleRows();
  const existingGeneratedRows = await loadExistingGeneratedRows();

  const sheetUrl = process.env.SHEET_JSON_URL?.trim();
  const strictMode = parseBoolean(process.env.MENU_SYNC_STRICT);

  let rows = existingGeneratedRows.length > 0 ? existingGeneratedRows : sampleRows;

  if (sheetUrl) {
    try {
      const sheetPayload = await fetchJson(sheetUrl);
      const generatedRows = toGeneratedRows(sheetPayload);
      if (generatedRows.length > 0) {
        rows = generatedRows;
        const sourceToFile = await downloadMenuImages(rows);
        if (sourceToFile.size > 0) {
          rows = rows.map((row) =>
            sourceToFile.has(row.image)
              ? { ...row, image: buildPublicImagePath(sourceToFile.get(row.image)) }
              : row
          );
          console.log(`[sync-menu] Downloaded ${sourceToFile.size} menu images.`);
        }
        console.log(`[sync-menu] Generated ${rows.length} rows from Google Sheet.`);
      } else {
        console.warn("[sync-menu] Sheet returned no rows, keeping existing generated menu if available.");
        if (strictMode) {
          throw new Error("Sheet returned no rows in strict sync mode.");
        }
      }
    } catch (error) {
      console.warn("[sync-menu] Failed to fetch Google Sheet data, keeping existing generated menu if available.", error);
      if (strictMode) {
        throw error;
      }
    }
  } else {
    console.warn("[sync-menu] SHEET_JSON_URL missing, keeping existing generated menu if available.");
    if (strictMode) {
      throw new Error("SHEET_JSON_URL is missing in strict sync mode.");
    }
  }

  if (strictMode && rows.length === 0) {
    throw new Error("Menu sync produced no rows in strict mode.");
  }

  for (const outputPath of outputPaths) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  }
}

await main();
