# Product strategy: what to build publicly

**Rewritten 2026-08-03.** The first version of this document ranked six free
"tools" as lead magnets. A single question from the client killed all six. The
reasoning is kept because it generalises.

---

## The question that changed the answer

> *"Can't people just use AI like Claude Code to do this themselves?"*

Yes. And the proof was already in the transcript: earlier in this engagement I
diagnosed the structured-data failure on trajectra.com by fetching the page,
parsing the JSON-LD and checking the `sameAs` URLs — in about four commands.
That **is** the "AI Visibility Checker" that had been ranked first. Minutes, not
five weeks.

Two earlier framings were wrong:

- *"Does the tool have to go somewhere and check something?"* — true of chat
  models, false of agentic tools with a shell. They fetch, render, parse and
  verify perfectly well.
- *"The value is the artefact, not the answer."* — true, and not worth four
  weeks of engineering.

### The test that actually holds

> **Is the tool doing a job the user would otherwise ask an AI to do?**
>
> If yes, it is dead. If its value is **evidence** rather than **function**, it
> survives.

Applied to the original six:

| Tool | Verdict |
|---|---|
| AI Visibility Checker | ❌ Dead — demonstrated in-session |
| Codebase Health Report | ❌ Dead — coding agents read repositories natively |
| Rewrite or Refactor? | ❌ Dead — pure advice, and an agent can read the actual code |
| Software Contract Builder | ❌ Dead — an LLM drafts a better one, tailored |
| Site Speed & Accessibility | ❌ Dead — PageSpeed has an API; an agent calls it |
| Schema Diff & Migration Planner | ❌ Dead |

**All six.** Not because AI beats them on quality, but because the target
audience — CTOs and technical founders — is precisely the population that
already has these agents. The people who would still fill in a web form are not
the people who commission software engineering.

**The free-tool-as-lead-magnet play is largely over for a technical audience.**
Uncomfortable, and correct.

---

## What still survives

Four categories, all more expensive than the tools they replace. That is the
trade.

1. **Systems that run continuously.** Uptime over months is itself the evidence.
   Nobody prompts a service into having been reliable since March.
2. **Things with physical reality.** Hardware cannot be generated.
3. **Assets whose value accrues over time.** A longitudinal dataset cannot be
   created retroactively, by anyone, at any price.
4. **Work that others adopt.** An agent can write a library in an afternoon. It
   cannot make two thousand developers depend on it.

What these share: **the proof is not the artefact, it is that the artefact has
persisted.** Persistence is the one thing generation cannot shortcut.

---

## The four worth building

### 1. Live fleet-tracking platform — the flagship

Full specification in [16-fleet-demo-spec.md](./16-fleet-demo-spec.md).

A public map streaming ~5,000 simulated vehicles at 1 Hz, with geofencing,
alerts and 24-hour replay. Survives because nobody visits it to get a job done —
they visit to answer *"can these people build hard things?"* A system that has
stayed up for six months answers that in a way no generated artefact can.

Anchored in a vertical Trajectra already serves, so it doubles as a case study.
**~4–5 months at a three-day-a-week allocation.**

### 2. Open GPS tracker reference build

**The strongest new idea in this rewrite, and it pairs with #1.**

A complete open hardware design for a vehicle tracker built from commodity parts
— published bill of materials, firmware, enclosure files, assembly guide — that
streams into the same platform as the fleet demo.

**Why it survives:** it is physical. Someone can order the parts and build one.
An AI can write firmware; it cannot produce a device that has been running on a
dashboard through Lagos traffic for four months.

**Why it converts:** it proves Trajectra understands the *entire* stack —
silicon to cloud to browser. For telematics, logistics, agriculture and
public-sector asset tracking, that is the whole buying question. It also opens
the government conversation on merit rather than through a tender.

Difficulty 8/10 · ~10–12 weeks alongside the fleet demo, sharing its backend ·
real but small hardware cost.

### 3. Nigerian internet infrastructure observability index

Distributed probes measuring latency, packet loss and availability to major
Nigerian services and ISPs, published continuously with full history.

**Why it survives:** the value is the **archive**. *"What was Nigerian internet
performance during the second week of March?"* cannot be answered by any agent,
now or ever, unless somebody was measuring at the time. Every month it runs, the
moat deepens.

**Why it converts:** journalists and analysts cite it — which produces exactly
the external corroboration the production review identified as the missing
ingredient for AI search visibility. Demonstrates distributed systems,
time-series at volume, and data visualisation.

Difficulty 6/10 · ~6–8 weeks · low ongoing cost, but it must never stop. An
index with a gap in it is worth far less than one without.

### 4. One open-source library, extracted from real work

Not a demo. Something that came out of client delivery, published properly:
documented, tested, versioned, maintained.

**Why it survives:** adoption is the evidence, and adoption cannot be generated.
Stars, downloads and dependents are third-party corroboration in exactly the
form that both hiring engineers and AI systems weigh.

Difficulty depends on what is extracted · ongoing, small · the cheapest item
here, and the only one that doubles as recruitment.

---

## Sequencing

The production review already concluded that **nine of the top ten growth
improvements were content and proof, not code.** Several messages of tool
strategy were a detour from a finding already made. The corrected order:

| When | What | Why |
|---|---|---|
| **Now — weeks** | Case studies, named team, Clutch profile | Highest value available, and none of it is engineering. See [17-case-studies.md](./17-case-studies.md) |
| **Months 2–6** | Fleet demo | The flagship. Uncopyable. |
| **Month 4, alongside** | GPS tracker reference build | Shares the fleet backend; adds physical proof |
| **Continuous background** | Infrastructure index, OSS library | Both compound. Both cheap to start. |
| **Never** | The six report tools | Superseded |

**One decision gate.** If the case studies and the Clutch profile do not move
inbound enquiries within 90 days, the constraint is distribution, not artefacts
— and a fleet demo will not fix it. Solve distribution first in that case.

---

## The principle, stated once

An artefact whose value is **what it does** competes with a model that can do it
on demand, and loses.

An artefact whose value is **that it exists, and has kept existing**, does not
compete with generation at all.

Build the second kind.
