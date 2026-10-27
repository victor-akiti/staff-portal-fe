# Amni Staff Portal - Front end

Next.js front end for the staff portal, built the same way as `contractor-portal-FE` and
`invoice-portal-FE`. It replaces the Angular app in `staff-portal-FS`.

| | Contractor | Invoice | Staff |
|---|---|---|---|
| Front end (Vercel) | contractor-portal-FE | invoice-portal-FE | **staff-portal-fe** |
| Back end (Azure App Service) | AmniPortal01 | AmniPortal03 | staff-portal-be on AmniPortal02 |
| Login | Firebase Auth | Firebase Auth | Firebase Auth (`amniportal`), Microsoft sign-in |

## Getting started

```sh
npm install
cp .env.example .env.local
npm run dev            # http://localhost:4200, expects staff-portal-be on http://localhost:8086
```

## How it fits together

- **Login:** Microsoft popup through Firebase (`src/lib/microsoftAuth.ts`), then `PUT /user/ver` on
  staff-portal-be, which creates or updates `users/{uid}` and sets the session cookie. On page load
  `GET /user/me` restores the session (`src/hooks/useAuth.ts`).
- **API calls:** RTK Query (`src/redux/apis`) through `baseQueryWithReauth`, which sends the cookie plus a
  Firebase Bearer token, and refreshes once on a 401.
- **Same data as the legacy app:** same Firebase project, `users/{uid}` shape and permission flags
  (`hrAdmin`, `operationsAdmin`, `protocolAdmin`, `documentsAdmin`, `platformAdmin`).
- **Same URLs:** every legacy route exists. Modules not yet migrated (`/operations`, `/hr`, `/documents`,
  `/journey`, `/dashboard`, `/jcc/:id`, `/bunker`, `/apps`) link to the same path on the legacy portal
  (`NEXT_PUBLIC_LEGACY_PORTAL_URL`).

## Migration status

| Area | Status |
|---|---|
| Login, session, admin permission gate | Done |
| Home, quick links, suggestion box, about, finance, ICT, no-profile | Done |
| Operations, Journey, Information Management, HR, Dashboard | Linked to the legacy portal, to be ported |

## Deployment (Vercel)

1. Create a Vercel project for this repo. Production branch `main`; `dev` and other branches become
   previews.
2. Environment variables:
   - Production: `NEXT_PUBLIC_BACKEND_URL` = AmniPortal02 URL
   - Preview: `NEXT_PUBLIC_BACKEND_URL` = AmniPortal02dev URL
   - Both: `NEXT_PUBLIC_LEGACY_PORTAL_URL` = an address where the Angular app stays reachable
     (not portal.amni.com)
3. Add the Vercel domains to Firebase -> Authentication -> Settings -> Authorized domains.
4. Add the same domains to `FRONTEND_URL` on the matching App Service so CORS allows them.
5. Cutover: move `portal.amni.com` from the old Angular Vercel project to this one.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on port 4200 |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
