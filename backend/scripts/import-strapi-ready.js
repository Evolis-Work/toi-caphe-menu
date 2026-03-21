const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const Strapi = require('@strapi/strapi').default;

const appDir = path.resolve(__dirname, '..');
const dataPath = path.join(appDir, 'data', 'strapi-ready.json');
const shouldUploadImages = process.env.STRAPI_IMPORT_IMAGES === 'true';
const shouldForceImages = process.env.STRAPI_IMPORT_FORCE_IMAGES === 'true';
const publicBaseUrl = process.env.STRAPI_PUBLIC_BASE_URL?.replace(/\/$/, '') || '';

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (!publicBaseUrl) return '';
  return new URL(url, `${publicBaseUrl}/`).toString();
}

async function downloadToTempFile(url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'toi-caphe-menu-import-'));
  const filePath = path.join(tempDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    tempDir,
    size: buffer.length,
    mimeType: response.headers.get('content-type') || 'application/octet-stream',
  };
}

async function uploadExternalImage(strapi, imageUrl, slug) {
  const normalizedUrl = normalizeUrl(imageUrl);
  if (!normalizedUrl) {
    return null;
  }

  const urlPath = new URL(normalizedUrl).pathname;
  const ext = path.extname(urlPath) || '.jpg';
  const filename = `${slugify(slug || path.basename(urlPath, ext))}${ext}`;
  const downloaded = await downloadToTempFile(normalizedUrl, filename);

  try {
    const uploaded = await strapi.plugin('upload').service('upload').upload(
      {
        data: { fileInfo: { name: filename } },
        files: [
          {
            path: downloaded.filePath,
            filepath: downloaded.filePath,
            originalFilename: filename,
            newFilename: filename,
            mimetype: downloaded.mimeType,
            size: downloaded.size,
          },
        ],
      },
      { user: undefined }
    );

    return uploaded?.[0]?.id ?? null;
  } finally {
    await fs.rm(downloaded.tempDir, { recursive: true, force: true });
  }
}

async function upsertCategory(strapi, categoryData) {
  const existing = await strapi.entityService.findMany('api::category.category', {
    filters: { slug: categoryData.slug },
    limit: 1,
    publicationState: 'preview',
  });

  const data = {
    name: categoryData.name,
    order: categoryData.order,
    icon: categoryData.icon || null,
    publishedAt: new Date().toISOString(),
  };

  if (existing.length > 0) {
    const [current] = existing;
    return strapi.entityService.update('api::category.category', current.id, { data });
  }

  return strapi.entityService.create('api::category.category', {
    data: {
      ...data,
      slug: categoryData.slug,
    },
  });
}

async function upsertMenuItem(strapi, itemData, categoryId) {
  const existing = await strapi.entityService.findMany('api::menu-item.menu-item', {
    filters: { slug: itemData.slug },
    populate: ['image'],
    limit: 1,
    publicationState: 'preview',
  });

  const current = existing[0];
  const data = {
    name: itemData.name,
    slug: itemData.slug,
    price: itemData.price,
    description: itemData.description,
    temp: itemData.temp,
    available: itemData.available,
    bestseller: itemData.bestseller,
    order: itemData.order,
    category: categoryId,
    publishedAt: new Date().toISOString(),
  };

  if (shouldUploadImages && itemData.image && (!current?.image?.id || shouldForceImages)) {
    data.image = await uploadExternalImage(strapi, itemData.image, itemData.slug);
  }

  if (current) {
    return strapi.entityService.update('api::menu-item.menu-item', current.id, { data });
  }

  return strapi.entityService.create('api::menu-item.menu-item', { data });
}

async function main() {
  const raw = await fs.readFile(dataPath, 'utf8');
  const payload = JSON.parse(raw);

  const strapi = new Strapi({
    appDir,
    distDir: appDir,
    autoReload: false,
    serveAdminPanel: false,
  });

  await strapi.load();

  try {
    console.log(`[import] categories: ${payload.categories.length}, menu items: ${payload.menuItems.length}`);
    console.log(`[import] upload images: ${shouldUploadImages ? 'yes' : 'no'}`);

    const categoryIdBySlug = new Map();
    for (const category of payload.categories) {
      const created = await upsertCategory(strapi, category);
      categoryIdBySlug.set(category.slug, Number(created.id));
      console.log(`[import] category ${category.slug} -> ${created.id}`);
    }

    for (const item of payload.menuItems) {
      const categoryId = categoryIdBySlug.get(item.categorySlug);
      if (!categoryId) {
        throw new Error(`Missing categoryId for ${item.categorySlug}`);
      }

      const result = await upsertMenuItem(strapi, item, categoryId);
      console.log(`[import] item ${item.slug} -> ${result.id}`);
    }

    console.log('[import] done');
  } finally {
    await strapi.destroy();
  }
}

main().catch((error) => {
  console.error('[import] failed');
  console.error(error);
  process.exit(1);
});
