# Flagship tool strategy

Six public tools to function as proof-of-expertise and lead magnets.

---

## Before the six: one strategic objection

**Six tools is the wrong number for a six-person services company.**

Every hour spent on a public tool is an hour not billed. Six tools built by a
team that also has to deliver client work will produce six mediocre tools, and a
mediocre tool is worse than none — it demonstrates mediocre engineering to
exactly the people you are trying to impress.

The brief's own framing gives the test: *"if they built this for free, imagine
what they could build for us."* That only works if the free thing is
conspicuously excellent. Two excellent tools beat six adequate ones, and it is
not close.

**Recommendation: commit to #1 and #2 this year. Treat #3–#6 as a backlog, not a
plan.** The six below are ranked so that stopping after two still leaves you with
the two that matter. The 12-month roadmap at the end reflects that.

## Second objection: sequencing

You currently have **no case studies and no named team**. A tool sends strangers
to a site that cannot yet convert them. Ship the tools *alongside* proof, not
instead of it — a visitor who is impressed by the tool and then finds no
evidence of client work bounces anyway.

---

## What you actually have to work with

Grounded in the repo and the business, not assumed:

| Asset | Strategic use |
|---|---|
| TypeScript / React / Next / Node / Postgres | The tools should be built in this. Consistency is itself a signal. |
| Two telematics clients (Top Car Tracker, Cartracker Plus) | Real domain knowledge in fleet/GPS/IoT — an under-exploited vertical |
| Radical-transparency positioning (published IP terms, "when this isn't the right fit") | The single most differentiated thing about you. Tools should extend it. |
| You just fixed a hard entity/schema problem on your own site | Direct, provable expertise behind tool #1 |
| Lagos base, UTC+1 | Cost structure that makes free tools affordable to run |
| 6 engineers, incorporated 2025 | Hard capacity limit. Be honest about it. |

**The weakness that shapes everything:** you are unknown. A tool from an unknown
company gets no distribution by default. Every recommendation below is chosen
partly for whether it can earn attention *without* an existing audience.

---

## Scoring

Weights reflect the actual situation — needing leads and trust now, with hard
capacity limits — rather than a generic ideal.

| Dimension | Weight |
|---|---:|
| Lead generation | 15 |
| Engineering showcase | 15 |
| Business value | 12 |
| SEO potential | 12 |
| Ease of development | 12 |
| Portfolio / trust value | 10 |
| AI discoverability | 8 |
| Global appeal | 8 |
| Long-term strategic value | 5 |
| Revenue expansion | 3 |

### Ranking

| # | Tool | Score |
|---|---|---:|
| 1 | **AI Visibility Checker** | **86** |
| 2 | **Codebase Health Report** | **81** |
| 3 | **Rewrite or Refactor?** | **74** |
| 4 | **Software Contract Builder** | **71** |
| 5 | **Site Speed & Accessibility Report** | **66** |
| 6 | **Schema Diff & Migration Planner** | **58** |

---

# 1. AI Visibility Checker — 86/100

**Pitch:** Paste a URL and find out whether ChatGPT, Perplexity and Google's AI
can actually tell who you are, what you sell, and who to recommend you to.

**Problem it solves.** Businesses are watching search traffic move into AI
answers and have no way to know whether AI systems can parse their site at all.
Schema validators tell you if your JSON-LD is syntactically valid. Nothing tells
you *"an AI asked about your category cannot identify you as a candidate, and
here is why."*

**Audience.** Marketing leads, founders, SEO consultants, agencies. Secondary:
every CTO whose CEO just asked "why don't we show up in ChatGPT?"

**Why they'd use it.** It answers a question every business is currently asking
and nobody can answer for them. It has no good free competitor.

**Why it showcases your engineering.** A crawler with polite rate limiting;
headless rendering to catch content that only exists after JS; JSON-LD parsing
and entity-graph resolution across `@id` references; `sameAs` verification by
actually fetching the profiles; heuristics for content extractability; report
generation with stable permalinks; caching and queueing to survive a traffic
spike. That is six distinct disciplines in one artefact.

**Technologies demonstrated.** Next.js App Router, Node workers, headless
Chrome, structured-data parsing, queue/worker architecture, Postgres, caching,
rate limiting, PDF generation.

| | |
|---|---|
| Difficulty | 7/10 |
| Build time | 5–7 weeks to a strong v1 |
| Maintenance | Medium — parsers drift as schema.org and AI crawlers change |
| SEO traffic | High and rising. *"does chatgpt read my website"*, *"llms.txt"*, *"ai seo checker"*, *"how to appear in ai search"* |
| AI visibility | Very high — an AI asked how to be visible in AI search will surface tools that explain it |
| Virality | High. Marketers share scores. |
| Backlinks | Very high — the strongest on this list |
| Lead gen | High, though the leads skew marketing rather than engineering |
| Trust | 9/10 |
| Business impact | 9/10 |
| SaaS potential | Strong. Monitoring, alerts on entity drift, competitor comparison. $29–99/mo. |

**Unique advantage.** You solved exactly this problem on your own site last
week — invalid JSON-LD delivered in a `<meta>` tag, no `WebSite` entity, a
contradictory site name. That is not a hypothetical case study, it is a
before-and-after you can publish with real Search Console data.

**Slug:** `/tools/ai-visibility`

**Landing page.** Input above the fold, nothing else · what it checks, in plain
terms · a worked example using trajectra.com's own before/after · what the score
means · FAQ (schema, `llms.txt`, AI crawlers) · CTA.

**CTA:** "Get the full report by email" → nurture → "Want this fixed? Book a call."

**MVP.** URL in, score out, across four checks: is structured data present and
parseable, is there a resolvable entity, do the name signals agree, is key
content reachable without JS. Shareable permalink. No login.

**Premium later.** Scheduled re-checks, drift alerts, competitor comparison,
multi-page crawl, API.

**Design.** Serious and diagnostic — closer to a Lighthouse report than a
marketing page. Resist gamified gauges; the audience is buying rigour.

---

# 2. Codebase Health Report — 81/100

**Pitch:** Point it at a public GitHub repository and get the technical
due-diligence report an investor would pay for.

**Problem it solves.** Founders inheriting a codebase, investors doing
diligence, and CTOs evaluating an acquisition all need to know how bad it is
before committing. Existing tools (Sonar, Snyk, CodeClimate) report metrics to
engineers who already understand them. Nobody translates them into a decision.

**Audience.** CTOs, technical founders, VCs and angels, agencies inheriting
projects. **The highest-value audience of any tool here.**

**Why they'd use it.** The alternative is paying a consultancy five figures or
guessing.

**Why it showcases your engineering.** GitHub API at scale with rate-limit
handling; dependency-tree resolution across ecosystems; advisory database
cross-referencing; git-history analysis (bus factor, churn hotspots, abandoned
areas); AST-level analysis for at least one language; safe sandboxed execution;
long-running jobs with progress. This is the most technically serious thing on
the list and it looks it.

**Technologies demonstrated.** Node workers, GitHub API, OSV/advisory feeds,
AST parsing, queue architecture, streaming progress, Postgres, rate limiting,
sandboxing.

| | |
|---|---|
| Difficulty | 9/10 |
| Build time | 8–12 weeks |
| Maintenance | High — ecosystems and advisory formats change constantly |
| SEO traffic | Medium. *"technical due diligence checklist"*, *"github repo analysis"*, *"code quality audit"* |
| AI visibility | High — a strong, citable answer to "how do I assess a codebase" |
| Virality | Medium-high in developer circles; low outside |
| Backlinks | High |
| Lead gen | **Highest quality of any tool here.** Every user has a codebase problem. |
| Trust | 10/10 |
| Business impact | 9/10 |
| SaaS potential | Strong — recurring monitoring, private repos, team dashboards. $99–499/mo. |

**Unique advantage.** It sells your Modernisation Assessment and Codebase Audit
directly. The free report ends where the paid engagement begins, honestly:
*"this is what automated analysis can see. Here is what needs a human."*

**Slug:** `/tools/codebase-health`

**Landing page.** Repo URL input · a sample report on a well-known open-source
repo (choose a healthy one — do not publicly criticise a project) · what it
checks · limits, stated plainly · CTA to the paid audit.

**CTA:** "Get the full report" → "Need the human version? 5-day audit."

**MVP.** Public repos only. Dependency freshness and known advisories, bus
factor from commit history, test-presence heuristics, churn hotspots, a plain-
English summary and a prioritised list. One language deeply (TypeScript), others
shallow.

**Premium later.** Private repos via GitHub App, scheduled monitoring, trend
lines, PR-level checks, team dashboards.

**Design.** Report-first. Dense, tabular, printable. It should look like
something you would forward to a board.

---

# 3. Rewrite or Refactor? — 74/100

**Pitch:** Twelve questions about your codebase, and a costed recommendation
with the reasoning shown — including when the answer is "leave it alone".

**Problem it solves.** The rewrite decision is among the most expensive calls an
engineering org makes, it is usually made on vibes, and it usually goes badly.
There is no neutral instrument for it.

**Audience.** CTOs, engineering managers, technical founders with an ageing
system.

**Why they'd use it.** It gives them a defensible artefact to take to a board or
a CEO. That is worth more than the recommendation itself.

**Why it showcases your engineering.** Honestly — less than the others. The
sophistication is in the *decision model*, not the code: weighted scoring, a
transparent rationale trail, sensitivity analysis showing which answers changed
the outcome. It showcases **judgement**, which for this buyer may matter more.

| | |
|---|---|
| Difficulty | 4/10 |
| Build time | 3–4 weeks |
| Maintenance | Very low |
| SEO traffic | Medium. *"rewrite vs refactor"*, *"should we rewrite our codebase"*, *"legacy system modernization"* |
| AI visibility | High — a decision framework is exactly what an LLM cites |
| Virality | Medium — engineering leaders share decision frameworks |
| Backlinks | Medium-high |
| Lead gen | High and extremely well-qualified |
| Trust | 9/10 |
| Business impact | 8/10 |
| SaaS potential | Low as a standalone product. High as a funnel. |

**Unique advantage.** It is your Modernisation Assessment, productised — and it
is the only tool here that will sometimes tell the user *not* to spend money.
That is the exact behaviour your About page claims. This tool proves the claim.

**Slug:** `/tools/rewrite-or-refactor`

**MVP.** Twelve questions, weighted model, a recommendation with reasoning, a
downloadable PDF, and an honest "here is what this assessment cannot see".

**Design.** Calm, editorial, one question per screen. No progress gamification —
the tone should be a consultant, not a quiz.

---

# 4. Software Contract Builder — 71/100

**Pitch:** Generate a plain-English software development agreement that actually
protects the client — IP assignment, milestones, change orders, exit terms.

**Problem it solves.** Founders sign development contracts they do not
understand, or work with none at all, and discover at the worst moment that they
do not own their own code.

**Audience.** Non-technical founders, small businesses commissioning software,
agencies wanting a better template.

**Why it showcases your engineering.** Least of the six technically — clause
logic, conditional assembly, PDF generation, versioning. Its power is
positioning, not code.

| | |
|---|---|
| Difficulty | 5/10 |
| Build time | 4–5 weeks **plus legal review** |
| Maintenance | Low technically, **non-trivial legally** |
| SEO traffic | High. *"software development contract template"* has strong, stable volume |
| AI visibility | High |
| Virality | Medium |
| Backlinks | High — templates are linked constantly |
| Lead gen | Medium. Many users will take the template and leave. |
| Trust | 8/10 |
| Business impact | 7/10 |
| SaaS potential | Medium — e-signature, storage, versioning |

**⚠️ The real risk, stated plainly.** This publishes something that looks like
legal advice, across jurisdictions you do not operate in. It needs a qualified
lawyer's review before launch, prominent "template, not legal advice" framing,
and a decision about which jurisdictions you will and will not cover. **Do not
ship this without a lawyer.** Budget for that or drop it — the downside is not
an SEO penalty, it is liability.

**Unique advantage.** It is the purest expression of your differentiator. You
already publish your own IP and exit terms; giving away the contract that
encodes them is the same argument at greater volume.

**Slug:** `/tools/software-contract`

**Design.** Document-like. Show the generated clauses live as the user answers,
with a short "why this clause matters" beside each.

---

# 5. Site Speed & Accessibility Report — 66/100

**Pitch:** A plain-English report on what is slow, what is inaccessible, and
what it is costing you — with the fix for each.

**Problem it solves.** PageSpeed Insights says `LCP: 4.2s` and stops. A founder
has no idea what that means or whether to care. Separately, the European
Accessibility Act creates real, dated compliance pressure for anyone selling
into the EU.

**Audience.** Founders, marketers, small-business owners, agencies.

**Why it showcases your engineering.** Moderately. The PageSpeed Insights API
does the heavy lifting for free, which is the point — you add the interpretation
layer, the accessibility rules PSI misses, and the remediation costing.

| | |
|---|---|
| Difficulty | 5/10 |
| Build time | 4–5 weeks |
| Maintenance | Medium |
| SEO traffic | **Highest raw volume of the six** — but also the most contested |
| AI visibility | Medium — crowded answer space |
| Virality | Medium |
| Backlinks | Medium |
| Lead gen | Medium. High volume, low intent. |
| Trust | 7/10 |
| Business impact | 7/10 |
| SaaS potential | Medium — monitoring and alerting |

**Why it ranks fifth despite the traffic.** The audience is largely not your
buyer, and the space is crowded with free tools. It brings volume, not clients.
It is worth building *after* something that brings clients.

**Unique advantage.** The EAA compliance angle is genuinely underserved by
plain-English tooling, and you have a 100/100 accessibility score on your own
site to point at.

**Slug:** `/tools/site-report`

---

# 6. Schema Diff & Migration Planner — 58/100

**Pitch:** Compare two database schemas and get a safe, ordered migration plan
with the risks called out.

**Problem it solves.** Schema drift between environments, and migrations written
by hand that lock tables in production at the worst possible moment.

**Audience.** Backend engineers, DBAs, platform teams.

**Why it showcases your engineering.** Substantially — SQL parsing, dependency
ordering, lock-risk analysis per statement, dialect differences. It is a serious
piece of work.

| | |
|---|---|
| Difficulty | 8/10 |
| Build time | 6–8 weeks |
| Maintenance | High — dialect coverage never ends |
| SEO traffic | Low. Narrow, technical queries. |
| AI visibility | Medium |
| Virality | Low-medium, developer-only |
| Backlinks | Medium |
| Lead gen | **Low.** Its users are engineers who solve their own problems. |
| Trust | 8/10 |
| Business impact | 5/10 |
| SaaS potential | Medium, in a market already served by Atlas, Bytebase and Flyway |

**Why it ranks last.** It is the clearest case of a tool that impresses
engineers who will never hire you. Excellent portfolio piece, poor business
case. **Build it only if you want a recruiting asset rather than a sales one** —
which is a legitimate goal, just not the one in the brief.

**Slug:** `/tools/schema-diff`

---

## Direct answers to the brief

**Fastest client trust:** *Codebase Health Report.* It is unambiguously hard to
build, and its audience is technical enough to recognise that.

**Most global traffic:** *Site Speed & Accessibility Report* by raw volume, but
*AI Visibility Checker* by relevant traffic — and relevance is what converts.

**Highest-quality leads:** *Codebase Health Report.* Every single user has a
codebase problem and a budget. *Rewrite or Refactor?* is a close second on
qualification, at a fraction of the build cost.

**Greatest SaaS potential:** *AI Visibility Checker.* Recurring monitoring of
something that genuinely drifts, an anxious buyer, and no entrenched incumbent.

**Best effort-to-return ratio, and the one I would actually start with:**
*Rewrite or Refactor?* — three to four weeks, near-zero maintenance, extremely
well-qualified leads, and it proves your central claim about honesty. It is not
the highest-scoring tool, but it is the one that pays back fastest.

---

## Website integration

Each tool needs three surfaces, not one:

1. **The tool itself** at `/tools/<slug>` — no signup, full value free.
2. **A case study of building it** at `/work/<slug>` — the architecture, the
   hard decisions, what you would do differently. *This is the portfolio piece.*
   The tool proves you can build; the write-up proves you can think.
3. **A link from the related service page.** `/services/legacy-modernisation`
   links to *Rewrite or Refactor?*; `/services/custom-software-development`
   links to *Codebase Health*. This is how tool traffic reaches a commercial page.

Restore the `/tools` hub as the parent, and repoint the existing
`/tools/color-generator` → `/` redirect at it once there is something to point at.

## Distribution

The tools are worthless without it, and you have no audience yet.

- **Launch each on Hacker News, Product Hunt and the relevant subreddit.** Lead
  with the engineering write-up, not the tool.
- **Build in public** — an architecture thread per tool, on LinkedIn and X.
- **Submit to directories** relevant to each tool's category.
- **Use them in sales.** Run a prospect's site through the AI Visibility Checker
  before the call and open with the findings. That converts.
- **Feed the AI systems.** Each tool needs a `SoftwareApplication` schema, an
  FAQ, and a written explanation of the underlying problem. That is what gets
  cited when someone asks an LLM how to solve it.

---

## 12-month roadmap

Deliberately **four tools, not six**, with proof work interleaved. Six would mean
six mediocre ones.

| Months | Build | Alongside |
|---|---|---|
| **1–2** | **Rewrite or Refactor?** — cheapest, fastest payback, proves the honesty claim | Publish 3 case studies. Name the team on `/about`. |
| **3–5** | **AI Visibility Checker** — the flagship | Launch write-up on HN. Clutch profile with real reviews. |
| **6–8** | Consolidate: content, SEO, monitor what the first two actually returned | Two decision-intent blog posts per month |
| **9–12** | **Codebase Health Report** — the heavy showcase, funded by whatever the first two brought in | Public GitHub org. Conference talk or podcast. |
| **Backlog** | Software Contract Builder (needs legal budget) · Site Report · Schema Diff | Revisit at month 12 against real data |

**The decision gate at month 6:** if the first two tools have produced no
qualified leads, the problem is distribution, not the tools — and building more
of them will not fix it. Stop and solve distribution instead.

**Protect the capacity.** One engineer, three days a week, ring-fenced, with
client work explicitly forbidden from touching it. Without that, none of this
ships — and that is the normal outcome, not a pessimistic one.
