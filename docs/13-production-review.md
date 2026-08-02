# Production review

Requested brief: *brutally honest, production-grade audit… assume this launches
tomorrow to millions of users.*

Every score below is grounded in a measurement taken against the current branch,
or is marked as a judgement. Where I could not measure something, I say so rather
than scoring it.

---

## Executive summary

**The craft is genuinely excellent. The substance is thin.**

This site is now better engineered than the large majority of agency websites.
100/100/100 on accessibility, best practices and SEO across every page type; no
horizontal overflow at any width from 320px to 2560px; no overflow at 200% zoom;
a clean keyboard path with visible focus on every stop; valid structured data on
every page; CLS of exactly 0.

And none of that is what will decide whether it works.

The site asks a stranger to trust a **6-person company incorporated in 2025**,
and gives them: two client names, no case studies, no named people, no
testimonials, and no evidence of anything ever shipped. The engineering is
world-class. The proof is close to absent. **That gap — not any technical
defect — is what stands between this and the stated goal.**

---

## Scores

| Category | Score | Basis |
|---|---:|---|
| **Overall production readiness** | **72** | Weighted; technical readiness is high, commercial readiness is not |
| Brand | 74 | Judgement. Coherent and distinctive, but unproven |
| Technical SEO | 95 | Measured — 100 across four page types, valid schema everywhere |
| SEO competitiveness | 25 | Measured — 11 URLs, no backlinks, no content |
| AI search | 55 | Excellent markup, no external corroboration |
| Accessibility | 92 | 100 in lab; no real assistive-technology testing |
| Performance | 93 | 96–98 lab across four pages; field data unmeasured |
| Conversion | 60 | Structure is right, proof is missing |
| Technical quality | 88 | Strong, no test suite or CI |

### Measured evidence

| Page | Perf / A11y / BP / SEO | LCP | CLS | TBT |
|---|---|---|---|---|
| `/` | 96 / 100 / 100 / 100 | 2.8 s | 0 | 10 ms |
| `/services` | 98 / 100 / 100 / 100 | 2.5 s | 0 | 60 ms |
| `/about` | 97 / 100 / 100 / 100 | 2.6 s | 0 | 10 ms |
| `/services/custom-software-development` | 97 / 100 / 100 / 100 | 2.6 s | 0 | 10 ms |

Responsive: clean at 320 / 360 / 390 / 768 / 1024 / 1440 / 2560 px. 200% zoom:
no overflow. Keyboard: skip link is the first stop, then logo, nav, CTA, hero —
correct order, visible focus on all twelve stops checked.

---

## Critical launch blockers

**None technical.** Nothing here is broken. What follows are commercial
blockers against the *stated ambition*, not against shipping.

### B1 — The target audience does not match what is built

The brief targets *Enterprise Clients* and *Government Organizations*. Nothing
on this site addresses either. No security posture, no data-handling statement,
no compliance references, no SLA, no insurance, no procurement or tender
information, no company-scale signals. A government procurement officer would
leave within seconds — not because the site is bad, but because it answers none
of their mandatory questions.

**Recommendation: drop those two segments, or build for them.** A 6-person firm
incorporated in 2025 will not win government tenders in the next 12 months, and
building the pages to chase them costs more than it returns. Startups, SMBs and
founder/CTO buyers are winnable now. Focus wins; breadth here does not.

### B2 — Zero proof of work

Two client names in the proof band, and that is the entire evidence base. No
case study, no outcome, no metric, no screenshot, no testimonial. Every claim on
the site is currently self-asserted.

---

## High priority

| # | Issue | Why it matters |
|---|---|---|
| H1 | No case studies | The highest-value missing asset by a wide margin. Three, with a number in each, would change the site's character more than any redesign |
| H2 | No named people | The page says "6 engineers" and names none. A specific number now *invites* the question |
| H3 | No testimonials | Two clients have already agreed to be named. A two-sentence quote from each is a short email away |
| H4 | Not deployed | Everything in this review is measured against a branch. Production still serves the old design |
| H5 | Booking runs on `trajectratech.youcanbook.me` | A third-party domain at the exact moment of conversion. Move to `trajectra.com/book` |
| H6 | No field performance data | All numbers here are lab. CrUX is what Google ranks on, and it does not exist yet |
| H7 | No real assistive-technology testing | Lighthouse catches roughly a third of accessibility barriers. VoiceOver and NVDA passes are still outstanding |

---

## Medium priority

- **11 indexable URLs.** Thin by any competitive standard. Service pages run
  400–600 words against competitors' 1,500+.
- **No blog, no topical authority.** "Dominate software-related searches" is not
  reachable without content; nothing else substitutes.
- **No CI.** `tsc`, `eslint` and `next build` all pass, but nothing enforces it.
  Next 16 removed lint from the build, so a regression can now merge silently.
- **No tests.** The contact form and the analytics layer are the two places with
  real logic and neither has a test.
- **657 KB of JavaScript uncompressed** across the first load. Transfer size is
  far lower after compression, but this is worth measuring properly rather than
  assuming.
- **`/tools/color-generator` still 301s to `/`.** Fine for now; repoint it when a
  replacement tool ships.
- **Compatibility colour aliases** still in `tailwind.config.ts`. Harmless,
  removable once nothing references them.

## Low priority

- Poppins reads friendly-startup rather than serious-engineering. Defensible, and
  a typeface change is a brand decision, not a fix.
- `SITE_TAGLINE` and `HOME_TITLE` describe the old three-service positioning
  ("Training & IT Consulting") while the site now leads with three different
  services. Worth reconciling.
- No dark theme. Tailwind is configured for class-based dark mode and nothing
  uses it.
- No PWA behaviour beyond the manifest. Almost certainly not worth adding.

---

## AI search optimisation

The brief asks specifically about ChatGPT, Claude, Gemini, Perplexity, Copilot
and AI Overviews. An honest answer:

**What is already right.** Clean semantic HTML, valid `Organization`, `WebSite`,
`Service`, `FAQPage`, `BreadcrumbList` and `ItemList` schema, an explicit
`mainEntityOfPage`, a typed registration-number identifier, `foundingDate`,
`numberOfEmployees`, unambiguous service definitions, and FAQ content in real
prose. This is a genuinely strong machine-readable foundation — better than most
sites of any size.

**What no amount of markup will fix.** AI systems recommend companies on
**external corroboration**, not self-description. They surface entities that
appear in sources they already trust: Clutch, G2, Crunchbase, GitHub, press,
conference listings, other people's blog posts. Trajectra currently has
essentially none of that footprint. An AI asked "who should build my MVP?" has
nothing to retrieve.

**Ranked actions:** Clutch profile with real reviews → public GitHub organisation
with real work → Crunchbase entry → technical writing that other people cite →
directory listings. Schema is the easy half and it is done; the corroboration is
the half that matters and it has not started.

---

## Competitive analysis — and a correction to the brief

The brief asks for comparison against Stripe, Linear, Vercel, GitHub, Figma,
OpenAI, AWS and Microsoft.

**This is the wrong benchmark, and chasing it will waste money.** Those are
product companies with design organisations larger than Trajectra's entire
headcount, and their sites solve a different problem: explaining a product at
scale. Trajectra's site has to convince one sceptical buyer to book one call.
Matching Stripe's polish would not move that number.

**The real competitive set** is other software agencies pitching the same
buyers — Thoughtbot, Netguru, Railsware, STRV, and the several hundred agencies
ranking for "MVP development". Against *that* set:

**Where Trajectra is stronger:** published commercial terms (IP, repository,
exit) that almost none of them state; the "when this isn't the right fit"
sections; a verifiable registration number; genuinely better technical execution.

**Where Trajectra is weaker:** no case studies, no named team, no reviews, no
content, no domain authority. Every one of those competitors has all five.

**What would make a buyer choose Trajectra:** the transparency. Being told
plainly who a service is wrong for, that IP transfers unconditionally, and that
they can exit in 30 days is disarming in a market where everyone hedges. That is
a real differentiator and it is already built. It just needs proof attached.

---

## Final questions, answered directly

**Would you launch this website today?**
Yes — immediately. It is strictly better than what is live in every measurable
dimension, and waiting for case studies means running the worse site for longer.

**Would you invest in this company based only on its website?**
No. It shows craft, not traction. There is no evidence of revenue, retention,
shipped work, or a team. A website cannot carry an investment case and this one
does not try to.

**Would you hire this company instead of its competitors?**
For a small first project — plausibly yes, because the terms are unusually
honest and the site itself is a competence demonstration. For anything above
roughly $25k, or for an enterprise buyer — no, not yet. The risk of an unproven
6-person vendor is not offset by anything on the page.

**Top 10 improvements by growth impact**

1. Three case studies with a measurable outcome in each
2. Named team with faces on `/about`
3. Testimonials from the two clients who already agreed to be named
4. Clutch profile with real reviews
5. Deploy, then verify field Core Web Vitals
6. Booking on a Trajectra-owned domain
7. Narrow the target audience to who is actually winnable
8. The five decision-intent blog posts from the SEO audit
9. Public GitHub organisation with real work
10. Two more service pages built out to competitive depth

Note that **nine of ten are content and proof, not code.** That is the finding.

**What would prevent this becoming a world-class software company?**
Not the website. The constraint is that nothing external corroborates any claim
it makes. Craft is now a solved problem here; evidence is not. The second risk is
scope — a 6-person firm targeting startups through to government simultaneously
will be beaten in every segment by someone focused.

**How does this become definitive for humans and AI?**
The same way for both: become the source others cite. Publish real numbers about
what things cost and how long they take, name the people, show the work, and be
the firm that says the uncomfortable true thing in public. Structured data makes
a site *legible* to AI; being cited is what makes it *recommended*. The first is
done. The second has not begun.

---

## Verdict

**Ship it. Then spend the next quarter on proof, not pixels.**

The engineering work is finished to a standard that will not need revisiting.
Every remaining item on this list is a sentence someone at Trajectra has to
write, a photograph someone has to take, or a client someone has to ask.
