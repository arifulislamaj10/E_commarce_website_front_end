# VelouraX — Storefront

Customer-facing storefront for the VelouraX premium e-commerce platform.
**Next.js 14 (App Router)** with server-side rendering, per spec §3.1.

## Stack
Next.js 14 · React 18 · Tailwind CSS · Zustand (cart) · SSR

## Setup
```bash
npm install
cp .env.local.example .env.local    # set NEXT_PUBLIC_API_URL to the backend API
npm run dev                         # http://localhost:3000
```
The backend API must be running first (default `http://localhost:5000/api`).

## Pages
- `/` — landing page: animated hero, trust bar, category showcase, featured + new-arrivals rails, promo banner, live testimonials, newsletter
- `/?category=<slug>` / `/?q=<search>` — filtered product listing
- `/products/[slug]` — product detail + reviews (read & submit)
- `/cart` · `/checkout` — guest-friendly cart & Cash-on-Delivery checkout
- `/order-success` · `/track` — confirmation & order tracking
- `/support` — Support Center (open ticket + track conversation)

## Environment (`.env.local.example`)
| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_HERO_VIDEO` | _(optional)_ hero background video, e.g. `/hero.mp4` in `public/` |
| `NEXT_PUBLIC_HERO_IMAGE` | _(optional)_ hero background image, e.g. `/hero.jpg` in `public/` |

If no hero media is set, an animated boutique-image hero renders by default.

## Brand (spec §2)
Matte Black `#111827` · Royal Gold `#D4AF37` · Emerald `#065F46` · Soft White `#F9FAFB` —
wired into Tailwind as `matte`, `gold`, `emerald.brand`, `soft`, `ink`.

## Scripts
- `npm run dev` — dev server
- `npm run build` — production build  ⚠️ stop `npm run dev` first (they share `.next/`)
- `npm start` — serve the production build
