# Google Sheet export

Tài liệu này mô tả luồng dữ liệu hiện tại của dự án:

- Google Sheet là nơi quản lý menu
- Build sync đọc trực tiếp CSV export công khai của Google Sheet
- Frontend chỉ dùng JSON đã sinh lúc build

## Cấu trúc sheet

Khuyến nghị tách 2 tab:

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

## URL export

Mỗi tab có thể lấy bằng URL CSV export của Google Sheet.

Ví dụ:

- `Categories`
  - `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/gviz/tq?tqx=out:csv&sheet=Categories`
- `MenuItems`
  - `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/gviz/tq?tqx=out:csv&sheet=MenuItems`

Thay `<SPREADSHEET_ID>` bằng ID của file Sheet.

## Ghi chú

- Sheet cần cho phép truy cập công khai để build có thể đọc được.
- Nếu chỉ muốn một tab duy nhất, vẫn có thể dùng `SHEET_ITEMS_URL` và để build tự suy ra category từ các row.
- Ảnh trong cột `image` nên là URL public nếu muốn build tự tải về `public/menu-images/`.
