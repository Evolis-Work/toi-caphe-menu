# JIRA Tasks — Coffee Shop Digital Menu

## Sprint Plan

1. Sprint 1 (MVP core): `MENU-01` -> `MENU-10`
2. Sprint 2 (UX + Perf + SEO): `MENU-11` -> `MENU-15`
3. Sprint 3 (CI/CD + QA + Docs): `MENU-16` -> `MENU-20`

## Task Board

| ID | Epic | Task | Estimate | Dependency | Acceptance Criteria |
|---|---|---|---|---|---|
| MENU-01 | Project Setup | Khoi tao Astro project + cau truc thu muc chuan | 0.5d | - | Co `src/components`, `src/layouts`, `src/pages`, `src/lib`; chay local thanh cong |
| MENU-02 | Project Setup | Cai Tailwind CSS v4 + base theme variables | 0.5d | MENU-01 | Style hoat dong toan site, khong loi build |
| MENU-03 | Project Setup | Tao layout mobile-first cho `/` | 0.5d | MENU-01, MENU-02 | Trang hien thi tot tren viewport mobile |
| MENU-04 | Data Integration | Thiet ke schema du lieu menu + type/interface | 0.5d | MENU-01 | Co type ro cho `category,name,price,description,image,available,bestseller` |
| MENU-05 | Data Integration | Viet `fetchMenu.ts` lay JSON tu Google Sheets luc build | 1d | MENU-04 | Build lay duoc du lieu that, khong runtime server |
| MENU-06 | Data Integration | Normalize/parse du lieu (`price`, boolean flags) | 0.5d | MENU-05 | Du lieu dau vao sai nhe van parse on dinh |
| MENU-07 | Data Integration | Validate du lieu + log canh bao dong loi | 0.5d | MENU-05 | Log canh bao ro dong/cot khi thieu du lieu |
| MENU-08 | Menu UI | Render group theo category | 0.5d | MENU-06 | Mon duoc nhom dung danh muc |
| MENU-09 | Menu UI | Card mon: anh, ten, gia, mo ta, badge | 1d | MENU-08 | UI day du fields theo PRD |
| MENU-10 | Menu UI | Trang thai het mon (`available=false`) + giam opacity | 0.5d | MENU-09 | Badge "Het mon" hien thi dung |
| MENU-11 | Menu UX | Sticky category navigation | 0.5d | MENU-08 | Thanh danh muc co dinh, click nhay dung section |
| MENU-12 | Menu UX | Smooth scroll + active category highlight | 0.5d | MENU-11 | Trai nghiem dieu huong muot tren mobile |
| MENU-13 | Performance | Toi uu anh (WebP/lazy/fallback) | 1d | MENU-09 | Anh tai nhanh, co fallback khi loi link |
| MENU-14 | Performance | Toi uu Lighthouse mobile | 0.5d | MENU-13 | Lighthouse mobile > 90 (Perf/Best Practices/SEO muc tieu) |
| MENU-15 | SEO | Meta title/description/OG | 0.5d | MENU-03 | Share link co preview chuan |
| MENU-16 | CI/CD | Tao workflow build + deploy GitHub Pages | 1d | MENU-05 | Push len `main` tu deploy thanh cong |
| MENU-17 | CI/CD | Schedule rebuild moi 30 phut + manual run | 0.5d | MENU-16 | Workflow chay theo lich va chay tay duoc |
| MENU-18 | QA | Test cross-browser (iOS Safari, Android Chrome, Desktop Chrome) | 1d | MENU-10, MENU-12, MENU-16 | Khong co loi chan trai nghiem chinh |
| MENU-19 | QA | Test du lieu loi (thieu cot, anh hong, boolean sai) | 0.5d | MENU-07 | He thong fail-safe, log ro nguyen nhan |
| MENU-20 | Docs | SOP cap nhat menu cho chu quan | 0.5d | MENU-17 | Nguoi khong ky thuat cap nhat menu < 1 phut |

## Definition Of Done

1. Khach scan QR xem menu on dinh tren mobile.
2. Chu quan sua Sheet, site tu cap nhat theo lich.
3. Khong can backend/server runtime.
4. Lighthouse mobile dat muc tieu va khong co loi chan build.
