# Design System: T.Ô.I COFFEE & TEA Menu

## 1. Visual Theme & Atmosphere
Hệ thống thiết kế theo phong cách **Luxury Premium (Sự tinh tế tối giản)**. Cảm hứng được lấy từ các thực đơn cao cấp tại các khách sạn 5 sao và quán cà phê specialty. 
- **Bầu không khí (Atmosphere):** Trầm mặc, sang trọng, tĩnh lặng và tập trung tuyệt đối vào sản phẩm.
- **Triết lý thẩm mỹ:** Sử dụng khoảng trống (whitespace) rộng rãi, các đường kẻ mảnh (hairline) và hiệu ứng mờ (backdrop blur) để tạo chiều sâu mà không gây rối mắt.

## 2. Color Palette & Roles (Luxury Theme)
Bảng màu được chọn lọc để tạo sự tương phản mạnh mẽ nhưng không chói lọi.

- **Deep Onyx Background (#0D0D0D):** Màu nền chính, tạo sự chiều sâu và làm nổi bật các thành phần khác.
- **Luxury Gold Accent (#C9A962):** Màu vàng đồng cổ điển. Sử dụng cho các điểm nhấn quan trọng (Active state, Bestseller badge, Price).
- **Soft Ivory Text (#F5F4F2):** Màu trắng ngà cho nội dung chính, giúp đọc tốt trên nền tối mà không gây mỏi mắt.
- **Muted Silver (#8A8A8A):** Màu xám bạc cho các mô tả phụ và trạng thái không hoạt động.
- **Surface Black (#1A1A1A):** Sử dụng cho các bề mặt thẻ (cards) và container để phân lớp với nền chính.
- **Iron Border (#2A2A2A):** Màu cho các đường kẻ mảnh ngăn cách các thành phần.

## 3. Typography Rules
Sự kết hợp giữa 3 họ phông chữ tạo nên sự phân cấp thông tin rõ ràng và sang trọng.

- **Phông chữ tiêu đề (Header/Brand):** `Oswald` (được gọi là `font-bebas` trong code). Font không chân (sans-serif) cô đọng, viết hoa hoàn toàn, tạo cảm giác hiện đại và mạnh mẽ.
- **Phông chữ mô tả (Italic/Graceful):** `Lora` (được gọi là `font-cormorant` trong code). Font có chân (serif) mềm mại, thường dùng ở dạng *italic* cho các đoạn mô tả hương vị để gợi cảm xúc.
- **Phông chữ chức năng (Body/Functional):** `Inter`. Đảm bảo tính đọc tốt cho giá tiền, nhãn (labels) và thông tin điều hướng.

## 4. Component Stylings
*   **Thanh điều hướng (Category Nav):** Sử dụng `backdrop-blur-md` trên nền `bg-luxury-bg/95`. Các mục (items) có khoảng cách rộng (gap-10) và chữ `Bebas` siêu mảnh.
*   **Thẻ thực đơn (Menu Cards):** 
    *   **Layout:** Cấu trúc 2 cột linh hoạt. Trái là nội dung, phải là hình ảnh sản phẩm.
    *   **Hình ảnh:** Bo góc rất nhẹ (`rounded-sm`), có hiệu ứng `hover:scale-105` mượt mà.
    *   **Trạng thái "Tạm hết":** Sử dụng `grayscale` và `opacity-50` để biểu thị rõ ràng sự không sẵn có.
*   **Thẻ gợi ý (Recommendation Cards):** Bề mặt `bg-luxury-surface/40` với đường viền mảnh. Icon sử dụng `Material Symbols Outlined` bản mảnh nhất để giữ tính đồng nhất.
*   **Ô tìm kiếm (Search Input):** Thiết kế tối giản chỉ với một đường kẻ dưới (border-b), không có hộp bao quanh, chuyển màu vàng gold khi `focus`.

## 5. Layout Principles
- **Mobile-First Canvas:** Giới hạn chiều rộng ở `max-w-md` để duy trì tỉ lệ vàng của một tấm thực đơn cầm tay trên di động.
- **Symmetry & Balance:** Các thành phần được căn lề chặt chẽ với Padding X là `px-8` (32px), tạo sự cân đối tuyệt đối.
- **Visual Hierarchy:** Sử dụng kích thước chữ và khoảng cách (Spacing) để dẫn dắt mắt người dùng từ Danh mục -> Tên món -> Mô tả -> Giá tiền.
- **Spacing Strategy:** Khoảng cách giữa các nhóm danh mục rất lớn (`space-y-20`) để mỗi nhóm sản phẩm đều có không gian "thở" riêng.

## 6. Accessibility & UX logic
- **Tap Targets:** Các nút điều hướng danh mục và thẻ gợi ý được thiết kế vùng chạm lớn.
- **Visual Feedback:** Hiệu ứng `hover` chuyển màu vàng gold tinh tế cho toàn bộ vùng thẻ món uống.
- **Contextual Microcopy:** Sử dụng ngôn ngữ chuyên nghiệp (e.g., "Khuyên dùng" thay vì "Hot", "Thưởng thức sự tinh túy" thay vì "Xem thực đơn").
