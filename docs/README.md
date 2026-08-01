# Trajectra — audit and strategy

Full audit of the codebase, SEO, accessibility, performance, brand, product and
growth, plus the fixes implemented in this branch.

## Documents

| | Document | Contents |
|---|---|---|
| 01 | [Site name fix](./01-site-name-fix.md) | **Priority 1.** Why Google showed `trajectra.com`, and every change made |
| 02 | [Codebase audit](./02-codebase-audit.md) | Architecture, defects by severity, technical debt |
| 03 | [SEO audit](./03-seo-audit.md) | Technical findings, missing pages, keyword strategy, off-site |
| 04 | [Accessibility audit](./04-accessibility-audit.md) | WCAG 2.2 AA, every issue with severity, measured contrast |
| 05 | [Performance audit](./05-performance-audit.md) | Lighthouse, Core Web Vitals, what was slow and why |
| 06 | [UI/UX recommendations](./06-ui-ux-recommendations.md) | Friction points, proposed homepage, design system |
| 07 | [Brand strategy](./07-brand-strategy.md) | Positioning, messaging, international trust |
| 08 | [Product strategy](./08-product-strategy.md) | Ranked opportunities, and what not to build |
| 09 | [Growth strategy](./09-growth-strategy.md) | Acquisition, pricing, packaging, metrics |
| 10 | [Roadmap](./10-roadmap.md) | Quick wins → medium term → long term |
| 12 | [Rebrand](./12-rebrand.md) | Design system, home page rebuild, what must not ship unverified |

## The three things that mattered most

**1. All structured data was invisible to Google.** The JSON-LD graph went out
as `<meta name="application/ld+json" content="…">`. No parser reads that. The
site had *zero* machine-readable structured data, and no `WebSite` entity — so
Google's primary site-name signal was absent, and every fallback signal
contradicted the others. That is the whole answer to Priority 1.

**2. `/api/send-email` was an open mail relay.** It took the recipient, subject
and raw HTML body from the request. Anyone could send arbitrary email from
`info@trajectra.com` through Trajectra's authenticated SMTP. Unrelated to the
brief, more urgent than any of it.

**3. Every image in `/public/assets` was a base64 JPEG inside an SVG wrapper.**
`next/image` cannot optimise SVG, so the 708 KB hero — the LCP element — was
served raw. It is now a 69 KB AVIF.

## Results

| | Before | After |
|---|---|---|
| Structured data readable by Google | No | Yes |
| `WebSite` entity | Absent | Present, `name: "Trajectra"` |
| Homepage rendering | Dynamic, uncached | Static, edge-cacheable |
| Hero image (LCP) | 708 KB, unoptimisable | 69 KB AVIF |
| `public/assets` total | 20.3 MB | 2.0 MB |
| Web font | Downloaded, never applied | Applied, 5 weights |
| Primary CTA contrast | 2.22:1 (fails AA) | 4.60:1 (passes AA) |
| Mail endpoint | Open relay | Locked down, rate-limited |
| Lighthouse mobile | — | **100 / 100 / 100 / 100** |
| Lighthouse desktop | — | **90 / 100 / 100 / 100** |

## Scope note

Everything in documents 01–05 is **implemented**. Everything in 06–09 is
**recommendation only** — redesign, positioning and product decisions are yours
to approve before anyone writes code. [Document 10](./10-roadmap.md) sequences
both, and ends with the four decisions that need you.
