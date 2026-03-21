# Lộc Cà Phê Menu

Digital menu static cho Lộc Cà Phê.

## Kiến trúc

Luồng dữ liệu chính:

`Google Sheet -> Apps Script JSON -> build sync -> src/data/menu.generated.json + public/menu-images/ -> GitHub Pages`

Frontend không gọi API runtime. Khi build, script sync sẽ lấy dữ liệu từ `SHEET_JSON_URL`, sinh ra `menu.generated.json`, tải ảnh món về `public/menu-images/`, rồi frontend import file đó để render menu, search, sticky category, scrollspy.

Nếu Sheet hoặc Apps Script lỗi, hệ thống sẽ giữ snapshot đã tạo gần nhất để site không bị trắng.

Trong GitHub Actions, build chạy ở strict mode: nếu sync Sheet lỗi thì workflow fail thay vì publish snapshot cũ.

Trang `/admin` trên GitHub Pages chỉ là launcher. UI CRUD thật nằm trong Apps Script HTML Service và mở bằng cùng web app URL với `?view=admin`.

## Chạy local

```bash
npm install
npm run dev
```

`npm run dev` và `npm run build` đều chạy `predev/prebuild` để sync dữ liệu trước.

## Environment

Copy [.env.example](.env.example) nếu cần local override:

- `SHEET_JSON_URL`
- `SITE_URL`
- `REPO_NAME`
- `PUBLIC_BUSINESS_TELEPHONE`
- `PUBLIC_BUSINESS_POSTAL_CODE`
- `PUBLIC_BUSINESS_PRICE_RANGE`

## Google Sheet + Apps Script

Sheet là nơi nhập dữ liệu menu. Apps Script xuất JSON công khai để build sync đọc.

Ví dụ Apps Script export có trong [docs/GOOGLE_SHEET_APPS_SCRIPT.md](docs/GOOGLE_SHEET_APPS_SCRIPT.md).

Khuyến nghị JSON trả về là một mảng row phẳng, mỗi row có các cột:

- `category`
- `name`
- `temp`
- `price`
- `description`
- `image`
- `available`
- `bestseller`

Ảnh nên là URL public nếu muốn build tự tải ảnh về `public/menu-images/`.

## Deployment

- Frontend: GitHub Actions -> GitHub Pages
- Data source: Google Sheet + Apps Script JSON

### GitHub Actions

Workflow deploy ở [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Cần đặt repository variable:

- `SHEET_JSON_URL` = URL JSON public từ Apps Script

Các biến SEO tùy chọn:

- `PUBLIC_BUSINESS_TELEPHONE`
- `PUBLIC_BUSINESS_POSTAL_CODE`
- `PUBLIC_BUSINESS_PRICE_RANGE`

## Admin CRUD

Để bật CRUD category và menu item:

1. Tạo Apps Script theo hướng dẫn trong [docs/GOOGLE_SHEET_APPS_SCRIPT.md](docs/GOOGLE_SHEET_APPS_SCRIPT.md).
2. Đặt script property `ADMIN_KEY` trong Apps Script.
3. Deploy web app và mở `?view=admin` để dùng UI CRUD.

## Notes

- Nguồn dữ liệu chính là Google Sheet.
- Frontend build dùng base path `/toi-caphe-menu` để chạy trên GitHub Pages.
- Dữ liệu runtime của frontend là JSON tĩnh đã sinh từ bước build, không query API trực tiếp.
