# Backend - Strapi Cloud

Strapi backend cho menu số của Lộc Cà Phê.

## Mục tiêu

- Quản lý `category` và `menu-item` trong Strapi Cloud.
- Cho frontend Astro đọc API public.
- Giữ cấu trúc đơn giản để deploy thẳng lên Strapi Cloud Free.

## Content types

### category

- `name` - tên danh mục
- `slug` - UID thân thiện với URL
- `order` - thứ tự hiển thị
- `icon` - icon/category mark tuỳ chọn
- `menu_items` - relation oneToMany sang `menu-item`

### menu-item

- `name` - tên món
- `slug` - UID thân thiện với URL
- `price` - giá VNĐ
- `description` - mô tả ngắn
- `temp` - enum: `hot`, `cold`, `both`, `none`
- `available` - món còn hàng hay không
- `bestseller` - món nổi bật
- `order` - thứ tự hiển thị trong category
- `image` - media ảnh món
- `category` - relation manyToOne sang `category`

## Environment

Local mặc định dùng SQLite. Khi deploy Strapi Cloud, đặt biến môi trường DB do Strapi Cloud cung cấp.

Biến môi trường cần nhớ:

- `HOST`
- `PORT`
- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `DATABASE_CLIENT`
- `DATABASE_URL`

## API public

Frontend hiện không đọc API trực tiếp ở runtime. Build frontend sẽ gọi hai endpoint này, sau đó sinh `frontend/src/data/menu.generated.json`:

- `GET /api/categories?sort[0]=order:asc`
- `GET /api/menu-items?sort[0]=order:asc&populate=*`

Sau khi tạo content types, bật quyền `find` và `findOne` cho Public role trong Strapi Admin.

## Commands

```bash
npm run develop
npm run build
npm run start
```

## Seed data mẫu

Local dev có thể tự nạp sample menu bằng cách bật:

```bash
STRAPI_SEED_MENU=true npm run develop
```

Seed chỉ chạy khi chưa có category nào trong database. Điều này tránh ghi đè dữ liệu thật trên Strapi Cloud.

## Import từ JSON

Để import dữ liệu đã xuất sẵn vào Strapi:

```bash
npm run import:menu
```

Hoặc từ root repo:

```bash
npm run backend:import
```

Tuỳ chọn ảnh từ URL:

```bash
STRAPI_IMPORT_IMAGES=true STRAPI_PUBLIC_BASE_URL=https://... npm run import:menu
```

Script này upsert theo `slug`, nên chạy lại không tạo bản sao trùng lặp.
