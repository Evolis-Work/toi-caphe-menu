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

function parseNumber(value) {
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

function parseTemp(value) {
  const normalized = String(value || "none").trim().toLowerCase();
  if (["hot", "nong"].includes(normalized)) return "hot";
  if (["cold", "da", "lanh"].includes(normalized)) return "cold";
  if (["both", "ca-hai", "all"].includes(normalized)) return "both";
  return "none";
}

function uid() {
  return Utilities.getUuid();
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

function normalizeCategoryRow(row) {
  return {
    id: String(row.id || uid()),
    name: String(row.name || "").trim(),
    icon: String(row.icon || "").trim(),
    order: parseNumber(row.order),
  };
}

function normalizeItemRow(row) {
  return {
    id: String(row.id || uid()),
    category: String(row.category || "").trim(),
    name: String(row.name || "").trim(),
    temp: parseTemp(row.temp),
    price: parseNumber(row.price),
    description: String(row.description || "").trim(),
    image: String(row.image || "").trim(),
    available: parseBoolean(row.available),
    bestseller: parseBoolean(row.bestseller),
    order: parseNumber(row.order),
  };
}

function readCategories() {
  return readTable(CONFIG.categoriesSheetName)
    .map(normalizeCategoryRow)
    .filter((row) => row.name)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "vi"));
}

function readItems() {
  return readTable(CONFIG.itemsSheetName)
    .map(normalizeItemRow)
    .filter((row) => row.category && row.name)
    .sort((a, b) => a.category.localeCompare(b.category, "vi") || a.order - b.order || a.name.localeCompare(b.name, "vi"));
}

function syncCategoriesSheet(categories) {
  writeTable(CONFIG.categoriesSheetName, categories, ["id", "name", "icon", "order"]);
}

function syncItemsSheet(items) {
  writeTable(CONFIG.itemsSheetName, items, ["id", "category", "name", "temp", "price", "description", "image", "available", "bestseller", "order"]);
}

function createCategory(data) {
  const categories = readCategories();
  const name = String(data.name || "").trim();
  const icon = String(data.icon || "").trim();
  const order = parseNumber(data.order);

  if (!name) {
    throw new Error("Category name is required.");
  }
  if (categories.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) {
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
  const nextIcon = String(data.icon || previous.icon).trim();
  const nextOrder = parseNumber(data.order ?? previous.order);

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

function deleteCategory(id, cascade) {
  const categories = readCategories();
  const items = readItems();
  const category = categories.find((entry) => entry.id === id);
  if (!category) {
    throw new Error("Category not found.");
  }

  const nextCategories = categories.filter((entry) => entry.id !== id);
  const nextItems = cascade === false ? items : items.filter((item) => item.category !== category.name);
  syncCategoriesSheet(nextCategories);
  syncItemsSheet(nextItems);
  return { deletedCategory: category.name, deletedItems: items.length - nextItems.length };
}

function createMenuItem(data) {
  const categories = readCategories();
  const items = readItems();
  const category = String(data.category || "").trim();
  const name = String(data.name || "").trim();

  if (!category || !name) {
    throw new Error("Category and name are required.");
  }
  if (!categories.some((entry) => entry.name === category)) {
    throw new Error(`Unknown category: ${category}`);
  }

  const item = {
    id: uid(),
    category,
    name,
    temp: parseTemp(data.temp),
    price: parseNumber(data.price),
    description: String(data.description || "").trim(),
    image: String(data.image || "").trim(),
    available: parseBoolean(data.available),
    bestseller: parseBoolean(data.bestseller),
    order: parseNumber(data.order),
  };

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
    category: String(data.category ?? items[index].category).trim(),
    name: String(data.name ?? items[index].name).trim(),
    temp: parseTemp(data.temp ?? items[index].temp),
    price: parseNumber(data.price ?? items[index].price),
    description: String(data.description ?? items[index].description).trim(),
    image: String(data.image ?? items[index].image).trim(),
    available: data.available === undefined ? items[index].available : parseBoolean(data.available),
    bestseller: data.bestseller === undefined ? items[index].bestseller : parseBoolean(data.bestseller),
    order: parseNumber(data.order ?? items[index].order),
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
        return json({ ok: true, data: deleteCategory(body.id, body.data && body.data.cascade) });
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
    return json({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}
