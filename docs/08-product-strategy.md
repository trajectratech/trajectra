# Product strategy

## The premise, and one caution

Services revenue is linear and stops when you stop. Products compound. The
instinct to build them is right.

The caution: **an agency's first product usually fails because it is built with
leftover capacity.** Client work always wins the priority argument, the product
gets the tired hours, and it dies half-finished. Every recommendation below
assumes a genuine, protected allocation — one person, three days a week,
non-negotiable — or it should not be started.

Second caution, on the brief's own terms: you asked to "avoid building products
without validated market demand." Nothing below is validated. These are
hypotheses ranked by evidence quality, and each carries a cheap validation step
that costs days rather than months. Run the step before writing code.

## Ranking criteria

Global demand · feasibility for a small team · recurring revenue · competitive
density · defensibility · **and one the brief omits: does it feed the agency?**
A product that generates qualified leads for the services business is worth more
than its own MRR in year one.

---

## Tier 1 — do these

### P1 · The tools directory (extend what already exists)

**What:** `/tools/` as a suite of free, no-signup developer and designer
utilities. The colour generator is live and works. Add 4–6 more: contrast
checker, favicon/OG image generator, JSON↔TypeScript type generator, cron
expression explainer, `.env` validator.

**Why this first:**
- **Validated by definition** — these queries have known, high, stable search
  volume, and existing tools rank on ad-heavy pages that people dislike.
- Near-zero marginal cost. Client-side, no backend, no support burden.
- It is the cheapest legitimate backlink engine available to an agency.
- Every visitor is a developer or designer — either a hire, a referrer, or a
  buyer.
- **It makes the agency credible.** "We ship things" is demonstrated, not claimed.

**Revenue:** none directly. That is fine — it is a demand-generation asset.
**Effort:** 1–2 weeks per tool. **Validate:** ship one, check Search Console at
90 days.

### P2 · Productised service offerings

**What:** fixed-scope, fixed-duration engagements with a named deliverable. Not
a software product — a packaged one. You have chosen not to publish prices, so
these are sold on *scope and duration*, with the figure given on the call.

- **Codebase Audit** — 5 days. Architecture, security, performance, test
  coverage, a prioritised remediation plan. *This entire audit is the demo.*
- **MVP Sprint** — 10 weeks, fixed scope, fixed price agreed up front.
- **Modernisation Assessment** — 2 weeks. Rewrite-vs-refactor decision with a
  costed plan.

Fixing the *duration* publicly gets most of the benefit of a published price:
it signals confidence, sets expectations, and makes the offer concrete.

**Why:** highest revenue per unit of effort on this page, and the only item that
can generate income within 30 days. The audit in particular is a natural
top-of-funnel product — it is low-commitment for the buyer and converts directly
into the delivery engagement.

**Trade-off you are accepting by not publishing prices:** more discovery calls
with unqualified leads, and the anchoring conversation happens live rather than
being pre-set. Mitigate it with a budget-range question on the booking form —
see [09-growth-strategy.md](./09-growth-strategy.md#qualifying-without-a-price-page).

**Revenue:** immediate. **Effort:** a landing page and a template.
**Validate:** publish the audit offer; if nobody books in 60 days, the problem
is traffic, not the offer.

### P3 · An open-source library the team already needs

**What:** extract something genuinely reusable from client work and publish it
properly — documented, tested, versioned.

**Why:** the highest-credibility signal available to an engineering firm. A
GitHub organisation with real stars answers "are these people good?" better than
any case study. Costs almost nothing because the code already exists.

**Revenue:** none. **Effort:** ongoing, small. **Validate:** n/a — do it.

---

## Tier 2 — plausible, needs validation first

### P4 · A vertical B2B SaaS for an underserved African market

**What:** one operational SaaS for a specific Nigerian/West African industry —
clinic management, logistics dispatch, school administration, agricultural
supply chain.

**Why this is the strongest *product* idea:**
- **You have distribution advantage nobody else has.** A Lagos team can walk into
  the customer's office. A US SaaS company cannot.
- Real, unautomated pain; incumbent software is often literally paper.
- Local payment rails (Paystack/Flutterwave) are solved.
- **Defensible** — the moat is local knowledge and on-the-ground support, which
  is exactly what a foreign competitor cannot replicate.

**The honest risks:** low ticket sizes, slow enterprise sales cycles, high
support load, and FX exposure on naira revenue against dollar costs.

**Revenue:** $50–500/month per customer, slow ramp, but genuinely compounding.
**Effort:** 4–6 months to a sellable v1.
**Validate first:** ten paid pre-orders or letters of intent before any code.
If ten businesses in the target vertical will not pay a deposit, the problem is
not real enough.

### P5 · AI-assisted legacy code assessment

**What:** an internal tool that ingests a repository and produces the
modernisation assessment (P2) mostly automatically. Sell the report, not the
tool.

**Why:** it directly multiplies a service you already sell, the assessment has a
clear price, and it plays to genuine LLM strengths (summarisation, dependency
analysis, risk flagging) rather than the parts LLMs do badly.

**Why not a standalone product:** the standalone code-analysis market is
crowded (Sonar, Snyk, CodeScene, Semgrep) and well-funded. As an internal
margin multiplier it is excellent; as a product to sell it is a losing fight.

**Revenue:** indirect — raises assessment margin substantially.
**Effort:** 6–8 weeks. **Validate:** sell three assessments manually first.

---

## Tier 3 — do not build these

### A general developer-tools SaaS
Deployment platforms, monitoring, API gateways, feature flags. Enormous, funded,
consolidating. A services company cannot out-invest Vercel or Datadog.

### A general-purpose "AI agent" product
The most crowded category in software, defensibility near zero, and every
capability is one model release away from being a commodity. Building *with*
LLMs for clients is excellent business. Building a horizontal AI product is not.

### An LMS for the training arm
Tempting because the training business exists. Extremely crowded, low margin,
and it converts a services business into a content business — which is a
completely different company. Teachable or Thinkific costs $99/month and is a
better answer.

---

## Recommended sequence

| Quarter | Do | Do not |
|---|---|---|
| Q1 | P2 productised offers · one more tool (P1) | Anything requiring a backend |
| Q2 | 2 more tools · publish P3 library · run P4 validation | Write P4 code |
| Q3 | P5 internal tool · P4 build **only if 10 pre-orders exist** | Start anything new |
| Q4 | Ship P4 v1 to design partners | — |

**The single decision that matters:** protect the allocation. One engineer,
three days a week, on product, with client work explicitly forbidden from
touching it. Without that, none of the above happens — and that is the normal
outcome, not a pessimistic one.
