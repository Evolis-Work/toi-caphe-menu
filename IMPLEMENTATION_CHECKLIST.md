# Implementation Checklist — Coffee Shop Digital Menu

## A. Environment And Repo

1. Cai Node LTS va thong nhat package manager (`npm` hoac `pnpm`).
2. Tao GitHub repo va branch strategy (`main` + feature branches).
3. Them `.editorconfig`, `.gitignore`, format/lint co ban.

## B. Astro + Tailwind

1. Init Astro project.
2. Cai Tailwind v4, cau hinh global styles.
3. Tao layout mac dinh va page `/`.

## C. Data Layer (Google Sheets)

1. Publish Sheet thanh JSON endpoint cong khai read-only.
2. Tao `src/lib/fetchMenu.ts`.
3. Them parse/normalize du lieu:
4. `price` -> number.
5. `available`, `bestseller` -> boolean.
6. Them validate:
7. Bat buoc: `category`, `name`, `price`.
8. Optional: `description`, `image`.
9. Log warning co row index de de sua Sheet.

## D. UI Rendering

1. Group menu theo `category`.
2. Render card mon day du thong tin.
3. Badge:
4. `available=false` -> "Het mon".
5. `bestseller=true` -> "Bestseller".
6. Mon het hang van hien thi, giam opacity.

## E. UX Mobile

1. Sticky thanh category.
2. Anchor id theo tung section category.
3. Smooth scroll, nut bam du lon cho touch.
4. Typography de doc tren man hinh nho.

## F. Performance

1. Dung anh WebP uu tien.
2. Lazy-load anh duoi man hinh dau.
3. Khong che kich thuoc anh va tranh CLS.
4. Chay Lighthouse mobile va fix diem thap.

## G. SEO And Social

1. Meta title, description theo thuong hieu quan.
2. Open Graph image/title/description.
3. Them favicon va canonical URL.

## H. CI/CD

1. Tao workflow `deploy.yml`:
2. Trigger `push` vao `main`.
3. Trigger `schedule` moi 30 phut.
4. Trigger `workflow_dispatch`.
5. Build Astro static.
6. Deploy GitHub Pages bang artifact.
7. Bat Pages trong repo settings.

## I. QA

1. Test tren iOS Safari, Chrome Android, Desktop Chrome.
2. Test truong hop:
3. JSON endpoint timeout.
4. Anh loi 404.
5. Thieu cot trong Sheet.
6. Verify "last updated" (neu co) dung timezone mong muon.

## J. Handover

1. Viet README chay local + deploy.
2. Viet SOP cho chu quan:
3. Cach them/sua mon.
4. Quy tac du lieu.
5. Cach manual run workflow.
6. Checklist go-live:
7. QR scan hoat dong.
8. Link production on dinh.
9. Khong loi console nghiem trong.
