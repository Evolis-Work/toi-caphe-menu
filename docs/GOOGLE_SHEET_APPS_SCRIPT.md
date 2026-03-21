# Google Sheet + Apps Script JSON Export

File này mô tả cách xuất Google Sheet ra JSON để frontend sync build-time.

## Mục tiêu

- Google Sheet là nơi nhập dữ liệu menu.
- Apps Script đọc sheet và trả JSON public.
- Frontend chỉ cần fetch `SHEET_JSON_URL` khi build.

## Sheet columns

Hàng đầu tiên nên là header với các cột:

- `category`
- `name`
- `temp`
- `price`
- `description`
- `image`
- `available`
- `bestseller`

## Apps Script example

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Menu");
  const values = sheet.getDataRange().getValues();

  if (!values || values.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0].map((header) => String(header || "").trim());
  const rows = values.slice(1).filter((row) => row.some((cell) => cell !== ""));

  const items = rows.map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      if (header) {
        item[header] = row[index];
      }
    });
    return item;
  });

  return ContentService
    .createTextOutput(JSON.stringify(items))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Deploy

1. Mở `Extensions -> Apps Script` trong Google Sheet.
2. Dán đoạn code trên.
3. `Deploy -> New deployment`.
4. Chọn loại `Web app`.
5. Set quyền truy cập `Anyone`.
6. Copy URL `/exec` và gán vào `SHEET_JSON_URL`.

## Notes

- `price` có thể là string hoặc number, frontend build sẽ parse lại.
- `available` / `bestseller` có thể là `TRUE/FALSE`, `true/false`, hoặc `1/0`.
- `image` nên là URL public nếu muốn build tự tải ảnh về `frontend/public/menu-images/`.
