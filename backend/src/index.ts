import seedMenu from './data/seed-menu.json';
import type { Core } from '@strapi/strapi';

type SeedCategory = {
  category: {
    name: string;
    slug: string;
    order: number;
    icon?: string;
  };
  items: Array<{
    name: string;
    slug: string;
    price: number;
    description: string;
    temp: 'hot' | 'cold' | 'both' | 'none';
    available: boolean;
    bestseller: boolean;
    order: number;
  }>;
};

const seedData = seedMenu as SeedCategory[];

async function seedMenuData(strapi: Core.Strapi) {
  const shouldSeed = process.env.STRAPI_SEED_MENU === 'true';
  if (!shouldSeed) {
    strapi.log.info('[seed] STRAPI_SEED_MENU disabled, skipping sample data');
    return;
  }

  const existingCount = await strapi.entityService.count('api::category.category');
  if (existingCount > 0) {
    strapi.log.info(`[seed] Skipping sample data because ${existingCount} categories already exist`);
    return;
  }

  const publishedAt = new Date().toISOString();
  const categoryIdBySlug = new Map<string, number>();

  for (const entry of seedData) {
    const category = await strapi.entityService.create('api::category.category', {
      data: {
        ...entry.category,
        publishedAt,
      },
    });

    categoryIdBySlug.set(entry.category.slug, Number(category.id));
  }

  for (const entry of seedData) {
    const categoryId = categoryIdBySlug.get(entry.category.slug);
    if (!categoryId) {
      continue;
    }

    for (const item of entry.items) {
      await strapi.entityService.create('api::menu-item.menu-item', {
        data: {
          ...item,
          category: categoryId,
          publishedAt,
        },
      });
    }
  }

  strapi.log.info(`[seed] Seeded ${seedData.length} categories and sample menu items`);
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedMenuData(strapi);
  },
};
