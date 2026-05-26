# PermitPeek

A consumer-facing US building permit lookup tool. Free address search, $9 paid reports, $19/mo "watch an address" subscription.

## Architecture

- **Next.js 15** with App Router (SSR + SSG for SEO)
- **Tailwind CSS v4**
- **Stripe** for $9 checkout
- **Resend** for transactional email
- **Socrata Open Data APIs** for permit data (free, no API key required)

## Quick Deploy

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/permitpeek.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to vercel.com/new
2. Import the GitHub repo
3. Click Deploy (use defaults)
4. Wait ~2 minutes for first deploy

### 3. Add environment variables in Vercel
Settings → Environment Variables:
- `STRIPE_SECRET_KEY` = your Stripe secret key (sk_test_... or sk_live_...)
- `RESEND_API_KEY` = your Resend API key (re_...)
- `NEXT_PUBLIC_BASE_URL` = `https://yourdomain.com`

Then trigger a redeploy.

### 4. Connect domain
Settings → Domains → add yourdomain.com, configure DNS at your registrar.

### 5. Submit to Google
- search.google.com/search-console
- Add property → verify → submit `sitemap.xml`

## Adding More Cities

Edit `src/lib/cities.ts`. Add an entry to `CITIES`:

```typescript
"san-diego": {
  name: "San Diego",
  slug: "san-diego",
  state: "CA",
  stateSlug: "california",
  endpoint: "https://data.sandiego.gov/resource/XXXX-XXXX.json",
  addressField: "...",
  streetField: "...",
  typeField: "...",
  dateField: "...",
  statusField: "...",
  valueField: "...",
  descField: "...",
},
```

Find a city's Socrata dataset URL by going to their open data portal (usually `data.[cityname].gov`) and locating the building permits dataset. Click the API tab to see field names.

Once added: home page dropdown, sitemap, city landing page all update automatically.

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in your dev keys (or leave placeholders for mock mode)
npm run dev
```

Visit http://localhost:3000.

## Status of Integrations

- ✅ Permit search via Socrata APIs — fully working with real data
- ✅ Risk analysis engine — fully working
- ✅ Stripe checkout — wired up; works in dev mode without key (returns mock URL); requires real key in prod
- ✅ Resend email — wired up; logs to console in dev without key; requires real key in prod
- ✅ SEO infrastructure — sitemap.xml, robots.ts, JSON-LD, generateStaticParams all working
- ⚠️ Stripe webhook for fulfillment — not implemented (uses success URL params for now)
- ⚠️ PDF generation for paid reports — not implemented
- ⚠️ Watch subscription ($19/mo) — UI exists, no Stripe Subscription wired yet

## Production Hardening Checklist (post-launch)

- [ ] Add Stripe webhook handler at `/api/webhooks/stripe` to verify payments before unlock
- [ ] Add PDF generation for paid reports
- [ ] Wire up $19/mo subscription via Stripe Checkout in subscription mode
- [ ] Add Google Analytics 4 (set NEXT_PUBLIC_GA_ID env var)
- [ ] Add rate limiting on /api/permits to prevent abuse
- [ ] Expand city coverage (target: 50+ cities by month 3)
