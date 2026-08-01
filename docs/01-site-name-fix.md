# Priority 1 — Making Google display "Trajectra" instead of "trajectra.com"

## The short version

The site had **zero machine-readable structured data**, and no `WebSite` entity
anywhere. Google's single most important site-name signal was not just weak — it
was completely absent. Everything else Google falls back on disagreed with
itself. With no confident answer available, Google did what its documentation
says it does in that situation: it showed the domain.

## Root cause

### 1. The JSON-LD was never parseable (critical)

`src/app/(main)/page.tsx` built a large schema graph and shipped it through
Next's `metadata.other`:

```ts
other: {
  "application/ld+json": JSON.stringify(jsonLd),
}
```

`metadata.other` emits `<meta name="…" content="…">`. So the live homepage
contained:

```html
<meta name="application/ld+json" content="{&quot;@context&quot;:&quot;https://schema.org&quot;…" />
```

Google — and every other consumer — only reads JSON-LD from
`<script type="application/ld+json">`. A `<meta>` tag with that name means
nothing to any parser. The payload was ~6 KB of markup on every page load that
no search engine has ever read.

*Verified on the live site before the change:* `grep -c 'name="application/ld+json"'` → 1,
`grep -c '<script type="application/ld+json"'` → 0.

### 2. There was no `WebSite` entity at all

Even if the payload had been parseable, the graph contained only
`Organization`, `LocalBusiness` and `VideoObject`. Google's site-name
documentation names `WebSite` structured data as "most important, if you want to
specify a preference". Nothing in the graph declared a site name.

### 3. Every fallback signal disagreed

Google's next signals are `og:site_name`, `<title>`, headings, and other on-page
text. They said four different things:

| Signal | Value before |
|---|---|
| `<title>` | `Global Custom Software & Tech Training \| Trajectra Technologies` |
| `og:site_name` | `Trajectra Technologies` |
| Homepage `h1` | `Custom Software, Training & Consulting for Growth` (no brand) |
| Logo `alt` | `Trajectra Technologies Logo` |
| Booking domain | `trajectratech.youcanbook.me` |
| Manifest `name` | `""` (empty string, and never linked from the HTML) |

The brand was buried behind keywords in the title, appeared in two different
forms, and never appeared in a heading at all. The most consistently repeated
brand token on the page was the domain in the URL bar. Google generated
accordingly.

## What was changed

Every signal now derives from one constant, `SITE_NAME` in
[src/lib/site.ts](../src/lib/site.ts), so they cannot drift apart again.

| Change | File | Why it matters |
|---|---|---|
| JSON-LD emitted as a real `<script type="application/ld+json">` | [src/components/seo/json-ld.tsx](../src/components/seo/json-ld.tsx) | Without this, nothing else in this table can be read. This is the fix. |
| Added a `WebSite` node with `name: "Trajectra"` | [src/lib/structured-data.ts](../src/lib/structured-data.ts) | The signal Google weighs above all others. |
| `alternateName: ["Trajectra Technologies", "trajectra.com"]` | same | Tells Google the legal name and the domain are *alternatives*, not the primary name. Google explicitly recommends listing the domain this way when it has been displaying it. |
| `WebSite` emitted on the homepage only | [src/app/(main)/page.tsx](<../src/app/(main)/page.tsx>) | Google requires it at the domain root URI. Sub-pages get `WebPage` + `BreadcrumbList` instead. |
| `og:site_name` changed to `Trajectra` | [src/app/layout.tsx](../src/app/layout.tsx) | Now byte-identical to `WebSite.name`. It previously offered a competing variant. |
| Homepage `<title>` kept as specified | same | `Global Custom Software & Tech Training \| Trajectra Technologies`. Keyword-led is fine here — see below. |
| Site-wide title template `%s \| Trajectra` | same | Every sub-page repeats the exact brand token. Consistency is what raises Google's confidence. |
| A single brand-led `h1` on the homepage | [src/app/(main)/page.tsx](<../src/app/(main)/page.tsx>) | There were zero brand mentions in any heading. Headings are an explicit site-name signal. |
| Logo `alt` is now `Trajectra` | navbar + footer | "Logo" is redundant to a screen reader, and this puts the exact name in two more places. |
| `manifest.webmanifest` generated with real `name`/`short_name` | [src/app/manifest.ts](../src/app/manifest.ts) | The old `public/site.webmanifest` had empty names *and no `<link rel="manifest">` pointing at it*. |
| `sameAs` now lists the real, live profile URLs | [src/lib/site.ts](../src/lib/site.ts) | Was `twitter.com/trajectra` while the footer linked `x.com/trajectra`; TikTok was missing entirely. `sameAs` is how Google resolves the site to the real-world entity — broken links weaken that. |

## Site name vs. title tag

These are two different fields and it is worth being precise about the
difference, because conflating them is how the original problem arose.

```
┌─────────────────────────────────────────────────────────┐
│ Trajectra                        ← site name            │
│ https://www.trajectra.com                               │
│                                                         │
│ Global Custom Software & Tech Training |                │  ← <title>
│ Trajectra Technologies                                  │
│                                                         │
│ Trajectra builds custom software, trains engineering…   │  ← description
└─────────────────────────────────────────────────────────┘
```

| | Site name | Title tag |
|---|---|---|
| Source | `WebSite.name`, `og:site_name` | `<title>` |
| Scope | One per domain | One per page |
| Google's constraint | Must be short and brand-like. Long or keyword-stuffed values are rejected and Google falls back to the domain. | No such constraint; ~60 chars before truncation |
| Current value | `Trajectra` | `Global Custom Software & Tech Training \| Trajectra Technologies` |

**Why the title can stay keyword-led.** The title is a *supporting* site-name
signal, not the primary one — `WebSite.name` outranks it. As long as the brand
appears in the title (it does, at the end), a keyword-led title does not fight
the structured data. It is also the string the site already ranked with, so
there is no reason to churn it.

**Why the site name cannot be the same string.** Putting
`Global Custom Software & Tech Training | Trajectra Technologies` into
`WebSite.name` would almost certainly reproduce the original bug: Google would
reject it as not-a-name and fall back to `trajectra.com`.

The two constants are deliberately kept separate in
[src/lib/site.ts](../src/lib/site.ts) — `SITE_NAME` and `HOME_TITLE` — with a
comment saying not to merge them.

## Two things removed on policy grounds

**Fabricated `aggregateRating`.** The `LocalBusiness` node declared
`ratingValue: "4.9"`, `reviewCount: "25"` with no reviews anywhere on the site
and no review source. Google's review snippet policy prohibits self-serving and
unverifiable ratings; this risks a structured-data manual action, which would
suppress *all* rich results for the domain. Removed. Re-add only when real,
publicly visible reviews exist on the page.

**Fabricated `VideoObject`.** It claimed `uploadDate: "2023-01-01"`, used the
company logo as a video thumbnail, and set `embedUrl` to a channel URL rather
than a video. It describes no actual video and would fail the Rich Results Test.
Removed.

Both were also actively harmful to the site-name goal: invalid or policy-
violating markup in the graph reduces Google's trust in everything else in it.

## Verification

Rendered HTML from the production build:

```
<title>Trajectra — Custom Software Development, Training & IT Consulting</title>
<meta property="og:site_name" content="Trajectra"/>
<link rel="manifest" href="/manifest.webmanifest"/>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
  {"@type":"WebSite","@id":"https://www.trajectra.com/#website",
   "name":"Trajectra",
   "alternateName":["Trajectra Technologies","trajectra.com"],
   "url":"https://www.trajectra.com/", …
```

Lighthouse SEO: **100**.

## What to do after deploying

1. **Validate** at [Rich Results Test](https://search.google.com/test/rich-results)
   and [validator.schema.org](https://validator.schema.org) — paste
   `https://www.trajectra.com/`. Expect `WebSite`, `Organization` and
   `ProfessionalService` to parse with no errors.
2. **Request indexing** in Search Console → URL Inspection → `https://www.trajectra.com/`
   → Request Indexing. This is the homepage; it is the only URL that matters
   for the site name.
3. **Wait.** Google's docs say "several days to several weeks" after recrawl.
   There is no way to force it, and no legitimate way to speed it up.
4. **Strengthen the off-site signal in parallel.** Google also weighs "references
   to it that appear on the web". Every profile in `sameAs` should use
   *Trajectra* as its display name, and the LinkedIn company page in particular
   carries weight. If profiles say "Trajectra Technologies" while the site says
   "Trajectra", that disagreement persists off-site.

## If Google still shows the domain in ~6 weeks

Google's documented last resort is to accept it: set `name` to the domain and
move the brand to `alternateName`. Do **not** do that yet — the site has only
just been given a valid first signal, and the entity is young. Re-check that the
profiles in `sameAs` are all live and all say "Trajectra" first.
