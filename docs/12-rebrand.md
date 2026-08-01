# Rebrand — implementation notes

Implements [06-ui-ux-recommendations.md](./06-ui-ux-recommendations.md) and the
positioning from [07-brand-strategy.md](./07-brand-strategy.md).

Decisions taken 2026-08-01: **full redesign** · **three headline services** ·
**client logo proof band**.

## Design system

Eleven ad-hoc tokens — nine of them near-greys with overlapping roles — replaced
by one documented ramp in [tailwind.config.ts](../tailwind.config.ts).

- **Neutral 50–900**, cool-leaning, anchored on the existing `#1F2937` ink.
- **Two brand greens.** `brand` (`#34C759`) for dark surfaces and accents;
  `brand-strong` (`#207936`) for text and CTAs on light.
- **Fluid type scale** using `clamp()`, so there is no jump between breakpoints.
  The old hero heading went `text-[1.2rem]` → `text-5xl` with nothing between,
  and was *smaller than the body text beside it* on phones.
- **One vertical rhythm** (`py-section-sm` / `py-section`), **one container
  width** (`max-w-container`), **one prose measure** (`max-w-prose`), applied
  through a `Section` primitive so it cannot drift again.
- **One focus ring**, declared once in `globals.css`, two-tone for light and
  dark surfaces.

### Contrast — and a mistake worth recording

Every text pair is measured and documented in the config header. One
regression happened during the build and is instructive:

`brand-strong` was originally `#23863C`, verified at **4.62:1 against white**.
But every `surface="muted"` section uses `neutral-50` (`#F8FAFC`), where the
same green measures **4.41:1** — a fail. Lighthouse caught it; the design
system's own documentation had not, because it only recorded the white pairing.

The rule now written into the config: **verify a colour against the darkest
light surface it can land on and the lightest dark one, not against white and
black.** The same pass caught `neutral-500` on ink at 3.77:1 in the footer.

## Home page

| Was | Now |
|---|---|
| 4-slide auto-rotating carousel | Static hero, one headline, one primary CTA |
| No proof of anything | Proof band (client logos when supplied, verifiable facts meanwhile) |
| 6 equal services as keyword prose | 3 offer cards + 3 secondary, each with *what / who for / how long* |
| — | "How we work" — the four steps from call to handover |
| — | Commercial terms — IP, repository, fixed price, exit |
| — | FAQ with `FAQPage` schema |
| 5 CTA labels → 1 destination | One primary label, used verbatim everywhere |
| Mission / Vision / Values | Removed — abstractions every agency also claims |

The `h1` is now **visible** rather than screen-reader-only. That was a
concession to the carousel having no stable headline; with a static hero it is
no longer needed.

## Things that must not ship unverified

**`terms` and `faq` in [home.json](../src/contents/home.json) are commercial
commitments.** They state that IP transfers on final payment, that code lives in
the client's repository from day one, that retainers exit on 30 days' notice,
and that invoicing is available in USD/GBP/EUR. These were written from the
brand strategy as *recommendations*. Confirm each is true of how Trajectra
actually contracts, or edit it, before this goes live.

**Client credits.** Two are live, both with permission recorded in
[clients.json](../src/contents/clients.json): Top Car Tracker Recovery Solutions
and Cartracker Plus Telematics. The second is credited by the brand on its own
mark and domain — permission came from Joshua Adeshokan, whose name is recorded
in the file rather than shown on the page, because a private individual's name
does not belong under a company logo. Correct `name` if the registered trading
name differs.

The band renders nothing at all while `clients.json` is empty, so no placeholder
or invented client can ever reach production.

## Two silent-failure bugs found during the build

**Tailwind opacity steps that don't exist generate nothing.** `bg-ink/88` and
`via-ink/92` produced *no CSS at all* — the mobile hero scrim silently did not
exist, leaving light text over a bright photograph. Only steps on Tailwind's
scale work. This is the same class of failure as the interpolated
`md:grid-cols-${columns}` found in the original audit: a class that looks
correct, passes lint and type-check, and emits nothing.

**Next 16 ignores `quality` unless it is whitelisted.** `images.qualities`
defaults to `[75]`; any other value is silently re-served at 75, and a direct
request for an unlisted value returns 400. The `quality={70}` and `quality={65}`
props written before the Next 16 upgrade had therefore been having **no effect
in production** since that upgrade merged. Now declared as `qualities: [40, 75]`
in [next.config.mjs](../next.config.mjs), and the hero — pure texture under a
90% scrim — dropped from 37 KB to 12 KB.

## Results

Local Lighthouse, mobile: **95 / 100 / 100 / 100**. FCP 0.9 s · Speed Index
0.9 s · CLS 0 · TBT 30 ms.

LCP measured 2.8 s locally, but this machine returned anywhere from 1.5 s to
3.4 s for identical builds across runs, so that figure is noise rather than
signal. **Re-measure on production** — the pre-redesign production LCP was
2.0 s, and that is the number to compare against.

## Service pages

Six pages plus a `/services` hub, all generated from one template
(`app/(main)/services/[slug]/page.tsx`) driven by `services.json`, so metadata,
canonicals, breadcrumbs and `Service` schema are correct by construction rather
than by remembering. Slugs are keyword-bearing (`custom-software-development`,
not `build`) because that is the string people search for.

Each page carries a **"When this isn't the right fit"** block. It costs a few
unqualified enquiries and buys credibility with everyone else — almost no
agency will say who it is wrong for, which is exactly why it works.

Internal linking now exists: home page cards → service pages, hub → all six,
each page → two related, footer → all six from every page. Before this the site
had effectively no internal link graph.

Local Lighthouse on `/services/custom-software-development`, mobile:
**97 / 100 / 100 / 100**, no failed audits.

## Positioning: worldwide, not European

An earlier draft leaned on "European hours" throughout. Corrected 2026-08-01 —
Trajectra serves clients anywhere. UTC+1 is now presented as a *fact about
overlap* rather than a claim about which market is served: a full working day
with Europe, the UK and Africa, a wide afternoon window with the Americas, and a
morning window with the Gulf and South Asia. Payment currencies are USD, EUR,
GBP and NGN.

## Contact form

Rebuilt after the mid-project rewrite. What was wrong and what changed:

- **`<Toaster />` was not mounted anywhere.** Every `toast.success()` and
  `toast.error()` call rendered nothing, so submitting the form gave the
  visitor no feedback at all — on the site's only conversion path. Replaced
  with a persistent success panel and inline error regions. A toast is the
  wrong pattern here anyway: it vanishes after a few seconds and leaves the
  filled-in form on screen looking like nothing happened. `react-hot-toast` is
  no longer a dependency.
- **`/api/send-email` had no SMTP timeouts.** Measured hanging for 30s+ with no
  response; nodemailer waits indefinitely by default. Now fails in ~10s with a
  message the visitor can act on, plus a 20s `AbortController` ceiling on the
  client in case the route itself stalls.
- **Hard-coded element ids** (`contact-name`) replaced with `useId`. Duplicate
  ids silently break every label and `aria-describedby` pairing the moment a
  form renders twice.
- **One error summary** instead of `role="alert"` on each field. Four alerts
  firing simultaneously queue unpredictably and the visitor hears fragments.
  The summary takes focus on failed submit and each entry links to its input.
- Success replaces the form and takes focus, with a "send another" route back.

## Icons

Every checkmark on the site was a solid blob. They shared one compound SVG path
that drew the circle and the tick in the same winding direction, so under the
default `fill-rule: nonzero` the tick never cut through. Replaced with
`CheckCircle` and `ExcludeCircle` in `components/ui` — the tick is now a
separate stroked path, and the two are distinguishable by *shape* rather than
only colour, which matters for greyscale and colour vision deficiency.

## Still to do

1. **Confirm the commercial terms** above.
3. `/about` with real names and faces. Still the largest trust gap.
4. Case studies at `/work`.
5. Remove the compatibility colour aliases in `tailwind.config.ts` once the
   contact form is migrated off `background-semi-grey` and friends.
