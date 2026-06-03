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
| `/` | `src/routes/index.tsx` |
| `/misiunea-sociala` | `src/routes/misiunea-sociala.tsx` |

## Contact

Toate CTA-urile principale deschid un modal cu:

- **Sună acum** → `tel:+40742652698`
- **Lasă un mesaj** → WhatsApp cu mesaj pre-completat în română

## SEO / share social

`head()` per rută: `robots`, Open Graph, Twitter Card, preload LCP doar pe ruta curentă. JSON-LD `Organization` în `__root.tsx`. `public/robots.txt` permite indexarea.

La deploy, setează în `.env.production`:

```bash
VITE_SITE_URL=https://domeniul-tau.ro
```

Astfel `og:image` și logo-ul din schema devin URL-uri absolute pentru Facebook/WhatsApp. Opțional: `link rel="canonical"` / `og:url` cu același domeniu.

## Build

```bash
npm run build
npm run preview
```
