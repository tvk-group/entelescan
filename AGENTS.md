# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

EnteleSCAN is a static marketing site (`index.html`) plus two Vercel serverless API routes (`api/enk.js`, `api/search.js`) that proxy Etherscan API v2 for live ENK (EnteleKRON) ERC-20 data and universal search.

### Running locally

Start the full stack (static site + API routes) with:

```bash
npx vercel dev --local --listen 3000 --yes
```

Open http://localhost:3000/

- `--local` avoids linking to a Vercel project account.
- No `npm install` is required; `package.json` has zero runtime dependencies.

### Environment variables

Create `/workspace/.env` (gitignored) with:

```bash
ETHERSCAN_API_KEY=your_etherscan_api_key
```

- **Required** for `/api/enk` (supply + transfers). Without it, the Live Console ENK feed shows "Unavailable".
- **Recommended** for `/api/search` live stats, gas oracle, and block height. Without it, search still works in limited/pattern mode (wallet/contract/tx recognition).

Get a free key at https://etherscan.io/myapikey

### Trailing-slash redirect gotcha

`vercel.json` sets `"trailingSlash": true`. Requests to `/api/search?...` (no trailing slash) receive a **308 redirect to `/api/search/`** and **drop the query string**, which breaks browser `fetch()` calls from `index.html`.

When testing APIs manually, always use trailing slashes:

```bash
curl -sL "http://localhost:3000/api/search/?action=stats"
curl -sL "http://localhost:3000/api/search/?q=0xC95343B3f8A5af57a9b3B1acFf3D2a7654Fa28F6"
curl -sL "http://localhost:3000/api/enk/?action=supply"
```

### Lint / test / build

This repo has **no** ESLint, Prettier, test runner, or build step. Validation options:

- `node --check api/enk.js && node --check api/search.js` — syntax check API handlers
- Manual API smoke tests via `curl` (see above)
- Production deploy: `npm run deploy` (runs `vercel --prod`; requires Vercel auth)

### Optional: static-only preview

A plain static server renders the marketing UI but **cannot** serve `/api/*`:

```bash
python3 -m http.server 8080
```

Use only for visual review of static content; Live Console and search will fail.
