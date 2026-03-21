# Lộc Cà Phê Menu

Digital menu static cho Lộc Cà Phê.

## Kiến trúc

Luồng dữ liệu chính:

`Google Sheet (edit trực tiếp) -> CSV export công khai -> build sync -> src/data/menu.generated.json + public/menu-images/ -> GitHub Pages`

Frontend không gọi API runtime. Khi build, script sync sẽ lấy dữ liệu từ `SHEET_ITEMS_URL` và `SHEET_CATEGORIES_URL`, sinh ra `menu.generated.json`, tải ảnh món về `public/menu-images/`, rồi frontend import file đó để render menu, search, sticky category, scrollspy.

Nếu Sheet lỗi, hệ thống sẽ giữ snapshot đã tạo gần nhất để site không bị trắng.

Trong GitHub Actions, build chạy ở strict mode: nếu sync Sheet lỗi thì workflow fail thay vì publish snapshot cũ.

Không có backend riêng. Anh chỉnh trực tiếp trong Google Sheet, rồi build/deploy lại để sinh snapshot mới.

## Chạy local

```bash
npm install
npm run dev
```

`npm run dev` và `npm run build` đều chạy `predev/prebuild` để sync dữ liệu trước.

## Environment

Copy [.env.example](.env.example) nếu cần local override:

- `SHEET_CATEGORIES_URL`
- `SHEET_ITEMS_URL`
- `SITE_URL`
- `REPO_NAME`
- `PUBLIC_BUSINESS_TELEPHONE`
- `PUBLIC_BUSINESS_POSTAL_CODE`
- `PUBLIC_BUSINESS_PRICE_RANGE`

## Google Sheet export

Sheet là nơi nhập dữ liệu menu. Build sync đọc trực tiếp CSV export công khai của Google Sheet.

Hướng dẫn URL export có trong [docs/GOOGLE_SHEET_EXPORT.md](docs/GOOGLE_SHEET_EXPORT.md).

Khuyến nghị các cột cho tab `MenuItems`:

- `category`
- `name`
- `temp`
- `price`
- `description`
- `image`
- `available`
- `bestseller`
- `order`

Khuyến nghị các cột cho tab `Categories`:

- `id`
- `name`
- `icon`
- `order`

Ảnh nên là URL public nếu muốn build tự tải ảnh về `public/menu-images/`.

## Deployment

- Frontend: GitHub Actions -> GitHub Pages
- Data source: Google Sheet export CSV

### GitHub Actions

Workflow deploy ở [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Cần đặt repository variables:

- `SHEET_CATEGORIES_URL` = URL CSV export public của tab `Categories`
- `SHEET_ITEMS_URL` = URL CSV export public của tab `MenuItems`

Các biến SEO tùy chọn:

- `PUBLIC_BUSINESS_TELEPHONE`
- `PUBLIC_BUSINESS_POSTAL_CODE`
- `PUBLIC_BUSINESS_PRICE_RANGE`

## Notes

- Nguồn dữ liệu chính là Google Sheet.
- Frontend build dùng base path `/toi-caphe-menu` để chạy trên GitHub Pages.
- Dữ liệu runtime của frontend là JSON tĩnh đã sinh từ bước build, không query API trực tiếp.
