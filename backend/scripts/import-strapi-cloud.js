const fs = require('node:fs/promises');
const path = require('node:path');

const apiBaseUrl = process.env.STRAPI_URL?.replace(/\/$/, '');
const apiToken = process.env.STRAPI_API_TOKEN;
const sourceFile = process.env.STRAPI_IMPORT_FILE
  ? path.resolve(process.env.STRAPI_IMPORT_FILE)
  : path.resolve(__dirname, '..', 'data', 'strapi-ready.json');
const shouldClean = process.env.STRAPI_IMPORT_CLEAN !== 'false';

if (!apiBaseUrl) {
  throw new Error('Missing STRAPI_URL environment variable');
}

if (!apiToken) {
  throw new Error('Missing STRAPI_API_TOKEN environment variable');
}

const headers = {
  Authorization: `Bearer ${apiToken}`,
  'Content-Type': 'application/json'
};

async function apiRequest(method, pathname, body) {
  const response = await fetch(`${apiBaseUrl}${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    throw new Error(
      `${method} ${pathname} failed (${response.status}): ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`
    );
  }

  return parsed;
}

async function findBySlug(collection, slug) {
  const result = await apiRequest(
    'GET',
    `/api/${collection}?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`
  );

  return result?.data?.[0] ?? null;
}

async function listAll(collection) {
  const result = await apiRequest(
    'GET',
    `/api/${collection}?pagination[pageSize]=1000&sort[0]=createdAt:asc`
  );

  return result?.data ?? [];
}

async function deleteAll(collection) {
  const items = await listAll(collection);
  for (const item of items) {
    await apiRequest('DELETE', `/api/${collection}/${item.documentId}`);
    console.log(`[cloud-import] deleted ${collection.slice(0, -1)} ${item.documentId}`);
  }
}

async function upsertCategory(category) {
  const existing = await findBySlug('categories', category.slug);
  const payload = {
    data: {
      name: category.name,
      slug: category.slug,
      order: category.order,
      icon: category.icon || null
    }
  };

  if (existing) {
    const updated = await apiRequest('PUT', `/api/categories/${existing.documentId}`, payload);
    return updated.data;
  }

  const created = await apiRequest('POST', '/api/categories', payload);
  return created.data;
}

async function upsertMenuItem(item, categoryDocumentId) {
  const itemSlug = `${item.categorySlug}-${item.slug}`;
  const existing = await findBySlug('menu-items', itemSlug);
  const relation = {
    connect: [{ documentId: categoryDocumentId }]
  };

  const payload = {
    data: {
      name: item.name,
      slug: itemSlug,
      price: item.price,
      description: item.description,
      temp: item.temp,
      available: item.available,
      bestseller: item.bestseller,
      order: item.order,
      category: relation
    }
  };

  if (existing) {
    const updated = await apiRequest('PUT', `/api/menu-items/${existing.documentId}`, payload);
    return updated.data;
  }

  const created = await apiRequest('POST', '/api/menu-items', payload);
  return created.data;
}

async function main() {
  const raw = await fs.readFile(sourceFile, 'utf8');
  const payload = JSON.parse(raw);

  console.log(`[cloud-import] source: ${sourceFile}`);
  console.log(`[cloud-import] categories: ${payload.categories.length}`);
  console.log(`[cloud-import] menu items: ${payload.menuItems.length}`);
  console.log(`[cloud-import] clean existing content: ${shouldClean ? 'yes' : 'no'}`);

  if (shouldClean) {
    await deleteAll('menu-items');
    await deleteAll('categories');
  }

  const categoryDocumentIdBySlug = new Map();

  for (const category of payload.categories) {
    const result = await upsertCategory(category);
    categoryDocumentIdBySlug.set(category.slug, result.documentId);
    console.log(`[cloud-import] category ${category.slug} -> ${result.documentId}`);
  }

  for (const item of payload.menuItems) {
    const categoryDocumentId = categoryDocumentIdBySlug.get(item.categorySlug);
    if (!categoryDocumentId) {
      throw new Error(`Missing category mapping for ${item.categorySlug}`);
    }

    const result = await upsertMenuItem(item, categoryDocumentId);
    console.log(`[cloud-import] item ${item.slug} -> ${result.documentId}`);
  }

  console.log('[cloud-import] done');
}

main().catch((error) => {
  console.error('[cloud-import] failed');
  console.error(error);
  process.exit(1);
});
