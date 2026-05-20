# AW Client Report Portal Demo

A small React + Vite + TypeScript demo portal for a financial planning firm that currently prepares quarterly client reports manually in Canva/Word.

The demo shows the core workflow:

- Enter client profile, SACS, account, trust/property, and liability data manually.
- Calculate SACS and TCC values deterministically in the browser.
- Preview polished SACS and TCC report-style outputs.
- Save/load a local draft using `localStorage`.
- Print or save the report previews as PDF through the browser print dialog.

## Intentionally Out Of Scope

This is not a full production system. V1 intentionally excludes real banking integrations, Schwab integrations, Zillow integrations, RightCapital, authentication, AI, server-side persistence, and external API calls. The PRD scope is deterministic data entry, calculations, and report preview.

## Local Development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
```

## Static Deploy

This is a frontend-only demo. It does not need Docker, nginx, a database, or a backend service.

Recommended deploy options:

1. Vercel, Netlify, Cloudflare Pages, or Railway.
2. Build command: `npm run build`.
3. Output directory: `dist`.

For Railway without Docker:

1. Push this repo to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Set build command to `npm run build`.
4. Set start command to `npm run start`.
5. Generate a public domain.

## Suggested Next Steps

- Persistent SQLite/Postgres storage.
- Fixed-layout PDF generation.
- Report history.
- Canva export.
- Dropbox save.
- Role-based auth.
