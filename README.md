# Hammad Zahoor - MERN Portfolio

An existing React/Vite/Tailwind portfolio with an Express API, MongoDB projects, JWT administrator login, project CRUD, and a contact inbox. The dark HZ brand is retained. Projects remain database-driven; no production fixtures have been introduced.

## Local setup

Use Node.js 22 or 24 LTS and npm. Install both lockfiles with `npm ci --prefix client` and `npm ci --prefix server`.

1. Copy `server/.env.example` to `server/.env`; configure MongoDB, the admin email, a bcrypt password hash, and a random JWT signing secret of at least 32 characters.
2. For a new administrator, run `npm run hash-password --prefix server` in an interactive terminal. Input is hidden. Copy the resulting hash line into the server environment. Never put the actual password in a shell command or a frontend variable.
3. For an existing administrator, follow [AUTH-MIGRATION.md](server/AUTH-MIGRATION.md) **before restarting the updated backend**. `npm run migrate-admin --prefix server` preserves the current password and does not modify the database. Existing bcrypt `ADMIN_PASSWORD` values remain a temporary compatibility option; plaintext is rejected.
4. Copy `client/.env.example` to `client/.env`. Blank `VITE_API_URL` uses the Vite development proxy to `http://localhost:5000`; no development URL is baked into a production bundle.
5. In separate terminals, run `npm run dev --prefix server` and `npm run dev --prefix client`. Open the frontend at `http://localhost:5173`.
6. Open `/admin` to sign in. Create, edit, feature, order, and delete projects, or review contact messages. Provide actual project screenshots and honest descriptions explaining purpose, problem, technologies, and features.

Optional `npm run seed --prefix server` adds demonstration projects only to an **empty development database**. It refuses existing data and production mode. Do not use demonstration content as a substitute for your own work.

## Public frontend environment

All `VITE_` variables are public, embedded at **build time**. Never use them for database credentials, JWT secrets, SMTP passwords, private tokens, or admin credentials. Optional blank/invalid contact and social values are hidden without placeholder links. HTTP(S) URLs must be absolute; credential-bearing and unsafe schemes are rejected.

| Variable | Value / behavior |
| --- | --- |
| `VITE_API_URL` | Backend **origin**, without `/api` or a trailing path. Use its HTTPS origin on Vercel. Blank means same origin; a separately hosted backend requires this variable. |
| `VITE_PORTFOLIO_NAME` | Display name; defaults to Hammad Zahoor. |
| `VITE_PORTFOLIO_ROLE` | Display role; defaults to Full-Stack Developer. |
| `VITE_CONTACT_EMAIL` | Public email; creates a validated mail link. |
| `VITE_CONTACT_PHONE` | Public phone number, optional leading `+`, spaces, parentheses, or hyphens. |
| `VITE_CONTACT_LOCATION` | Public location label. |
| `VITE_GITHUB_URL` | GitHub profile URL. |
| `VITE_LINKEDIN_URL` | LinkedIn profile URL. |
| `VITE_TWITTER_URL` | X/Twitter profile URL. |
| `VITE_FACEBOOK_URL` | Facebook profile URL. |
| `VITE_INSTAGRAM_URL` | Instagram profile URL. |
| `VITE_WHATSAPP_URL` | Public HTTPS WhatsApp contact URL. |
| `VITE_UPWORK_URL` | Upwork profile URL. |
| `VITE_FIVERR_URL` | Fiverr profile URL. |
| `VITE_CV_URL` | Defaults to `/CV.pdf` (case-sensitive). Blank hides the action. Can be an HTTP(S) URL; external servers may open the file instead of honoring the browser's download attribute. |
| `VITE_SITE_URL` | Optional production **origin** for canonical links, social image URLs, and a generated sitemap. Leave blank until a real URL exists. |

The bundled CV is `client/public/CV.pdf`; verify that its contents are current before deploying. The existing portrait is reused for social metadata when a production origin is configured. No social/contact URLs have been invented.

## Private backend environment

| Variable | Requirement |
| --- | --- |
| `NODE_ENV` | `production` on the deployed server. |
| `PORT` | Port supplied by the hosting provider, otherwise 5000. |
| `MONGO_URI` | Private MongoDB connection string; use a dedicated least-privilege database user and network access rules. |
| `JWT_SECRET` | Private random signing secret, at least 32 characters. Generate in your secret manager. Rotating it invalidates all existing tokens. |
| `ADMIN_EMAIL` | Existing administrator's sign-in email. |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash, cost 10-15. New hash helper uses cost 12. See migration guide. |
| `CLIENT_ORIGIN` | Exact allowed frontend origins separated by commas; no wildcard or trailing slash. HTTPS required in production. |
| `TRUST_PROXY_HOPS` | Blank for direct connections. Set only to the verified number of reverse-proxy hops (1-99); ensure clients cannot bypass the proxy. Incorrect values compromise IP-based throttling. |

Messages are saved in MongoDB; this project does not send email or require SMTP credentials. Contact limits are five attempts per ten minutes per IP; login limits are ten attempts per fifteen minutes, in addition to the global API limit. The existing in-memory limiter is appropriate for a single process; use a shared store or edge limits before scaling to multiple replicas. Do not log secrets or request bodies.

JWT bearer authentication is preserved. New tokens expire after one hour. Tokens use tab-scoped session storage, cleared on logout and unauthorized responses. This reduces persistence but does not protect against XSS. Logout cannot revoke a copied stateless token; use signing-key rotation for emergency global invalidation. Existing deployments' copied seven-day tokens remain valid until expiry unless the key is rotated. See [OWASP guidance on browser storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).

## Vercel frontend deployment

1. Import this repository; set **Root Directory** to `client` and use the Vite preset. `client/vercel.json` sets `npm run build`, `dist`, SPA routing, security headers, and admin no-index headers.
2. Configure the public frontend values above in Vercel's production environment, especially the HTTPS `VITE_API_URL` and real `VITE_SITE_URL`.
3. Deploy. Changes to any Vite variable require a **new build/redeployment**; updating settings alone does not update an existing bundle.
4. Add the exact frontend origin to backend `CLIENT_ORIGIN`; restart the backend if it changed. Use a deliberate preview-origin allowlist if testing preview deployments; do not wildcard all origins.
5. Verify direct loading of `/about`, `/projects`, `/contact`, and `/admin`, plus `/CV.pdf`. Confirm API requests go to the configured backend. `/api` is intentionally excluded from SPA rewrites; same-origin production hosting requires an API reverse proxy you configure separately.
6. The CSP permits HTTPS API connections and HTTP(S) project images. Tighten `connect-src` and `img-src` to your real service/image origins once known. Serve production APIs over HTTPS.

Build-time home metadata includes title, description, Open Graph, and Twitter tags. React updates route-specific metadata and canonical links. `robots.txt` is always generated; `sitemap.xml` is generated only when `VITE_SITE_URL` is configured. Admin routes are excluded from indexing; robots rules are not authorization. This remains a client-rendered SPA, so crawlers without JavaScript receive the home metadata for nested routes; no SSR migration was introduced.

## Backend deployment

1. Keep the old deployment available while preparing the credential migration; do not delete/reset data.
2. Deploy `server` to a Node-capable host with `npm ci` and `npm start`.
3. Supply all required server-only variables through the provider's secret settings, including the migrated hash. Configure MongoDB network access and HTTPS.
4. Configure the reverse proxy and `TRUST_PROXY_HOPS` consistently. The application deliberately does not trust arbitrary `X-Forwarded-For` values.
5. Verify `/health`, successful/failed login, authenticated project create/update/delete, contact submission, and the inbox against your deployment. A startup/DB connection failure prevents the service from listening.
6. Keep `.env`, `node_modules`, `dist`, temporary profiles, and QA artifacts out of Git. Never commit actual credentials. The application uses explicit promise wrappers and centralized safe errors for Express 4; see [Express error handling](https://expressjs.com/en/guide/error-handling/).

## Checks

```sh
npm test --prefix client
npm test --prefix server
npm run check --prefix client
npm run check --prefix server
npm run build --prefix client
npm audit --prefix client
npm audit --prefix server
node scripts/browser-check.mjs
node scripts/configured-browser-check.mjs
```

`check` parses JS/JSX, checks backend syntax, and rejects unsafe/placeholder href literals. A full ESLint rule set is not installed. It uses the Babel parser already included by the Vite React plugin, so install the client dependencies for either check command.

The browser script uses installed Chrome and Node's built-in WebSocket support. On other systems, set `CHROME_PATH` to your Chrome/Chromium executable. It serves the **built** client on an ephemeral local port with isolated API fixtures, opens a separate temporary headless profile, checks 320/375/430/768/1024/1440px, exercises public/admin flows, and saves screenshots plus `artifacts/browser-report.json`. The configured variant builds separately under `artifacts/configured-dist` with public test values and verifies all social actions plus canonical/sitemap metadata. These artifacts/profiles are ignored. It does not test a live database or contact anyone. Backend integration tests likewise replace model operations with in-memory mocks and never connect to your MongoDB.

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the file-by-file change log, completed validation, and remaining deployment checks.
