# Bluey Feature Implementation Plan

**Status:** Implemented (Phases 1–5).  
**IA decision:** Hero highlights + pricing teaser on Home; full booking details on `/rezervare`.

---

## Executive Summary

The Bluey Camper site is a React SPA (Vite, TanStack Router, Tailwind v4) evolved from mission-only storytelling to a **dual-intent site**: rental conversion + Travel & Educate credibility.

- **Home (`/`)**: Hero highlights, pricing teaser, amenities preview, booking CTAs
- **`/rezervare`**: Tarife, reduceri, paturi, dotări, taxe, condiții
- **Data layer**: `src/data/booking.ts` — single source of truth for rental copy
- **Contact**: WhatsApp prefill with `booking` vs `mission` intent

---

## Business Content (source of truth: `src/data/booking.ts`)

### Hero highlights

De la 90 €/noapte · 5 locuri · 5 paturi · Model 2026 · Fiat Ducato · Aer condiționat · Panouri solare

### Tarife

| Sezon | Preț | Perioadă |
|-------|------|----------|
| Extrasezon | 90 €/noapte | Ianuarie, Februarie, Noiembrie |
| Intermediar | 110 €/noapte | 1 Martie – 14 Iunie; Octombrie; Decembrie (except sărbători) |
| Vârf | 140 €/noapte | 15 Iunie – 15 Septembrie |

### Reduceri

- 10 nopți → 1 noapte gratuită
- 20 nopți → 2 nopți gratuite

### Paturi

- Dormitor principal: 140×190 cm, 2 persoane
- Pat alcovă: 146×220 cm, 2 persoane
- Pat living: 107×220 cm, 1 persoană

### Taxe

- Garanție returnabilă: 500 €
- Taxă consumabile și igienizare: 50 €/sejur

### Condiții

- Avans 50% la rezervare
- Rest 50% cu min. 3 zile înainte de plecare
- Min. 5 zile în sezon / min. 3 zile extrasezon
- Garanție restituită în max. 3 zile fără daune

---

## Implemented File Map

### New

- `src/data/booking.ts`
- `src/routes/rezervare.tsx`
- `src/lib/bookingJsonLd.ts`
- `src/components/home/PricingTeaserSection.tsx`
- `src/components/home/AmenitiesPreviewSection.tsx`
- `src/components/home/BookingCtaSection.tsx`
- `src/components/rezervare/*.tsx` (PricingCard, sections, hero, CTA)
- `src/components/MobileBookingBar.tsx`
- `public/sitemap.xml`

### Changed

- `HeroSection`, `FeaturesGrid`, `GallerySection`, `PageShell`
- `ContactButton`, `ContactModal`, `ContactModalContext`
- `site.ts`, `navigation.ts`, `images.ts`, `seoHead.ts`
- `routes/index.tsx`, `routeTree.gen.ts`
- `README.md`, `public/robots.txt`, `public/images/README.md`

---

## Phase Checklist

1. [x] `booking.ts` with structured content
2. [x] Hero highlights + dual CTA
3. [x] Pricing teaser on Home
4. [x] Contact layer — booking WhatsApp + labels
5. [x] Nav link „Rezervare”
6. [x] `/rezervare` route + sections
7. [x] Booking CTA band on Home
8. [x] FeaturesGrid rental copy
9. [x] MobileBookingBar
10. [x] Gallery click-to-load Facebook reel
11. [x] Interior photo slots (placeholders)
12. [x] JSON-LD Offer on `/rezervare`
13. [x] Sitemap + canonical URLs
14. [x] Home LCP preload only; gallery lazy

---

## Maintenance

**Pricing or copy changes:** edit `src/data/booking.ts` only.

**New interior photos:** add JPGs to `public/images/`, update `src/data/images.ts`.

**Deploy:** set `VITE_SITE_URL` on Vercel for absolute OG/canonical/sitemap URLs.

**QA:** mobile 320px, WhatsApp booking flow, Lighthouse on Home + `/rezervare`.
