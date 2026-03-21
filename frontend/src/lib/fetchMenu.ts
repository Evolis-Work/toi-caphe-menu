import sampleRows from "../data/menu.sample.json";
import type { MenuCategory, MenuItem, MenuTemp } from "../types/menu";

type SheetRow = Record<string, string | number | boolean | undefined>;

type StrapiMediaValue =
  | string
  | null
  | {
      url?: string;
      data?: {
        attributes?: {
          url?: string;
        };
      } | null;
    };

interface StrapiCollectionResponse<T> {
  data: T[];
}

interface StrapiCategoryValue {
  name?: string;
  slug?: string;
  order?: number | string;
}

interface StrapiMenuItemValue {
  name?: string;
  price?: number | string;
  description?: string;
  image?: StrapiMediaValue;
  available?: boolean | string | number;
  bestseller?: boolean | string | number;
  temp?: string;
  order?: number | string;
  category?: StrapiCategoryValue | { data?: { attributes?: StrapiCategoryValue } | null } | null;
}

interface ParsedStrapiCategory {
  name: string;
  slug: string;
  order: number;
}

interface ParsedStrapiItem {
  categoryName: string;
  name: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  bestseller: boolean;
  temp: MenuTemp;
  order: number;
}

function parseBoolean(value: unknown): boolean {
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

function parsePrice(value: unknown): number {
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

function parseOrder(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function inferTempFromCategory(category: string): MenuTemp {
  const key = category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (key.includes("tra") || key.includes("da xay")) {
    return "cold";
  }
  return "none";
}

function parseTemp(value: unknown, category: string): MenuTemp {
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toAbsoluteUrl(baseUrl: string, maybeRelativeUrl: string): string {
  if (!maybeRelativeUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(maybeRelativeUrl)) {
    return maybeRelativeUrl;
  }

  return new URL(maybeRelativeUrl, baseUrl).toString();
}

function extractDescription(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}

function getStrapiRecord<T extends Record<string, unknown>>(entry: T): T {
  const candidate = entry as T & { attributes?: T };
  return (candidate.attributes ?? entry) as T;
}

function getStrapiCategoryName(value: StrapiMenuItemValue["category"]): string {
  if (!value) {
    return "";
  }

  const category = "data" in value ? value.data?.attributes ?? null : value;
  if (!category) {
    return "";
  }

  return String(category.name ?? category.slug ?? "").trim();
}

function getStrapiMediaUrl(value: StrapiMediaValue): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value.url === "string" && value.url.trim()) {
    return value.url.trim();
  }

  const nestedUrl = value.data?.attributes?.url;
  if (typeof nestedUrl === "string") {
    return nestedUrl.trim();
  }

  return "";
}

function toMenuItem(row: SheetRow, rowIndex: number): MenuItem | null {
  const category = String(row.category ?? "").trim();
  const name = String(row.name ?? "").trim();
  const description = String(row.description ?? "").trim();
  const image = String(row.image ?? "").trim();
  const price = parsePrice(row.price);

  if (!category || !name || Number.isNaN(price)) {
    console.warn(`[menu] Invalid row ${rowIndex + 1}: category/name/price are required.`, row);
    return null;
  }

  return {
    category,
    name,
    price,
    description,
    image,
    available: parseBoolean(row.available),
    bestseller: parseBoolean(row.bestseller),
    temp: parseTemp(row.temp, category)
  };
}

function groupByCategory(items: MenuItem[], categoryOrder?: string[]): MenuCategory[] {
  const map = new Map<string, MenuItem[]>();

  for (const item of items) {
    const existing = map.get(item.category) ?? [];
    existing.push(item);
    map.set(item.category, existing);
  }

  const orderedCategories = categoryOrder?.length
    ? categoryOrder
    : [...new Set(items.map((item) => item.category))];

  return orderedCategories
    .filter((name) => map.has(name))
    .map((name) => ({
      name,
      items: (map.get(name) ?? []).sort((a, b) => {
        if (a.available !== b.available) {
          return a.available ? -1 : 1;
        }
        return a.name.localeCompare(b.name, "vi");
      })
    }));
}

async function loadLegacyRows(): Promise<SheetRow[]> {
  return sampleRows as SheetRow[];
}

function normalizeStrapiBaseUrl(input: string): string {
  return input.endsWith("/") ? input : `${input}/`;
}

function getStrapiHeaders(): HeadersInit | undefined {
  const apiToken = import.meta.env.STRAPI_API_TOKEN?.trim();
  if (!apiToken) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${apiToken}`
  };
}

async function fetchStrapiCollection<T>(baseUrl: string, path: string): Promise<StrapiCollectionResponse<T> | null> {
  const response = await fetch(new URL(path, normalizeStrapiBaseUrl(baseUrl)).toString(), {
    headers: getStrapiHeaders()
  });
  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`);
  }
  return (await response.json()) as StrapiCollectionResponse<T>;
}

async function loadStrapiRows(): Promise<MenuCategory[] | null> {
  const strapiBaseUrl = import.meta.env.PUBLIC_STRAPI_URL?.trim();

  if (!strapiBaseUrl) {
    return null;
  }

  try {
    const [categoriesPayload, menuItemsPayload] = await Promise.all([
      fetchStrapiCollection<StrapiCategoryAttributes>(strapiBaseUrl, "/api/categories?sort[0]=order:asc"),
      fetchStrapiCollection<StrapiMenuItemAttributes>(strapiBaseUrl, "/api/menu-items?sort[0]=order:asc&populate=*")
    ]);

    if (!categoriesPayload || !menuItemsPayload) {
      return null;
    }

    const parsedCategories: ParsedStrapiCategory[] = categoriesPayload.data
      .map((entry) => {
        const category = getStrapiRecord(entry as StrapiCategoryValue & { attributes?: StrapiCategoryValue });
        const name = String(category.name ?? "").trim();
        if (!name) {
          return null;
        }

        return {
          name,
          slug: String(category.slug ?? "").trim() || slugify(name),
          order: parseOrder(category.order)
        };
      })
      .filter((item): item is ParsedStrapiCategory => item !== null)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));

    const parsedItems: ParsedStrapiItem[] = menuItemsPayload.data
      .map((entry) => {
        const item = getStrapiRecord(entry as StrapiMenuItemValue & { attributes?: StrapiMenuItemValue });
        const name = String(item.name ?? "").trim();
        const price = parsePrice(item.price);
        const categoryName = getStrapiCategoryName(item.category);

        if (!name || Number.isNaN(price) || !categoryName) {
          return null;
        }

        const imageUrl = getStrapiMediaUrl(item.image);

        return {
          categoryName,
          name,
          price,
          description: extractDescription(item.description),
          image: toAbsoluteUrl(strapiBaseUrl, imageUrl),
          available: parseBoolean(item.available),
          bestseller: parseBoolean(item.bestseller),
          temp: parseTemp(item.temp, categoryName),
          order: parseOrder(item.order)
        };
      })
      .filter((item): item is ParsedStrapiItem => item !== null)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));

    if (parsedItems.length === 0) {
      return null;
    }

    const itemsByCategory = new Map<string, MenuItem[]>();
    for (const item of parsedItems) {
      const categoryName =
        parsedCategories.find((category) => category.name === item.categoryName || category.slug === item.categoryName)?.name ??
        item.categoryName;

      const existing = itemsByCategory.get(categoryName) ?? [];
      existing.push({
        category: categoryName,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        available: item.available,
        bestseller: item.bestseller,
        temp: item.temp
      });
      itemsByCategory.set(categoryName, existing);
    }

    const categoryOrder = parsedCategories.length
      ? parsedCategories.map((category) => category.name)
      : [...new Set(parsedItems.map((item) => item.categoryName))];

    return categoryOrder
      .filter((name) => itemsByCategory.has(name))
      .map((name) => ({
        name,
        items: (itemsByCategory.get(name) ?? []).sort((a, b) => {
          if (a.available !== b.available) {
            return a.available ? -1 : 1;
          }
          return a.name.localeCompare(b.name, "vi");
        })
      }));
  } catch (error) {
    console.warn("[menu] Failed to fetch Strapi data. Falling back to local sample.", error);
    return null;
  }
}

async function loadRows(): Promise<SheetRow[]> {
  const strapiCategories = await loadStrapiRows();
  if (strapiCategories) {
    return strapiCategories.flatMap((category) =>
      category.items.map((item) => ({
        category: item.category,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        available: item.available,
        bestseller: item.bestseller,
        temp: item.temp
      }))
    );
  }

  return loadLegacyRows();
}

export async function fetchMenu(): Promise<MenuCategory[]> {
  const strapiCategories = await loadStrapiRows();
  if (strapiCategories) {
    return strapiCategories;
  }

  const rows = await loadRows();
  const items = rows
    .map((row, index) => toMenuItem(row, index))
    .filter((item): item is MenuItem => item !== null);

  return groupByCategory(items);
}
