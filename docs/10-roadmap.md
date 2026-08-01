# Implementation roadmap

Ranked by impact per unit of effort. Items marked **✅ Done** are implemented in
this branch and need review, not work.

---

## Quick wins

### ✅ Shipped in this branch

| # | Change | Impact |
|---|---|---|
| 1 | JSON-LD emitted as `<script>` instead of `<meta>` | Site name — the fix |
| 2 | `WebSite` schema with `name: "Trajectra"` + `alternateName` | Site name |
| 3 | Brand-led titles, `og:site_name`, manifest, logo alt all unified | Site name |
| 4 | Removed fabricated `aggregateRating` and `VideoObject` | Avoids a manual action |
| 5 | Closed the open mail relay in `/api/send-email` | Security — critical |
| 6 | Homepage restored to static rendering | TTFB / LCP |
| 7 | SVG-wrapped rasters → real images; 20.3 MB → 2.0 MB | LCP: 708 KB → 69 KB |
| 8 | `sizes="100px"` → `100vw` on the hero | Image quality + weight |
| 9 | Poppins actually applied; 9 weights → 5 | Typography + ~70 KB |
| 10 | Accessible green token; every CTA now passes AA | Legal + conversion |
| 11 | Keyboard-operable dropdown, skip link, focus indicators | A11y blockers |
| 12 | Carousel: pausable, reduced-motion aware, keyboard operable | WCAG 2.2.2 |
| 13 | Duplicate navbar removed; `<main>` added; heading order fixed | A11y + SEO |
| 14 | Form: `aria-invalid`, `aria-describedby`, focus-on-error, phone optional | A11y + conversion |
| 15 | Sitemap honesty, `robots.ts`, canonicals, breadcrumbs, `metadataBase` | SEO hygiene |
| 16 | AVIF/WebP, 1-year cache headers, HSTS | Performance |

Result: Lighthouse **97/100/100/100** mobile, **90/100/100/100** desktop.

### Next — hours, not days

| # | Task | Why now |
|---|---|---|
| 17 | Deploy, then validate in Rich Results Test and request indexing | The site-name fix does nothing until Google sees it |
| 18 | **Add GA4 conversion events** on every booking link and the form | The conversion rate is currently unmeasurable |
| 19 | Set up Search Console (both hosts) + Bing Webmaster Tools | Watch the Site names report |
| 20 | Rename social profiles to display "Trajectra" | Off-site half of the site-name signal |
| 21 | Create and verify a Google Business Profile | Local pack + knowledge panel |
| ✅ 22 | Deleted `partnership-one.jpg`, `custom-software.jpg`, `icons/tiktok.svg` — unreferenced, 11.9 MB | Done |
| 23 | Move booking to `trajectra.com/book` | Brand equity at the moment of decision |

---

## Medium term — 1 to 3 months

**Trust assets (do these before any traffic spend):**

| # | Task |
|---|---|
| 24 | `/about` with real names, faces, roles, CAC number, founding year, timezone |
| 25 | 3–5 case studies at `/work` with a measurable outcome in each |
| 26 | `/how-we-work` — engagement models, timelines, contract/IP terms. **No published figures** (your call, 2026-08-01) |
| 27 | Homepage rebuild per [06-ui-ux-recommendations.md](./06-ui-ux-recommendations.md) — static hero, proof band, offer cards |
| 28 | Rewrite all service copy to the *what / who / how long / how much* pattern |

**SEO surface:**

| # | Task |
|---|---|
| 29 | Six service pages at `/services/<slug>` with `Service` schema |
| 30 | `/contact` as a real page |
| 31 | FAQ section with `FAQPage` schema |
| 32 | The five decision-intent posts from the SEO audit |
| 33 | Expand `/tools/color-generator`: `SoftwareApplication` schema, shareable permalinks, supporting copy |

**Engineering:**

| # | Task |
|---|---|
| 34 | CI: `tsc --noEmit` + `next lint` + `next build` on every PR |
| 35 | Then set `eslint.ignoreDuringBuilds: false` |
| 36 | Lighthouse CI with budgets (LCP < 2.5 s, CLS < 0.1, transfer < 1.2 MB) |
| 37 | Pre-commit hook rejecting `public/` files over 500 KB |
| 38 | Playwright smoke tests: contact form, colour tool |
| 39 | Manual screen-reader pass (VoiceOver/Safari, NVDA/Firefox) |
| 40 | Consolidate `src/navbar`, `src/footer`, `src/scroll-to-top` into `src/components/` |

**Business:**

| # | Task |
|---|---|
| 41 | Launch the productised offers — 5-day Audit, 10-week MVP Sprint (scope and duration public, price on the call) |
| 42 | Clutch profile + first real client reviews |
| 43 | Referral agreements with five complementary agencies |

---

## Long term — 3 to 12 months

| # | Initiative |
|---|---|
| 44 | Ship 4–6 more tools; `/tools/` becomes the link-acquisition engine |
| 45 | Publish an open-source library extracted from client work |
| 46 | Monthly deep technical posts from named engineers |
| 47 | Narrow outbound programme to one specific segment |
| 48 | Shift revenue mix toward retainers |
| 49 | Validate the vertical SaaS (P4) — **10 paid pre-orders before any code** |
| 50 | AI-assisted legacy assessment as an internal margin multiplier |
| 51 | `/hire/<role>` programmatic pages — *only after* Tier 1 pages are indexed |
| 52 | Design-system pass: collapse 9 near-grey tokens into a documented scale |
| 53 | Real dark mode via Tailwind's class strategy |
| 54 | Next.js 15 upgrade (drops legacy JS polyfills) |
| 55 | Consider `hreflang` / regional pages once there is traffic to segment |

---

## What to do first, if you only do one thing per stage

1. **This week:** deploy and request indexing. Nothing else affects the stated
   Priority 1 goal.
2. **This month:** publish `/about` with real faces. It is the largest single
   trust gap for an international buyer.
3. **This quarter:** three case studies with numbers in them.
4. **This year:** shift the revenue mix from projects to retainers.

## Decisions made

- **Site name** = `Trajectra` · **home `<title>`** =
  `Global Custom Software & Tech Training | Trajectra Technologies`
  (2026-08-01). These are two different fields; see
  [01-site-name-fix.md](./01-site-name-fix.md#site-name-vs-title-tag).
- **No published prices** (2026-08-01). Offers are sold on scope and duration;
  the figure is given on the call. Docs updated throughout.
- **Unreferenced assets deleted** (2026-08-01).

## Still open for you

- **Homepage redesign (27)** — sign off on the structure before I build it.
- **Dropping "computer networking" from the homepage** — a positioning call
  with revenue implications, and yours to make.
- **A budget-range question on the booking form** — the main lever left for
  filtering unqualified leads now that prices stay private.
