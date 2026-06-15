# Autorulota Bluey — Production Marketing Website

Production-ready marketing website developed for a real camper van rental business in Romania.

The project was designed to solve two business goals simultaneously:

1. Increase rental inquiries through a conversion-focused user experience.
2. Communicate the company's social mission, where 90% of profits support free educational trips for rural students in Mureș County.

This project demonstrates frontend engineering skills including React architecture, SEO optimization, accessibility, responsive design, performance optimization, content-driven architecture and production deployment.

**Live Website:** https://www.autorulotabluey.ro

---

## Project Overview

### Business Challenge

The client needed more than a simple brochure website.

The platform had to:

* Present rental information clearly
* Encourage direct customer inquiries
* Build trust through transparent pricing
* Communicate social impact
* Perform well on mobile devices
* Be easy to maintain without modifying UI components

### Solution

A conversion-oriented marketing website built with React and TypeScript featuring:

* Centralized content management
* SEO-focused architecture
* Responsive user experience
* Direct contact flow via phone and WhatsApp
* Social mission storytelling

**Note:** The website does not include an online booking system. All rental inquiries and reservations are handled directly through phone calls or WhatsApp conversations.

---

## Key Features

### Conversion Optimization

* Sticky mobile contact CTA
* WhatsApp inquiry integration
* One-click phone contact
* Pre-filled WhatsApp messages
* Strategic call-to-action placement
* Clear contact pathways throughout the website

### SEO & Discoverability

* Route-specific meta tags
* Canonical URLs
* Open Graph support
* Twitter Cards
* JSON-LD structured data
* XML sitemap
* robots.txt configuration
* LCP image optimization

### Accessibility

* Semantic HTML structure
* Keyboard navigation support
* Skip-to-content links
* Focus-visible states
* Accessible navigation patterns

### Performance

* Manual Vite chunk splitting
* Optimized image loading
* Route-based code organization
* Production analytics integration

### Maintainability

* Single source of truth for rental content
* Typed route generation
* Reusable component architecture
* Centralized SEO configuration

---

## Tech Stack

| Category   | Technology       |
| ---------- | ---------------- |
| Frontend   | React 19         |
| Language   | TypeScript       |
| Build Tool | Vite             |
| Routing    | TanStack Router  |
| Styling    | Tailwind CSS v4  |
| Icons      | Lucide React     |
| Analytics  | Vercel Analytics |
| Hosting    | Vercel           |

---

## Architecture Highlights

### Content-Driven Architecture

Business content is centralized inside:

`src/data/`

This allows pricing, amenities, rental conditions and marketing copy to be updated without modifying UI components.

### Typed Routing

TanStack Router generates a strongly typed route tree, improving maintainability and navigation safety.

### SEO Layer

Dedicated SEO utilities provide:

* Metadata generation
* Structured data
* Canonical URLs
* Social sharing previews

---

## Project Structure

```text
src/
├── routes/
├── components/
├── data/
├── context/
├── lib/
├── hooks/
└── types/
```

---

## What This Project Demonstrates

This project showcases practical frontend engineering skills:

* React Component Architecture
* TypeScript Type Safety
* SEO Implementation
* Responsive Design
* Accessibility Standards
* Performance Optimization
* Production Deployment
* Business-Oriented UI Design
* Maintainable Code Structure
* Real Client Project Delivery

---

## Local Development

### Installation

```bash
git clone <repository-url>
cd bluey-camper-projekt
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

### Environment Variables

```env
VITE_SITE_URL=https://www.autorulotabluey.ro
```

---

## Author

Cristian Alin Ana

Frontend Developer

Portfolio:
https://www.cristian-ana.dev

GitHub:
https://github.com/Criistiian7

LinkedIn:
https://www.linkedin.com/in/cristian-alin-ana-05401285

---

## Lessons Learned

While building this project I gained practical experience with:

* Production React architecture
* SEO implementation in SPAs
* Conversion-focused UI design
* Type-safe routing
* Frontend performance optimization
* Accessibility best practices
* Deploying and maintaining a real-world business website
* Designing effective contact funnels without relying on online booking systems
