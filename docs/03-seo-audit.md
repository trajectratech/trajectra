# Technical SEO audit

Goal: rank globally for software-services intent and convert remote clients.
Lighthouse SEO is now **100**, but that score only measures crawlability
hygiene. The real constraint is elsewhere — see "The honest assessment" at the
end.

## Technical findings

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | All JSON-LD emitted as `<meta>`, unreadable by any parser | Critical | Fixed |
| 2 | No `WebSite` entity → no site name signal | Critical | Fixed |
| 3 | Fabricated `aggregateRating` (4.9 / 25 reviews, no reviews exist) | Critical | Removed |
| 4 | Fabricated `VideoObject` (fake upload date, logo as thumbnail) | High | Removed |
| 5 | Homepage dynamically rendered, zero CDN caching | High | Fixed |
| 6 | `metadataBase` missing → OG/canonical resolution unreliable | High | Fixed |
| 7 | Sitemap `lastmod` was `new Date()` on an hourly revalidate — every URL claimed hourly change, forever | High | Fixed |
| 8 | `/tools/color-generator` absent from the sitemap | Medium | Fixed |
| 9 | Sub-pages had no `canonical` at all | Medium | Fixed |
| 10 | Homepage had no `<main>` landmark; `h1` appeared after four `h3`s | Medium | Fixed |
| 11 | Footer internal links absent from server HTML (`ssr: false`) | Medium | Fixed |
| 12 | `robots.txt` did not disallow `/api/` | Low | Fixed |
| 13 | `keywords` meta tag (ignored by Google since 2009) | Low | Removed |
| 14 | Only 4 indexable URLs on the entire domain | **Critical** | **Open — see below** |
| 15 | No `hreflang`; no international targeting | Low | Deferred (single-locale site) |
| 16 | No Google Business Profile linked for local SEO | Medium | Open |

### On `lastmod`

The old sitemap set `lastModified: new Date()` with `revalidate = 3600`. Every
URL claimed it had changed within the last hour, permanently. Google ignores
`lastmod` on sites where it proves unreliable — throwing away the one sitemap
field it still uses. `changefreq` and `priority` were also removed; Google has
stated for years that it ignores both.

### Crawlability, indexing, duplicates — all clean

- Apex `trajectra.com` → 308 → `https://www.trajectra.com/`. Correct.
- `http://` → 308 → `https://`. Correct.
- No duplicate-content paths, no parameterised URLs, no pagination.
- URL structure is clean and lowercase.
- HSTS present; now also declared in `next.config.mjs` so it survives a host change.

## The honest assessment

**The site cannot rank for software-services keywords, and no amount of
technical SEO will change that.** It has four indexable URLs, one of which is a
homepage and two of which are legal pages. There is no page targeting any
commercial query. "Custom software development company" is one of the most
competitive commercial terms on the internet; competitors have hundreds of pages
of depth, thousands of referring domains, and years of history.

Ranking globally for head terms is not a realistic 12-month goal. What *is*
realistic:

1. **Own the brand query.** "Trajectra" should return the site with a proper
   site name, sitelinks and a knowledge panel. That is what Priority 1 buys.
2. **Win long-tail and comparison intent** where competition is thin and the
   searcher is close to buying.
3. **Rank the free tool.** `/tools/color-generator` is the only asset on the
   domain with genuine organic potential today — see below.

## Missing pages, in build order

The site has no service pages. Six services are listed as paragraphs inside one
accordion-less block on the homepage, competing with each other for one URL.
Each needs its own page: that is six URLs, six sets of metadata, six `Service`
schema entities, and six things to link internally.

**Tier 1 — service pages** (`/services/<slug>`). Target: 1,200–1,800 words each,
with a real project example, a defined scope, a typical timeline, a process
section, and a booking CTA. (Prices deliberately withheld — see
[07-brand-strategy.md](./07-brand-strategy.md#qualifying-without-publishing-prices).)

| URL | Primary intent |
|---|---|
| `/services/custom-software-development` | commercial, head |
| `/services/mvp-development` | commercial, high-conversion |
| `/services/legacy-system-modernisation` | commercial, low-competition, high-value |
| `/services/cloud-migration` | commercial |
| `/services/technical-training` | commercial |
| `/services/it-consulting` | commercial |

**Tier 2 — trust pages.** These convert; they rarely rank, and that is fine.

- `/about` — real team, real faces, CAC registration number. Currently the only
  "about" is three abstract cards (Mission/Vision/Values) that say nothing
  specific about who Trajectra is. For an international buyer weighing a Nigerian
  vendor, this is the highest-leverage page on the site.
- `/work` + `/work/<case-study>` — 3–5 case studies with a problem, an approach,
  and a measurable outcome. Nothing converts a sceptical buyer faster.
- `/how-we-work` — engagement models, timelines, and contract terms, without
  numbers. You have chosen not to publish prices; this page does the same job a
  pricing page would (setting expectations and filtering leads) using scope,
  process and terms instead. See
  [07-brand-strategy.md](./07-brand-strategy.md#qualifying-without-publishing-prices).
- `/contact` — a real page. `#contact` on the homepage cannot rank or be linked.

**Tier 3 — programmatic long-tail.** `/hire/<role>` pages
(`/hire/react-developers`, `/hire/nodejs-developers`, …). These are genuinely
searched by buyers with budget, and are far less contested than "software
development company". Only build these once Tier 1 exists and is indexed —
thin programmatic pages on a young domain invite a quality demotion.

## Keyword strategy

Ignore head terms. Target these three clusters:

**Cluster A — buyer-intent long tail** (build as service pages)
`mvp development agency for startups` · `legacy system modernisation services` ·
`software development partner for series a startups` ·
`nearshore software team africa` · `dedicated development team nigeria`

**Cluster B — comparison and decision intent** (build as blog posts)
These rank fast because they answer a question no vendor wants to answer
honestly:

1. *What drives the cost of an MVP — the six variables that move the number*
   (explains the drivers and the ranges the market charges, without quoting
   your own rates)
2. *In-house team vs. agency vs. staff augmentation: a decision framework*
3. *How to audit a legacy codebase before you decide to rewrite it*
4. *What to look for in a software vendor's contract* (IP assignment, escrow, exit)
5. *Hiring engineers in Africa: timezone, contract, and payment realities for US/EU companies*

Post 5 is the highest-value piece on this list. It addresses the exact objection
an international buyer has about Trajectra, and answering it publicly turns the
main weakness into a positioning asset.

**Cluster C — the tool.** `/tools/color-generator` targets a genuinely high-volume
query family (`color palette generator`, `website color scheme generator`,
`extract colors from logo`). It already exists and is genuinely useful. It needs:
a proper `SoftwareApplication` schema, an FAQ block, 600+ words of supporting
copy explaining colour harmony, and shareable permalink URLs
(`/tools/color-generator?base=%230F172A`) so palettes can be linked — which is
how a tool earns backlinks. Ship 2–3 more tools in the same directory and the
`/tools/` hub becomes the site's main link-acquisition engine.

## Internal linking

Currently: the navbar links to four same-page anchors, the footer links to the
same four plus two legal pages. There is effectively no internal link graph.

Once the pages above exist:
- Homepage service cards link to their service pages (not to an anchor).
- Every service page links to 2 relevant case studies and 2 relevant blog posts.
- Every blog post links to exactly one service page with descriptive anchor text.
- The `/tools/` hub links to every service page — tool traffic is cold, so this
  is how it gets warmed.

## Off-site — the real bottleneck

Nothing in this repository affects rankings as much as referring domains, and
the domain has almost none. Priorities:

1. **Google Business Profile** for the Lagos address. Verified, categorised
   "Software company", with the site URL. Directly supports local pack and the
   knowledge panel, and reinforces the entity for the site-name fix.
2. **Clutch / GoodFirms / DesignRush** profiles. B2B buyers search these
   directly, and they are strong, legitimate links.
3. **Real client reviews on Clutch.** Then, and only then, real reviews on the
   site with honest `Review` schema.
4. **The tool.** Submit to design-tool directories and Product Hunt.
5. **Engineering blog.** Deep technical writing from the team is the only
   scalable, defensible link source available to an agency.

## Measurement

Set up before shipping content, or the next six months are unmeasurable:

- Search Console: verify both `www` and apex, submit the sitemap, watch the
  **Site names** report specifically.
- Bing Webmaster Tools (drives ChatGPT search results — non-trivial B2B traffic).
- GA4 conversion events on `Get a Free Consultation`, `Let's Talk`, and contact
  form submission. None of these are currently tracked as events, so the site's
  conversion rate is unknown.
