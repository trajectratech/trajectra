# Codebase audit

## Architecture as found

```
src/
  app/                      Next.js 14 App Router
    layout.tsx              root: fonts, metadata, GA4
    (main)/                 route group: navbar + footer chrome
      page.tsx              homepage (all sections inline)
      privacy-policy/       static legal page
      terms-of-service/     static legal page
      tools/color-generator/ the one interactive tool
    api/send-email/         nodemailer → Zoho SMTP
    sitemap.ts
  components/               presentational pieces
  contents/*.json           all copy, as JSON
  navbar/  footer/  scroll-to-top/   top-level UI (outside components/)
public/                     images, icons, static manifest
```

**Stack:** Next.js 16.2.12 (App Router, Turbopack), React 19, TypeScript strict,
Tailwind 3.4, ESLint 9 flat config, deployed on Vercel. (Upgraded from Next
14.2.28 / React 18 / ESLint 8 on 2026-08-01.) No test framework, no CI, no component library, no
state management. For a five-page marketing site that is the right amount of
technology — the problems are in the details, not the architecture.

**What is genuinely good:** TypeScript strict is on and passes. Copy is
separated from components in `src/contents/*.json`, which is a real strength —
non-developers can edit the site's words without touching JSX. Security headers
were already configured. Tailwind tokens are centralised in one `tokens` object
rather than scattered hex values.

## Issues found, by severity

### Critical

**C1 — `/api/send-email` was an open mail relay.** The handler read `to`,
`subject`, `text` and `html` from the request body and passed them straight to
`sendMail`. Anyone could send arbitrary HTML email to any recipient, delivered
from `info@trajectra.com` over Trajectra's authenticated SMTP session. That is
phishing with genuine domain provenance, and enough volume gets the domain
blacklisted — which would break all company email, not just the website. There
was no rate limiting, no origin check, and no bot protection.
*Fixed:* the endpoint now accepts only the four form fields, fixes the recipient
and subject server-side, escapes all interpolated HTML, strips CR/LF to prevent
header injection, adds a honeypot, and throttles to 5 requests per IP per 10
minutes. → [route.ts](../src/app/api/send-email/route.ts)

**C2 — All structured data was unreadable.** Covered in
[01-site-name-fix.md](./01-site-name-fix.md). *Fixed.*

### High

**H1 — The homepage was dynamically rendered on every request.**
`generateMetadata` called `headers()` to build a base URL. Reading headers opts
the whole route out of static generation. The live site returned
`cache-control: private, no-cache, no-store, max-age=0` and `x-vercel-cache: MISS`
— the CDN was serving nothing, every visitor waited for a cold render.
*Fixed:* the origin comes from a constant; the build now reports `/` as
`○ (Static)`.

**H2 — Poppins was downloaded but never applied.** `globals.css` declared
`font-family: "Poppins", Arial, …` while `next/font` registers the face under a
hashed name (`__Poppins_9b9fd1`) exposed only via `--font-poppins`. The literal
`"Poppins"` matched nothing. The site fetched five WOFF2 files on every cold
load and rendered the whole page in **Arial**. All nine weights were requested;
only four are used anywhere in the codebase.
*Fixed:* `font-family: var(--font-poppins), …`, weights trimmed to 400–800.

**H3 — Two navbars after hydration.** `(main)/layout.tsx` rendered `<Navbar />`
via `dynamic(..., { ssr: false })` *and* `page.tsx` imported and rendered
`<Navbar />` directly. Server HTML had one; the client mounted two — two fixed
headers stacked, two `<nav>` landmarks, two sets of scroll listeners.
*Fixed:* one navbar, in the layout, server-rendered.

**H4 — Every image in `/public/assets` was a raster wrapped in SVG.** `custom.svg`
(708 KB), `partnership.svg` (728 KB), `mission/vision/values.svg` (56–108 KB)
were each a single base64-encoded JPEG inside an `<svg>` element. `next/image`
passes SVG through untouched, so **none of them could be optimised** — no
WebP/AVIF, no responsive `srcset`, and base64 inflated each by ~33%. The 708 KB
`custom.svg` was the LCP element, preloaded with `fetchPriority="high"`.
*Fixed:* extracted to real JPEGs and re-pointed. The hero now serves as a
**69 KB AVIF** at 1920px.

**H5 — Brand green failed WCAG contrast on every primary CTA.** `#34C759` on
white is **2.22:1**; AA requires 4.5:1. Every "Get a Free Consultation", "Let's
Talk" and "Start Your Project" button — the site's entire conversion path — was
below the threshold, as was all green body text on white.
*Fixed:* added `primary-accessible` (`#23863C`, same hue and saturation,
4.60:1). The original `#34C759` is retained for dark surfaces, where it measures
6.61:1 and passes.

### Medium

**M1 — `md:grid-cols-${columns}` in the services grid.** Tailwind resolves
classes by scanning source text; an interpolated class name never generates a
rule. The grid only worked because `AboutUsCards` happened to use the literal
`md:grid-cols-3` elsewhere — deleting that unrelated line would have silently
collapsed the services section to one column. *Fixed:* flat grid with static
classes, and the manual row-chunking and `<hr>` bookkeeping it required is gone.

**M2 — `sizes="100px"` on the full-viewport hero.** `next/image` used it to pick
a 100 px-wide source and stretch it across the screen. *Fixed:* `sizes="100vw"`.

**M3 — Footer links were invisible to crawlers.** `FooterLinks` was
`dynamic(..., { ssr: false })`, so the server HTML contained a footer with no
internal links. Its only job was to intercept clicks, call `scrollIntoView`,
then strip the hash back out of the URL — defeating deep links and ignoring
`prefers-reduced-motion`. *Fixed:* plain server-rendered `/#section` anchors,
with smooth scrolling handled by CSS.

**M4 — The navbar reached into other components' DOM.** A `useEffect` ran
`document.querySelectorAll('a[href^="#"]')`, attached click handlers to *every*
hash link on the page including the footer's, and called `preventDefault` on all
of them. It re-ran on every route change, and left a `console.log` in the
handler. *Fixed:* `IntersectionObserver` scroll-spy that observes sections and
touches nothing it does not own.

**M5 — Dark-mode media query on a light-only design.** `globals.css` flipped
`--background` to `#0a0a0a` under `prefers-color-scheme: dark` while every
section painted itself white — visitors on a dark-mode OS saw near-black gutters
framing a white page. Tailwind is configured `darkMode: ["class"]`, so no `dark:`
utility would ever have responded to that query anyway. *Fixed:* removed; a real
dark theme belongs in the redesign.

**M6 — `eslint.ignoreDuringBuilds: true`.** Hid the accumulated warnings. The
key no longer exists: Next 16 removed `next lint` and stopped running ESLint
during the build entirely. Linting is now `npm run lint` against
`eslint.config.mjs`, and enforcing it belongs in CI (item 34).

### Low / technical debt

- `src/contents/about.-us.json` — stray hyphen in the filename.
- `"compayName"` — typo in two content files, referenced from code.
- `src/navbar/`, `src/footer/`, `src/scroll-to-top/` sit beside `src/components/`
  with no rule distinguishing them. Consolidate under `src/components/`.
- `public/assets/partnership-one.jpg` (9.1 MB) and `custom-software.jpg` (2.8 MB)
  are referenced nowhere. `trajectra-full.svg` and `trajectra-semi-full.svg` are
  also unreferenced but are brand assets — left in place deliberately.
- `colorthief` and `chroma-js` are pulled into the shared bundle by the colour
  tool; that route is 20.6 KB of the 118 KB first load. Acceptable for now.
- No tests, no CI. See the roadmap.

## Recommended next steps

1. Turn on CI: `tsc --noEmit`, `npm run lint`, `next build` on every PR. This is
   now the only thing that enforces lint, since the build no longer does.
2. Add Playwright smoke tests for the contact form and the colour tool — the two
   places with real logic.
3. Move the rate-limiter to a shared store (Upstash) if the site ever runs on
   more than one instance; the in-memory map is per-instance.
4. Consolidate the three top-level UI folders into `src/components/`.
