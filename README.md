# Splendor Sandbox

A small Next.js site built around [Splendor](https://splendordesign.com/), the Red Bank, NJ creative agency — put together as a working sample of how I build front ends, rather than a slide deck about it.

The homepage opens with the Splendor wordmark drawing itself in over a video hero, moves into a scroll-driven wireframe sphere carrying the agency's "look first, then create" positioning, lays out the four service lines, and ends in a coverflow rail of case studies. Each case study has its own page, and `/work` is a client-side filterable index fed by the app's own JSON API.

> **Not affiliated with Splendor.** Case study headlines, service lines and agency facts are referenced from their public site; all supporting copy was written for this demo, and no client results are claimed.

## What's here

- **Homepage** — a full-bleed video hero where "SPLENDOR" is drawn stroke-first from real Karla ExtraBold glyph outlines and undraws again as you scroll; an approach section where a wireframe sphere draws itself in, slides across and unravels as the text around it crossfades; a services grid that staggers in on intersection; and an auto-advancing coverflow of case studies.
- **Work index** (`/work`) — fetched in the browser from `/api/work` and filtered by discipline, with skeleton loading, an error state and a retry.
- **Case studies** (`/work/[slug]`) — all ten prerendered at build time via `generateStaticParams`, with `dynamicParams = false` so an unknown slug gets a real 404 instead of a not-found body served under a 200.
- **JSON API** (`/api/work`, `/api/work/[slug]`) — Route Handlers over the local content module, with `?limit=` validation and proper 400/404 responses.
- **Viewed counter** — tracks how many distinct case studies you've opened this visit, via context, shown as a badge on the homepage.
- **Lab** (`/lab/...`) — standalone animation experiments kept from building the homepage: a staggered shape grid, a 3D exploded-brick rocket, and the wireframe sphere on its own full-bleed page.

All of the scroll-driven animation is hand-rolled — a scroll listener drives a `[0, 1]` progress value applied directly as inline styles/SVG attributes each frame, respecting `prefers-reduced-motion` throughout.

## Brand notes

The palette and type are pulled from splendordesign.com rather than guessed at: the violet is their `#6e00bc`, paired with their deep teal as a near-black, and the typeface is [Karla](https://fonts.google.com/specimen/Karla) — the family they serve. The hero wordmark isn't a font rendering; the eight letterforms were extracted from Karla's variable font pinned at weight 800, so the draw-in follows actual glyph contours. Case study photography runs through a grayscale + multiply duotone so a rail of stock images reads as one branded set.

## Try the API

```bash
curl localhost:3000/api/work | jq '.[].client'
curl localhost:3000/api/work?limit=3
curl -i localhost:3000/api/work/sensient
curl -i localhost:3000/api/work/nope      # 404
curl -i "localhost:3000/api/work?limit=x" # 400
```

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – run ESLint

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4
- [anime.js](https://animejs.com/) — the wordmark intro/outro
- [GSAP](https://gsap.com/) — the services and case study reveals
- [react-three-fiber](https://r3f.docs.pmnd.rs/) / three.js — the lab's 3D brick animation

---

Built by [Alejandro Silva](https://silvadevelopment.com/portfolio) · [GitHub](https://github.com/alejsilvadev)
