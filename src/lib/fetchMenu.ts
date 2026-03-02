import sampleRows from "../data/menu.sample.json";
import type { MenuCategory, MenuItem, MenuTemp } from "../types/menu";

type SheetRow = Record<string, string | number | boolean | undefined>;

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

function toMenuItem(row: SheetRow, rowIndex: number): MenuItem | null {
  const category = String(row.category ?? "").trim();
  const name = String(row.name ?? "").trim();
  const description = String(row.description ?? "").trim();
  const image = String(row.image ?? "").trim();
  const price = parsePrice(row.price);

  if (!category || !name || Number.isNaN(price)) {
    console.warn(
      `[menu] Invalid row ${rowIndex + 1}: category/name/price are required.`,
      row
    );
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

function groupByCategory(items: MenuItem[]): MenuCategory[] {
  const map = new Map<string, MenuItem[]>();

  for (const item of items) {
    const existing = map.get(item.category) ?? [];
    existing.push(item);
    map.set(item.category, existing);
  }

  return [...map.entries()].map(([name, categoryItems]) => ({
    name,
    items: categoryItems.sort((a, b) => {
      if (a.available !== b.available) {
        return a.available ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "vi");
    })
  }));
}

async function loadRows(): Promise<SheetRow[]> {
  const sheetUrl = import.meta.env.SHEET_JSON_URL;

  if (!sheetUrl) {
    return sampleRows as SheetRow[];
  }

  try {
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      console.warn(`[menu] Failed to fetch sheet data: ${response.status}`);
      return sampleRows as SheetRow[];
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      console.warn("[menu] Invalid sheet payload format. Fallback to sample data.");
      return sampleRows as SheetRow[];
    }

    return payload as SheetRow[];
  } catch (error) {
    console.warn("[menu] Fetch error. Fallback to sample data.", error);
    return sampleRows as SheetRow[];
  }
}

export async function fetchMenu(): Promise<MenuCategory[]> {
  const rows = await loadRows();
  const items = rows
    .map((row, index) => toMenuItem(row, index))
    .filter((item): item is MenuItem => item !== null);

  return groupByCategory(items);
}
