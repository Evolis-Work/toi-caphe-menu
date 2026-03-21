# Google Sheet + Apps Script CRUD

Tài liệu này mô tả luồng dữ liệu menu của dự án:

- Google Sheet là nơi quản lý category và menu item
- Apps Script xuất JSON cho frontend đọc khi build
- Apps Script HTML Service cung cấp UI CRUD tại `?view=admin`

## Sheet structure

Khuyến nghị tách thành 2 tab:

### `Categories`

Header:

- `id`
- `name`
- `icon`
- `order`

### `MenuItems`

Header:

- `id`
- `category`
- `name`
- `temp`
- `price`
- `description`
- `image`
- `available`
- `bestseller`
- `order`

## Public JSON contract

`doGet()` nên trả về:

```json
{
  "categories": [],
  "items": [],
  "rows": []
}
```

Ý nghĩa:

- `categories`: data cho trang admin
- `items`: data cho trang admin
- `rows`: mảng phẳng để frontend build sync

Frontend build chỉ cần `rows`.
Admin page dùng `categories` + `items`.

## Admin API contract

`doPost()` nhận body JSON:

```json
{
  "action": "createCategory",
  "adminKey": "secret-key",
  "data": {}
}
```

Các action hỗ trợ:

- `createCategory`
- `updateCategory`
- `deleteCategory`
- `createMenuItem`
- `updateMenuItem`
- `deleteMenuItem`

## Apps Script sample

```javascript
const CONFIG = {
  adminKey: PropertiesService.getScriptProperties().getProperty("ADMIN_KEY") || "",
  categoriesSheetName: "Categories",
  itemsSheetName: "MenuItems",
};

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function requireAdminKey(adminKey) {
  if (!CONFIG.adminKey) {
    throw new Error("Missing ADMIN_KEY script property.");
  }
  if (String(adminKey || "") !== CONFIG.adminKey) {
    throw new Error("Invalid admin key.");
  }
}

function parseBoolean(value) {
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

function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet not found: ${name}`);
  }
  return sheet;
}

function readTable(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) {
    return [];
  }

  const headers = values[0].map((header) => String(header || "").trim());
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) =>
      headers.reduce((acc, header, index) => {
        if (header) {
          acc[header] = row[index];
        }
        return acc;
      }, {})
    );
}

function writeTable(sheetName, rows, headers) {
  const sheet = getSheet(sheetName);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length === 0) {
    return;
  }
  sheet.getRange(2, 1, rows.length, headers.length).setValues(
    rows.map((row) => headers.map((header) => row[header] ?? ""))
  );
}

function uid() {
  return Utilities.getUuid();
}

function readCategories() {
  return readTable(CONFIG.categoriesSheetName).map((row) => ({
    id: String(row.id || uid()),
    name: String(row.name || "").trim(),
    icon: String(row.icon || "").trim(),
    order: Number(row.order || 0) || 0,
  })).filter((row) => row.name);
}

function readItems() {
  return readTable(CONFIG.itemsSheetName).map((row) => ({
    id: String(row.id || uid()),
    category: String(row.category || "").trim(),
    name: String(row.name || "").trim(),
    temp: String(row.temp || "none").trim().toLowerCase(),
    price: Number(row.price || 0) || 0,
    description: String(row.description || "").trim(),
    image: String(row.image || "").trim(),
    available: parseBoolean(row.available),
    bestseller: parseBoolean(row.bestseller),
    order: Number(row.order || 0) || 0,
  })).filter((row) => row.category && row.name);
}

function syncCategoriesSheet(categories) {
  writeTable(CONFIG.categoriesSheetName, categories, ["id", "name", "icon", "order"]);
}

function syncItemsSheet(items) {
  writeTable(CONFIG.itemsSheetName, items, ["id", "category", "name", "temp", "price", "description", "image", "available", "bestseller", "order"]);
}

function doGet() {
  const categories = readCategories();
  const items = readItems();
  return json({
    categories,
    items,
    rows: items,
  });
}

function doPost(e) {
  try {
    const body = parseBody(e);
    requireAdminKey(body.adminKey);

    switch (body.action) {
      case "createCategory":
        return json({ ok: true, data: createCategory(body.data || {}) });
      case "updateCategory":
        return json({ ok: true, data: updateCategory(body.id, body.data || {}) });
      case "deleteCategory":
        return json({ ok: true, data: deleteCategory(body.id) });
      case "createMenuItem":
        return json({ ok: true, data: createMenuItem(body.data || {}) });
      case "updateMenuItem":
        return json({ ok: true, data: updateMenuItem(body.id, body.data || {}) });
      case "deleteMenuItem":
        return json({ ok: true, data: deleteMenuItem(body.id) });
      default:
        return json({ ok: false, error: `Unknown action: ${body.action}` });
    }
  } catch (error) {
    return json({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function createCategory(data) {
  const categories = readCategories();
  const name = String(data.name || "").trim();
  const icon = String(data.icon || "").trim();
  const order = Number(data.order || 0) || 0;

  if (!name) {
    throw new Error("Category name is required.");
  }
  if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Category already exists.");
  }

  const category = { id: uid(), name, icon, order };
  categories.push(category);
  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));
  syncCategoriesSheet(categories);
  return category;
}

function updateCategory(id, data) {
  const categories = readCategories();
  const items = readItems();
  const index = categories.findIndex((category) => category.id === id);
  if (index === -1) {
    throw new Error("Category not found.");
  }

  const previous = categories[index];
  const nextName = String(data.name || previous.name).trim();
  const nextIcon = String(data.icon || "").trim();
  const nextOrder = Number(data.order || 0) || 0;

  categories[index] = {
    ...previous,
    name: nextName,
    icon: nextIcon,
    order: nextOrder,
  };

  if (previous.name !== nextName) {
    items.forEach((item) => {
      if (item.category === previous.name) {
        item.category = nextName;
      }
    });
    syncItemsSheet(items);
  }

  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));
  syncCategoriesSheet(categories);
  return categories[index];
}

function deleteCategory(id) {
  const categories = readCategories();
  const items = readItems();
  const category = categories.find((entry) => entry.id === id);
  if (!category) {
    throw new Error("Category not found.");
  }

  const nextCategories = categories.filter((entry) => entry.id !== id);
  const nextItems = items.filter((item) => item.category !== category.name);
  syncCategoriesSheet(nextCategories);
  syncItemsSheet(nextItems);
  return { deletedCategory: category.name, deletedItems: items.length - nextItems.length };
}

function createMenuItem(data) {
  const categories = readCategories();
  const items = readItems();
  const category = String(data.category || "").trim();
  const name = String(data.name || "").trim();
  const item = {
    id: uid(),
    category,
    name,
    temp: String(data.temp || "none").trim().toLowerCase(),
    price: Number(data.price || 0) || 0,
    description: String(data.description || "").trim(),
    image: String(data.image || "").trim(),
    available: parseBoolean(data.available),
    bestseller: parseBoolean(data.bestseller),
    order: Number(data.order || 0) || 0,
  };

  if (!category || !name) {
    throw new Error("Category and name are required.");
  }
  if (!categories.some((entry) => entry.name === category)) {
    throw new Error(`Unknown category: ${category}`);
  }

  items.push(item);
  items.sort((a, b) => a.category.localeCompare(b.category, "vi") || a.order - b.order || a.name.localeCompare(b.name, "vi"));
  syncItemsSheet(items);
  return item;
}

function updateMenuItem(id, data) {
  const categories = readCategories();
  const items = readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Menu item not found.");
  }

  const next = {
    ...items[index],
    category: String(data.category || items[index].category).trim(),
    name: String(data.name || items[index].name).trim(),
    temp: String(data.temp || items[index].temp || "none").trim().toLowerCase(),
    price: Number(data.price ?? items[index].price) || 0,
    description: String(data.description ?? items[index].description).trim(),
    image: String(data.image ?? items[index].image).trim(),
    available: data.available === undefined ? items[index].available : parseBoolean(data.available),
    bestseller: data.bestseller === undefined ? items[index].bestseller : parseBoolean(data.bestseller),
    order: Number(data.order ?? items[index].order) || 0,
  };

  if (!next.category || !next.name) {
    throw new Error("Category and name are required.");
  }
  if (!categories.some((entry) => entry.name === next.category)) {
    throw new Error(`Unknown category: ${next.category}`);
  }

  items[index] = next;
  items.sort((a, b) => a.category.localeCompare(b.category, "vi") || a.order - b.order || a.name.localeCompare(b.name, "vi"));
  syncItemsSheet(items);
  return next;
}

function deleteMenuItem(id) {
  const items = readItems();
  const nextItems = items.filter((item) => item.id !== id);
  if (nextItems.length === items.length) {
    throw new Error("Menu item not found.");
  }
  syncItemsSheet(nextItems);
  return { deleted: true };
}
```

## Deploy

1. Mở Google Sheet.
2. Vào `Extensions -> Apps Script`.
3. Dán code sample ở trên.
4. Trong `Project Settings`, đặt script property:
   - `ADMIN_KEY = <secret-key-your-choice>`
5. Deploy dưới dạng `Web app`.
6. Access: `Anyone`.
7. Copy URL `/exec`.
8. Gán URL đó vào `SHEET_JSON_URL`.

## Admin page

Mở web app với `?view=admin` để:

- load `categories` + `items`
- tạo / sửa / xoá category
- tạo / sửa / xoá menu item

Trang này lưu `adminKey` trong `localStorage` để đỡ phải nhập lại mỗi lần mở.

## Notes

- `price` nên là số.
- `available` và `bestseller` có thể là `TRUE/FALSE`, `true/false`, `1/0`.
- `category` trên item phải khớp `name` của category.
- Khi đổi tên category, Apps Script mẫu sẽ tự cập nhật tất cả item đang dùng category đó.
- Khi xoá category, Apps Script mẫu sẽ xoá luôn toàn bộ item thuộc category đó.
