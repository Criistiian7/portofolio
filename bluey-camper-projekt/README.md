# Autorulota Bluey — Travel & Educate

Site de prezentare pentru **Autorulota Bluey**: React, TypeScript, Vite, TanStack Router (file-based) și Tailwind CSS v4.

## Pornire locală

```bash
cd bluey-camper-projekt
npm install
npm run dev
```

## Imagini obligatorii

Copiază cele **6 fotografii reale** în `public/images/` (vezi `public/images/README.md` pentru denumiri). Fără ele, hero-ul și galeria vor afișa imagini lipsă în dev.

## Rute

| Rută | Fișier |
|------|--------|
| `/` | `src/routes/index.tsx` — hero, tarife teaser, dotări preview, misiune |
| `/rezervare` | `src/routes/rezervare.tsx` — tarife, paturi, dotări, condiții |
| `/misiunea-sociala` | `src/routes/misiunea-sociala.tsx` |

## Conținut rezervare

Toate tarifele, dotările, paturile și condițiile sunt în **`src/data/booking.ts`**. La modificări de preț sau sezon, actualizează doar acest fișier.

Plan de implementare detaliat: [`docs/bluey-feature-implementation-plan.md`](docs/bluey-feature-implementation-plan.md).

## Contact

CTA-urile de rezervare deschid modal cu intent `booking`:

- **Sună acum** → `tel:+40742652698`
- **Rezervă pe WhatsApp** → mesaj pre-completat cu placeholder pentru date

CTA-urile generice (header) folosesc intent `mission`.

## SEO / share social

`head()` per rută: `robots`, canonical, Open Graph, Twitter Card, preload LCP doar pe Home. JSON-LD `Organization` în `__root.tsx`; JSON-LD `Product`/`Offer` pe `/rezervare`. `public/sitemap.xml` și `public/robots.txt`.

La deploy, setează în `.env.production`:

```bash
VITE_SITE_URL=https://domeniul-tau.ro
```

Astfel `og:image`, canonical și schema devin URL-uri absolute.

## Build

```bash
npm run build
npm run preview
```
