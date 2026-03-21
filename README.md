# Lộc Cà Phê Menu

Monorepo cho digital menu của Lộc Cà Phê.

- `frontend/`: Astro + React, deploy lên GitHub Pages.
- `backend/`: Strapi app để quản lý menu, deploy lên Strapi Cloud Free.

## Architecture

Luồng dữ liệu chính:

`Strapi Cloud -> build sync -> frontend/src/data/menu.generated.json -> GitHub Pages`

Frontend không gọi Strapi API lúc runtime. Khi build, script sync sẽ lấy dữ liệu từ Strapi Cloud, sinh ra `menu.generated.json`, rồi frontend import file đó để render menu, search, sticky category, scrollspy. Nếu Strapi lỗi, hệ thống sẽ fallback sang sample data local để tránh menu trắng.

## Frontend

```bash
npm install
npm run dev
```

Scripts root sẽ chạy vào `frontend/` tự động.

### Backend

```bash
npm run backend:dev
npm run backend:build
npm run backend:start
```

### Environment

Copy `frontend/.env.example` thành `.env` nếu cần local override:

- `PUBLIC_STRAPI_URL`
- `PUBLIC_STRAPI_ADMIN_URL`
- `PUBLIC_BUSINESS_TELEPHONE`
- `PUBLIC_BUSINESS_POSTAL_CODE`
- `PUBLIC_BUSINESS_PRICE_RANGE`

## Backend

`backend/` sẽ chứa Strapi project và schema quản trị.

Khuyến nghị collection types:

- `category`
  - `name` (text)
  - `slug` (uid)
  - `order` (integer)
  - `icon` (text)
- `menu-item`
  - `name` (text)
  - `slug` (uid)
  - `price` (integer)
  - `description` (text)
  - `temp` (enum: `hot`, `cold`, `both`, `none`)
  - `available` (boolean)
  - `bestseller` (boolean)
  - `order` (integer)
  - `image` (media)
  - `category` (relation many-to-one)

## Deployment

- Frontend: GitHub Actions -> GitHub Pages
- Backend: Strapi Cloud Free

### GitHub Actions

Workflow deploy frontend ở `.github/workflows/deploy.yml`.

Cần đặt repository variable:

- `PUBLIC_STRAPI_URL` = public Strapi Cloud URL
- `STRAPI_API_TOKEN` = token read-only của Strapi để build sync dữ liệu

## Notes

- Nguồn dữ liệu chính là Strapi Cloud.
- Admin trang cũ vẫn có thể dùng để hướng dẫn nội dung, nhưng nguồn dữ liệu chính là Strapi.
- Frontend build dùng base path `/toi-caphe-menu` để chạy trên GitHub Pages.
- Dữ liệu runtime của frontend là JSON tĩnh đã sinh từ bước build, không query API trực tiếp.
