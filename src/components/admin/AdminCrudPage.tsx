import { useEffect, useMemo, useState, type FormEvent } from "react";

type SheetRow = Record<string, unknown>;
type MenuTemp = "hot" | "cold" | "both" | "none";

interface AdminCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  rowType: "category" | "derived";
}

interface AdminItem {
  id: string;
  category: string;
  name: string;
  temp: MenuTemp;
  price: number;
  description: string;
  image: string;
  available: boolean;
  bestseller: boolean;
  order: number;
  rowType: "item";
}

interface AdminPayload {
  categories?: SheetRow[];
  items?: SheetRow[];
  rows?: SheetRow[];
  data?: SheetRow[];
}

interface AdminDataset {
  categories: AdminCategory[];
  items: AdminItem[];
}

interface AdminCrudPageProps {
  sheetJsonUrl: string;
}

interface CategoryFormState {
  id: string;
  name: string;
  icon: string;
  order: string;
}

interface ItemFormState {
  id: string;
  category: string;
  name: string;
  temp: MenuTemp;
  price: string;
  description: string;
  image: string;
  available: boolean;
  bestseller: boolean;
  order: string;
}

const emptyCategoryForm = (): CategoryFormState => ({
  id: "",
  name: "",
  icon: "",
  order: "",
});

const emptyItemForm = (): ItemFormState => ({
  id: "",
  category: "",
  name: "",
  temp: "cold",
  price: "",
  description: "",
  image: "",
  available: true,
  bestseller: false,
  order: "",
});

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    return ["true", "1", "yes", "y"].includes(value.trim().toLowerCase());
  }
  return false;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const clean = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(clean);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function extractRows(payload: unknown): SheetRow[] {
  if (Array.isArray(payload)) {
    return payload as SheetRow[];
  }
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const objectPayload = payload as AdminPayload;
  const candidates = [objectPayload.rows, objectPayload.items, objectPayload.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as SheetRow[];
    }
  }

  return [];
}

function normalizeCategories(rows: SheetRow[]): AdminCategory[] {
  const markers = rows
    .filter((row) => String(row.rowType ?? "").toLowerCase() === "category")
    .map((row, index) => {
      const name = String(row.name ?? row.category ?? "").trim();
      if (!name) {
        return null;
      }
      return {
        id: String(row.id ?? `category-${index}`),
        name,
        icon: String(row.icon ?? "").trim(),
        order: parseNumber(row.order),
        rowType: "category" as const,
      };
    })
    .filter((item): item is AdminCategory => item !== null);

  if (markers.length > 0) {
    return markers.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));
  }

  const seen = new Map<string, AdminCategory>();
  rows.forEach((row, index) => {
    const name = String(row.name ?? row.category ?? "").trim();
    const itemName = String(row.name ?? "").trim();
    if (!name || !itemName) {
      return;
    }
    if (String(row.rowType ?? "").toLowerCase() === "category") {
      return;
    }
    if (!seen.has(name)) {
      seen.set(name, {
        id: `derived-${slugify(name)}-${index}`,
        name,
        icon: "",
        order: parseNumber(row.order),
        rowType: "derived",
      });
    }
  });

  return [...seen.values()].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));
}

function normalizeItems(rows: SheetRow[]): AdminItem[] {
  return rows
    .map((row, index) => {
      const rowType = String(row.rowType ?? "item").toLowerCase();
      const name = String(row.name ?? "").trim();
      const category = String(row.category ?? "").trim();
      const price = parseNumber(row.price);
      if (rowType === "category" || !name) {
        return null;
      }
      return {
        id: String(row.id ?? `item-${index}`),
        category,
        name,
        temp: (String(row.temp ?? "none").trim().toLowerCase() as MenuTemp) || "none",
        price,
        description: String(row.description ?? "").trim(),
        image: String(row.image ?? "").trim(),
        available: parseBoolean(row.available),
        bestseller: parseBoolean(row.bestseller),
        order: parseNumber(row.order),
        rowType: "item" as const,
      };
    })
    .filter((item): item is AdminItem => item !== null)
    .sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category, "vi");
      }
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name, "vi");
    });
}

function formatPrice(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function normalizeResult(result: unknown): unknown {
  if (!result || typeof result !== "object") {
    return result;
  }
  const payload = result as { data?: unknown; rows?: unknown; ok?: unknown };
  if (payload.data && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return result;
}

function extractDataset(payload: unknown): AdminDataset {
  if (!payload || typeof payload !== "object") {
    const rows = extractRows(payload);
    return {
      categories: normalizeCategories(rows),
      items: normalizeItems(rows),
    };
  }

  const objectPayload = payload as AdminPayload;
  const categoryRows = Array.isArray(objectPayload.categories)
    ? objectPayload.categories.map((row) => ({ ...row, rowType: "category" }))
    : [];
  const itemRows = Array.isArray(objectPayload.items)
    ? objectPayload.items
    : extractRows(objectPayload.rows ?? objectPayload.data ?? payload);

  const items = normalizeItems(itemRows);
  const categoriesSource = categoryRows.length > 0 ? categoryRows : itemRows;

  return {
    categories: normalizeCategories(categoriesSource),
    items,
  };
}

export default function AdminCrudPage({ sheetJsonUrl }: Readonly<AdminCrudPageProps>) {
  const [endpoint, setEndpoint] = useState(sheetJsonUrl);
  const [adminKey, setAdminKey] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [itemForm, setItemForm] = useState<ItemFormState>(emptyItemForm);
  const [activePanel, setActivePanel] = useState<"categories" | "items">("items");

  useEffect(() => {
    const storedKey = window.localStorage.getItem("sheet-admin-key") ?? "";
    setAdminKey(storedKey);
  }, []);

  useEffect(() => {
    if (adminKey) {
      window.localStorage.setItem("sheet-admin-key", adminKey);
    }
  }, [adminKey]);

  const filteredCategories = useMemo(() => {
    const query = normalizeText(search.trim());
    if (!query) {
      return categories;
    }
    return categories.filter((category) => normalizeText(category.name).includes(query));
  }, [categories, search]);

  const filteredItems = useMemo(() => {
    const query = normalizeText(search.trim());
    if (!query) {
      return items;
    }
    return items.filter((item) => {
      return (
        normalizeText(item.name).includes(query) ||
        normalizeText(item.category).includes(query) ||
        normalizeText(item.description).includes(query)
      );
    });
  }, [items, search]);

  const categoriesForSelect = useMemo(() => {
    const names = new Set<string>();
    categories.forEach((category) => names.add(category.name));
    items.forEach((item) => names.add(item.category));
    return [...names].sort((a, b) => a.localeCompare(b, "vi"));
  }, [categories, items]);

  async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
    const response = await fetch(input, init);
    const text = await response.text();
    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }
    const isErrorObject =
      typeof parsed === "object" &&
      parsed !== null &&
      "ok" in parsed &&
      (parsed as { ok?: unknown }).ok === false;

    if (!response.ok || isErrorObject) {
      const errorMessage =
        typeof parsed === "object" && parsed && "error" in parsed
          ? String((parsed as { error?: unknown }).error)
          : typeof parsed === "object" && parsed && "message" in parsed
            ? String((parsed as { message?: unknown }).message)
          : `Request failed: ${response.status}`;
      throw new Error(errorMessage);
    }
    return normalizeResult(parsed);
  }

  async function loadData() {
    if (!endpoint) {
      setError("Thiếu SHEET_JSON_URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = await fetchJson(endpoint);
      const dataset = extractDataset(payload);
      setCategories(dataset.categories);
      setItems(dataset.items);
      setMessage("Đã tải dữ liệu từ Google Sheet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  async function mutate(action: string, payload: Record<string, unknown>) {
    if (!endpoint) {
      throw new Error("Thiếu SHEET_JSON_URL.");
    }
    if (!adminKey) {
      throw new Error("Thiếu admin key.");
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await fetchJson(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, adminKey, ...payload }),
      });
      if (result) {
        await loadData();
        setMessage("Đã cập nhật dữ liệu.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật dữ liệu.");
    } finally {
      setSaving(false);
    }
  }

  function startCategoryEdit(category: AdminCategory) {
    setActivePanel("categories");
    setCategoryForm({
      id: category.id,
      name: category.name,
      icon: category.icon,
      order: String(category.order ?? ""),
    });
  }

  function startItemEdit(item: AdminItem) {
    setActivePanel("items");
    setItemForm({
      id: item.id,
      category: item.category,
      name: item.name,
      temp: item.temp,
      price: String(item.price ?? ""),
      description: item.description,
      image: item.image,
      available: item.available,
      bestseller: item.bestseller,
      order: String(item.order ?? ""),
    });
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(categoryForm.id ? "updateCategory" : "createCategory", {
      id: categoryForm.id,
      data: {
        name: categoryForm.name.trim(),
        icon: categoryForm.icon.trim(),
        order: parseNumber(categoryForm.order),
      },
    });
    setCategoryForm(emptyCategoryForm());
  }

  async function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(itemForm.id ? "updateMenuItem" : "createMenuItem", {
      id: itemForm.id,
      data: {
        category: itemForm.category.trim(),
        name: itemForm.name.trim(),
        temp: itemForm.temp,
        price: parseNumber(itemForm.price),
        description: itemForm.description.trim(),
        image: itemForm.image.trim(),
        available: itemForm.available,
        bestseller: itemForm.bestseller,
        order: parseNumber(itemForm.order),
      },
    });
    setItemForm(emptyItemForm());
  }

  async function deleteCategory(category: AdminCategory) {
    if (!window.confirm(`Xóa category "${category.name}" và toàn bộ món thuộc category này?`)) {
      return;
    }
    await mutate("deleteCategory", {
      id: category.id,
      data: { name: category.name, cascade: true },
    });
  }

  async function deleteItem(item: AdminItem) {
    if (!window.confirm(`Xóa món "${item.name}"?`)) {
      return;
    }
    await mutate("deleteMenuItem", { id: item.id });
  }

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-text">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-4 border-b border-luxury-border/20 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-accent mb-2">Admin Panel</p>
              <h1 className="font-bebas text-4xl tracking-wide uppercase text-white">
                CRUD <span className="text-luxury-accent">Google Sheet</span>
              </h1>
              <p className="text-sm text-luxury-muted/80 mt-2 max-w-2xl">
                Thêm, sửa, xoá category và món trực tiếp trên web. Dữ liệu sẽ được đẩy về Google Sheet thông qua Apps Script.
              </p>
            </div>
            <div className="rounded-sm border border-luxury-border/20 bg-luxury-surface/40 p-4 min-w-[280px]">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-muted/70 mb-2">SHEET_JSON_URL</label>
              <input
                value={endpoint}
                onChange={(event) => setEndpoint(event.target.value)}
                className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                placeholder="https://script.google.com/macros/s/.../exec"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              className="bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-white min-w-[260px]"
              placeholder="Admin key"
              type="password"
            />
            <button
                onClick={() => void loadData()}
                className="px-4 py-2 border border-luxury-border/20 rounded-sm text-sm text-luxury-text hover:border-luxury-accent hover:text-luxury-accent transition-colors"
                type="button"
                disabled={loading}
              >
              {loading ? "Đang tải..." : "Tải lại"}
            </button>
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 border border-luxury-border/20 rounded-sm text-sm text-luxury-text hover:border-luxury-accent hover:text-luxury-accent transition-colors"
              type="button"
            >
              Xoá lọc
            </button>
            <div className="text-xs text-luxury-muted/70">
              {categories.length} categories · {items.length} items
            </div>
          </div>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <section className="bg-luxury-surface/30 border border-luxury-border/10 rounded-sm p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bebas text-xl uppercase tracking-[0.2em] text-white">Category</h2>
                <button
                  onClick={() => setCategoryForm(emptyCategoryForm())}
                  className="text-xs uppercase tracking-[0.2em] text-luxury-accent"
                  type="button"
                >
                  + New
                </button>
              </div>
              <form onSubmit={submitCategory} className="space-y-3">
                <input
                  value={categoryForm.name}
                  onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                  placeholder="Tên category"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={categoryForm.icon}
                    onChange={(event) => setCategoryForm((prev) => ({ ...prev, icon: event.target.value }))}
                    className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                    placeholder="Icon"
                  />
                  <input
                    value={categoryForm.order}
                    onChange={(event) => setCategoryForm((prev) => ({ ...prev, order: event.target.value }))}
                    className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                    placeholder="Order"
                    type="number"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 bg-luxury-accent text-black text-sm font-medium rounded-sm disabled:opacity-60"
                    disabled={saving}
                    type="submit"
                  >
                    {categoryForm.id ? "Update" : "Create"}
                  </button>
                  {categoryForm.id ? (
                    <button
                      className="px-4 py-2 border border-luxury-border/20 text-sm rounded-sm"
                      type="button"
                      onClick={() => setCategoryForm(emptyCategoryForm())}
                    >
                      Huỷ
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-luxury-border/15 rounded-sm p-3 bg-black/10 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-white font-medium">{category.name}</p>
                      <p className="text-xs text-luxury-muted/70">
                        {category.rowType === "category" ? "marker row" : "derived"} · order {category.order}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className="text-xs text-luxury-accent"
                        type="button"
                        onClick={() => startCategoryEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-300"
                        type="button"
                        onClick={() => void deleteCategory(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-luxury-surface/30 border border-luxury-border/10 rounded-sm p-5">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-muted/70 mb-2">Tìm kiếm</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                placeholder="Tìm category hoặc món..."
              />
            </section>
          </aside>

          <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActivePanel("items")}
                className={`px-4 py-2 rounded-sm text-xs uppercase tracking-[0.2em] border transition-colors ${
                  activePanel === "items" ? "border-luxury-accent text-luxury-accent" : "border-luxury-border/20 text-luxury-muted"
                }`}
                type="button"
              >
                Menu items
              </button>
              <button
                onClick={() => setActivePanel("categories")}
                className={`px-4 py-2 rounded-sm text-xs uppercase tracking-[0.2em] border transition-colors ${
                  activePanel === "categories" ? "border-luxury-accent text-luxury-accent" : "border-luxury-border/20 text-luxury-muted"
                }`}
                type="button"
              >
                Categories
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
              <div className="bg-luxury-surface/30 border border-luxury-border/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bebas text-xl uppercase tracking-[0.2em] text-white">Menu item</h2>
                  <button
                    onClick={() => setItemForm(emptyItemForm())}
                    className="text-xs uppercase tracking-[0.2em] text-luxury-accent"
                    type="button"
                  >
                    + New
                  </button>
                </div>
                <form onSubmit={submitItem} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={itemForm.category}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, category: event.target.value }))}
                      className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                      required
                    >
                      <option value="">Chọn category</option>
                      {categoriesForSelect.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={itemForm.name}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                      placeholder="Tên món"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={itemForm.price}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, price: event.target.value }))}
                      className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                      placeholder="Giá"
                      type="number"
                      required
                    />
                    <select
                      value={itemForm.temp}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, temp: event.target.value as MenuTemp }))}
                      className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                    >
                      <option value="cold">Lạnh</option>
                      <option value="hot">Nóng</option>
                      <option value="both">Cả hai</option>
                      <option value="none">Không</option>
                    </select>
                  </div>
                  <input
                    value={itemForm.description}
                    onChange={(event) => setItemForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                    placeholder="Mô tả"
                  />
                  <input
                    value={itemForm.image}
                    onChange={(event) => setItemForm((prev) => ({ ...prev, image: event.target.value }))}
                    className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                    placeholder="Image URL"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={itemForm.order}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, order: event.target.value }))}
                      className="w-full bg-black/20 border border-luxury-border/20 rounded-sm px-3 py-2 text-sm text-white"
                      placeholder="Order"
                      type="number"
                    />
                    <label className="flex items-center gap-2 text-sm text-luxury-muted">
                      <input
                        checked={itemForm.available}
                        onChange={(event) => setItemForm((prev) => ({ ...prev, available: event.target.checked }))}
                        type="checkbox"
                      />
                      Còn hàng
                    </label>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-luxury-muted">
                    <input
                      checked={itemForm.bestseller}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, bestseller: event.target.checked }))}
                      type="checkbox"
                    />
                    Bestseller
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 bg-luxury-accent text-black text-sm font-medium rounded-sm disabled:opacity-60"
                      disabled={saving}
                      type="submit"
                    >
                      {itemForm.id ? "Update" : "Create"}
                    </button>
                    {itemForm.id ? (
                      <button
                        className="px-4 py-2 border border-luxury-border/20 text-sm rounded-sm"
                        type="button"
                        onClick={() => setItemForm(emptyItemForm())}
                      >
                        Huỷ
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>

              <div className="bg-luxury-surface/30 border border-luxury-border/10 rounded-sm p-5 overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="font-bebas text-xl uppercase tracking-[0.2em] text-white">Dữ liệu hiện tại</h2>
                  <span className="text-xs text-luxury-muted/70">
                    {activePanel === "categories" ? filteredCategories.length : filteredItems.length} rows
                  </span>
                </div>

                {activePanel === "categories" ? (
                  <div className="space-y-3 max-h-[760px] overflow-auto pr-1">
                    {filteredCategories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-sm border border-luxury-border/15 bg-black/10 p-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-white font-medium">{category.name}</p>
                          <p className="text-xs text-luxury-muted/70">
                            {category.rowType === "category" ? "marker row" : "derived"} · {category.icon || "no icon"} · order {category.order}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-xs text-luxury-accent"
                            type="button"
                            onClick={() => startCategoryEdit(category)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-300"
                            type="button"
                            onClick={() => void deleteCategory(category)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-luxury-border/20">
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted">Món</th>
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted">Category</th>
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted">Giá</th>
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted">Temp</th>
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted">State</th>
                          <th className="py-3 px-3 text-[10px] uppercase tracking-[0.2em] text-luxury-muted"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="border-b border-luxury-border/10">
                            <td className="py-3 px-3">
                              <div className="space-y-1">
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-xs text-luxury-muted/70 line-clamp-1">{item.description || "—"}</p>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-sm text-luxury-muted">{item.category}</td>
                            <td className="py-3 px-3 text-sm text-luxury-accent">{formatPrice(item.price)}</td>
                            <td className="py-3 px-3 text-sm text-luxury-muted">{item.temp}</td>
                            <td className="py-3 px-3 text-xs text-luxury-muted">
                              {item.available ? "available" : "out"}
                              {item.bestseller ? " · bestseller" : ""}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <button className="text-xs text-luxury-accent" type="button" onClick={() => startItemEdit(item)}>
                                  Edit
                                </button>
                                <button className="text-xs text-red-300" type="button" onClick={() => void deleteItem(item)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
