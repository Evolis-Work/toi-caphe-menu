# PRD — Coffee Shop Digital Menu

**Version:** 1.0
**Status:** Draft
**Owner:** Evolis Work

---

# 1. Tổng quan sản phẩm

## 1.1 Mục tiêu

Xây dựng website menu cho quán cà phê:

* Hiển thị menu online qua QR code
* Dễ chỉnh sửa nội dung (không cần backend)
* Tốc độ tải nhanh
* Hosting miễn phí (GitHub Pages)
* Tối ưu cho mobile

## 1.2 Giải pháp kỹ thuật

* **Frontend Framework:** Astro (static build), Tailwind CSS V4, Lucied Icon, Framer Motion
* **Hosting:** GitHub Pages
* **Data source:** Google Sheets
* **CI/CD:** GitHub Actions (build & deploy tự động)

---

# 2. Phạm vi dự án

## 2.1 Trong phạm vi

* Trang menu động theo dữ liệu từ Google Sheets
* Phân loại danh mục (Cà phê, Trà, Đá xay…)
* Hiển thị:

  * Tên món
  * Giá
  * Mô tả
  * Ảnh
  * Trạng thái còn/hết
* QR code truy cập
* Tối ưu mobile
* Rebuild tự động theo lịch

## 2.2 Ngoài phạm vi (Phase sau)

* Thanh toán online
* Đặt món realtime
* Tài khoản admin riêng
* Quản lý tồn kho

---

# 3. Đối tượng sử dụng

## 3.1 Người xem

* Khách tại quán (scan QR)
* Khách online
* 100% mobile-first

## 3.2 Người chỉnh sửa menu

* Chủ quán
* Quản lý
* Nhân viên được cấp quyền Google Sheet

---

# 4. Yêu cầu chức năng

---

## 4.1 Hiển thị menu

### Trang chính `/`

* Logo quán
* Ảnh banner (optional)
* Danh sách danh mục
* Scroll mượt giữa các section

---

### Cấu trúc hiển thị

```
Danh mục
  ├── Món
        ├── Ảnh
        ├── Tên
        ├── Giá
        ├── Mô tả
        └── Badge (Hết món / Bestseller)
```

---

## 4.2 Phân loại danh mục

Google Sheet có cột:

| category | name | price | description | image | available | bestseller |
| -------- | ---- | ----- | ----------- | ----- | --------- | ---------- |

Hệ thống tự nhóm theo `category`.

---

## 4.3 Trạng thái món

| available | Kết quả hiển thị                  |
| --------- | --------------------------------- |
| TRUE      | Hiển thị bình thường              |
| FALSE     | Hiển thị "Hết món" + giảm opacity |

---

## 4.4 Dữ liệu từ Google Sheets

### Yêu cầu

* Sheet publish ra JSON
* Astro fetch dữ liệu lúc build
* Không có server runtime

---

## 4.5 Rebuild tự động

GitHub Actions:

* Trigger khi push code
* Trigger theo lịch (ví dụ: mỗi 30 phút)

Optional:

* Manual "Run workflow"

---

# 5. Yêu cầu phi chức năng

---

## 5.1 Performance

* Lighthouse mobile > 90
* Load < 2 giây (3G)
* Ảnh tối ưu WebP

---

## 5.2 Tương thích

* iOS Safari
* Chrome Android
* Desktop Chrome

---

## 5.3 SEO

* Meta title
* Meta description
* Open Graph (share Facebook/Zalo)

---

## 5.4 Bảo mật

* Không có thông tin nhạy cảm
* Sheet chỉ cấp quyền edit cho nội bộ
* Website chỉ read dữ liệu public

---

# 6. Luồng dữ liệu

```
Google Sheets
     ↓
Publish JSON
     ↓
GitHub Actions (Scheduled build)
     ↓
Astro build static site
     ↓
Deploy GitHub Pages
     ↓
Khách truy cập
```

---

# 7. Cấu trúc thư mục đề xuất

```
/src
  /components
  /layouts
  /pages
  /lib
     fetchMenu.ts
/public
/.github
  /workflows
     deploy.yml
astro.config.mjs
```

---

# 8. Thiết kế giao diện (UX Guidelines)

## 8.1 Mobile-first

* Font lớn
* Khoảng cách rộng
* Nút rõ ràng
* Sticky category navigation (optional)

## 8.2 Visual Style

* Tối giản
* Màu theo branding quán
* Ảnh bo góc
* Shadow nhẹ

---

# 9. Quy trình vận hành

## 9.1 Cập nhật menu

1. Mở Google Sheet
2. Chỉnh sửa giá / thêm món
3. Chờ auto rebuild (≤ 30 phút)
   hoặc
4. Vào GitHub → Run workflow

---

## 9.2 Thêm món mới

* Thêm dòng mới
* Điền đủ cột
* Đảm bảo image là link public

---

# 10. Rủi ro & Giải pháp

| Rủi ro           | Giải pháp              |
| ---------------- | ---------------------- |
| Sheet format sai | Lock header row        |
| Ảnh link hỏng    | Validate URL           |
| Build lỗi        | Kiểm tra JSON format   |
| Update chậm      | Giảm interval schedule |

---

# 11. KPI thành công

* 100% khách có thể xem menu qua QR
* Không cần dev khi chỉnh giá
* Thời gian chỉnh giá < 1 phút
* Site uptime > 99%

---

# 12. Timeline đề xuất

| Giai đoạn       | Thời gian |
| --------------- | --------- |
| Setup Astro     | 1 ngày    |
| Tích hợp Sheets | 1 ngày    |
| UI hoàn thiện   | 1–2 ngày  |
| Test & Deploy   | 1 ngày    |
| Tổng            | ~1 tuần   |

---

# 13. Phase 2 (Tùy chọn)

* Dark mode
* Song ngữ VN/EN
* Trang Bestseller riêng
* Analytics (GA4)
* PWA (add to home screen)

---

# 14. Kết luận

Giải pháp Astro + GitHub Pages + Google Sheets:

* Không backend
* Chi phí = 0
* Dễ vận hành
* Tốc độ cao
* Phù hợp quán cà phê nhỏ và vừa