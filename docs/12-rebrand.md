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

**[clients.json](../src/contents/clients.json) ships empty on purpose.** The
proof band renders no logo row at all while it is empty, so no placeholder or
invented client can reach production. Add entries only for clients who have
agreed in writing to be named. Fewer than three logos looks weaker than none.

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

## Still to do

1. **Supply client logos** — the single highest-impact remaining item.
2. **Confirm the commercial terms** above.
3. Service pages at `/services/<slug>` — the cards currently have nowhere to
   link to.
4. `/about` with real names and faces. Still the largest trust gap.
5. Case studies at `/work`.
6. Remove the compatibility colour aliases in `tailwind.config.ts` once the
   contact form is migrated off `background-semi-grey` and friends.
