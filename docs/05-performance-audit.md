# Performance audit

## Measured results

Lighthouse 12, production build, homepage.

Updated after the Next 16.2.12 / React 19 upgrade and the Speed Index fix.

| | Mobile | Desktop |
|---|---|---|
| **Performance** | **100** | **90** |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 0.9 s | 1.3 s |
| Largest Contentful Paint | 2.6 s | 1.3 s |
| Total Blocking Time | 10 ms | 0 ms |
| Cumulative Layout Shift | **0** | 0.001 |
| Server response | — | 20 ms |

All three Core Web Vitals are in the "good" band. Note these are local-network
numbers; real-field data will differ, and CrUX is the number that actually
affects ranking. Watch it in Search Console once traffic exists.

## What was wrong

### 1. Unoptimisable images (the big one)

Every file in `public/assets` with an `.svg` extension was a single base64-
encoded JPEG inside an `<svg>` wrapper:

| File | Size | Actual content |
|---|---|---|
| `partnership.svg` | 728 KB | 2880×1920 JPEG, base64 |
| `custom.svg` | 708 KB | 2880×1845 JPEG, base64 — **and the LCP element** |
| `values.svg` | 108 KB | 741×494 JPEG, base64 |
| `mission.svg` | 100 KB | 741×494 JPEG, base64 |
| `vision.svg` | 56 KB | 741×494 JPEG, base64 |

`next/image` passes SVG through untouched by design. So none of these could be
converted to WebP or AVIF, none got a responsive `srcset`, and base64 inflated
each payload by ~33%. The 708 KB `custom.svg` was preloaded with
`fetchPriority="high"` as the hero — the single heaviest resource on the page
was also the one blocking LCP, and it was in the one format the optimiser
cannot touch.

**Fixed:** extracted the embedded JPEGs, re-pointed the content JSON, deleted
the wrappers. The hero now negotiates to **69 KB AVIF** at 1920 px — a **90%**
reduction on that one request.

### 2. `sizes="100px"` on a full-viewport hero

`next/image` uses `sizes` to choose from the `srcset`. Declaring `100px` for an
element that fills the screen made it select a 100 px-wide source and stretch it
across the viewport. The hero was rendering from a thumbnail. **Fixed:**
`sizes="100vw"`.

### 3. Source images 2–4× larger than any device can use

`training.jpg` was 6000×4000 (2.8 MB); `consulting.jpg` 5418×3612 (4.6 MB).
Next caps at 3840 px, so every pixel beyond that was pure deploy weight and CPU
cost on first optimisation. **Fixed:** downscaled to ≤2560 px at q78.

Total `public/assets` payload: **20.3 MB → 2.0 MB.**

### 4. The web font was downloaded and then ignored

`globals.css` asked for `font-family: "Poppins"`. `next/font` registers the face
as `__Poppins_9b9fd1` and exposes it only through `--font-poppins`. The literal
name matched nothing, so the browser fetched five WOFF2 files and rendered the
page in **Arial**. All nine weights were requested; four are used.

**Fixed:** `font-family: var(--font-poppins), …`, weights trimmed to 400–800
(~70 KB saved), plus `adjustFontFallback` to cut the swap-in layout shift.

### 5. The homepage was never cached

`generateMetadata` called `headers()`, which opts a route out of static
rendering. The live site returned `cache-control: private, no-cache, no-store,
max-age=0, must-revalidate` with `x-vercel-cache: MISS` — the CDN was serving
nothing. Every visitor in every region paid a full origin round-trip.

**Fixed:** the build now reports `/` as `○ (Static)`. Server response measured
at 20 ms locally; on Vercel this becomes an edge cache hit.

### 6. Below-the-fold images marked `priority`

All three About cards and the footer logo carried `priority`, injecting
`<link rel="preload" fetchPriority="high">` for resources nobody sees on load —
competing directly with the hero for the first bytes of bandwidth.
**Fixed:** removed; hero slide 0 is the only priority image.

### 7. `next/dynamic` used where it did nothing but add cost

`Footer`, `Services`, `AboutUsCards` and `ScrollToTopButton` were wrapped with
`{ ssr: true }` — extra chunks and an extra request waterfall for components
with no client JS. `Navbar` and `ContactUsFormWrapper` used `{ ssr: false }`,
which removed the header and the entire contact form from the server HTML.
**Fixed:** all direct imports.

### 8. Caching and format headers

**Fixed:** `formats: ["image/avif", "image/webp"]`, `minimumCacheTTL` raised
from 60 s to one year, and `Cache-Control: public, max-age=31536000, immutable`
on static media. Also removed a duplicated `X-Content-Type-Options` header and
added `Strict-Transport-Security` at the app level so the guarantee survives a
host change.

## Remaining opportunities

| Opportunity | Saving | Recommendation |
|---|---|---|
| GA4 gtag.js unused JS | ~68 KB | Real, but TBT is already 0–10 ms so it is not hurting anything measurable. Switching to `strategy="lazyOnload"` reclaims it at the cost of undercounting fast bounces. **Not worth it yet** — revisit if TBT regresses. |
| Render-blocking CSS | ~117 ms | Inherent to Next's single stylesheet. Not worth fighting. |
| Legacy JS polyfills | ~13 KB | **Not fixable, and my earlier claim that the Next upgrade would resolve it was wrong.** Next ships a polyfill chunk unconditionally, but gates it with `noModule`, so modern browsers never download or execute it. Lighthouse flags it regardless. Verified still present on Next 16.2.12. Ignore it. |
| Carousel loads 4 hero images | ~200 KB | The real fix is replacing the carousel with a static hero — one image instead of four. See the UI/UX report; this is a design decision, not a technical one. |
| `colorthief` + `chroma-js` | 20.6 KB on `/tools/*` | Route-scoped already. Fine. |

## Guardrails to add

The regressions above were all invisible because nothing measured them.

1. **Lighthouse CI** on pull requests with budgets: LCP < 2.5 s, CLS < 0.1,
   TBT < 200 ms, and a total transfer budget of 1.2 MB.
2. **`@next/bundle-analyzer`** wired to an npm script.
3. **A pre-commit check** rejecting any file in `public/` over 500 KB. Every
   large-asset problem in this audit would have been caught at authoring time.
4. **Vercel Speed Insights** for real CrUX field data — the only numbers Google
   ranks on.
