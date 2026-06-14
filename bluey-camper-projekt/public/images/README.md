# Imagini site

**6 JPG** + **`bluey-logo.png`** (header, footer, favicon). Fiecare e referit în cod.

| Fișier | Unde apare |
|--------|------------|
| `bluey-poiana.jpg` | Hero Home, og:image Home |
| `bluey-pajiste.jpg` | Hero Misiune, galerie, og:image Misiune |
| `bluey-manastire.jpg` | ImpactBand, galerie, secțiune comune |
| `bluey-copertina.jpg` | Hero `/rezervare`, og:image Rezervare, paturi (placeholder), galerie |
| `bluey-brand-telefon.jpg` | Galerie, pat alcovă (placeholder) |
| `bluey-peisaj.jpg` | Galerie, pat living (placeholder), secțiune comune |
| `bluey-logo.png` | Logo site, favicon, JSON-LD |

`bluey-pajiste.jpg` apare de două ori în UI (hero + galerie), dar e **un singur fișier**.

## Fotografii interior (recomandat)

Secțiunea **Paturi** pe `/rezervare` folosește temporar poze existente ca placeholder. Pentru încredere maximă, adaugă 2–3 JPG dedicate:

- dormitor principal
- pat alcovă
- pat living / zonă zi

Actualizează căile în `src/data/images.ts` (`interiorDormitor`, `interiorAlcova`, `interiorLiving`).
