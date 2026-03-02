# Toi Ca Phe Menu

Static digital menu built with Astro. Data is loaded from Google Sheets JSON at build time.

## Features

- Mobile-first digital menu for QR scan flow
- Grouped categories with sticky category navigation
- Search menu items (accent-insensitive)
- Client-side filters (`available`, `bestseller`) and price sorting
- Build-time Google Sheets fetch with validation + fallback sample data
- GitHub Pages deployment with scheduled rebuild (30 minutes)

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Add `SHEET_JSON_URL` into `.env` (optional, fallback sample data is available).
4. Run dev server:
   ```bash
   npm run dev
   ```

## Data columns required

- `category`
- `name`
- `price`
- `description`
- `image`
- `available`
- `bestseller`
- `temp` (`hot` | `cold` | `both`)

## Deploy

GitHub Actions workflow is at `.github/workflows/deploy.yml`.

- Auto deploy on `main` push
- Scheduled rebuild every 30 minutes
- Manual deploy via `workflow_dispatch`

Add `SHEET_JSON_URL` in GitHub repo secrets for production data.

## Important config

- Update `repoName` and `site` in `astro.config.mjs` to match your GitHub account/repository before production deploy.
