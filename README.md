# EnteleSCAN

EnteleSCAN is the AI-powered network explorer, validator intelligence, monitoring, diagnostics, and observability layer of the SOVRA / EnteleKRON ecosystem.

## Site structure

| Page | Path | Description |
|------|------|-------------|
| Homepage | `/` | Mission control, ecosystem animation, SOVRA briefings, live ENK explorer |
| ENK Token | `/token.html` | Contract, supply, utility, and transparency data |
| Documentation | `/docs.html` | Architecture and integration overview |
| API Reference | `/api.html` | REST endpoint documentation |
| FAQ | `/faq.html` | Frequently asked questions |
| Validator Hub | `/validators.html` | Validator program information |
| Privacy | `/privacy.html` | Privacy policy |
| Terms | `/terms.html` | Terms of use |
| Disclaimer | `/disclaimer.html` | Legal disclaimer |

## Assets

- `assets/css/site.css` — Shared TVK Labs design system
- `assets/js/site.js` — Navigation, i18n, shared utilities
- `assets/js/ecosystem-animation.js` — Shared cyber-coin ecosystem animation (28 modules)
- `ecosystem-animation/` — Portable animation bundle (embed.html, CSS, brand assets)

## API routes

- `GET /api/enk?action=supply` — ENK total supply
- `GET /api/enk?action=transfers` — Recent ENK transfers
- `GET /api/search?action=stats` — Network statistics
- `GET /api/search?q={address_or_hash}` — Universal Ethereum search

Requires `ETHERSCAN_API_KEY` in Vercel environment.

## ENK contract

- **Contract:** `0xC95343B3f8A5af57a9b3B1acFf3D2a7654Fa28F6`
- **Network:** Ethereum mainnet (chain ID 1)
- **Max supply:** 100,000,000,000 ENK (18 decimals)
- **Genesis vault:** `0x9c70957b7eae5b56c231e3cd61b067715692c477`

## Deployment (Vercel)

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Build Command | *(leave empty)* |
| Output Directory | `/` |
| Install Command | *(leave empty)* |

Set `ETHERSCAN_API_KEY` in Environment Variables.

## Contact

- **General:** team@entelescan.com
- **Legal:** legal@tvk.group

© 2026 EnteleSCAN · ENTELΞKRON Intelligence Module · T.V.K. Labs & Technologies LTD
