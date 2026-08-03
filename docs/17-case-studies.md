# Case studies

Three things here: one case study that is **ready to publish**, a template for the
client ones, and the interview script that turns a 20-minute call into a
publishable case study.

---

## Why I cannot write the client ones

I do not know what Trajectra built for Top Car Tracker Recovery Solutions or
Cartracker Plus Telematics. Not the scope, the stack, the timeline, the problem
or the outcome.

Writing them anyway would mean inventing work performed for a named third party
who has given permission to be credited. If a prospect rang Top Car Tracker to
check a claim that was never true, the damage would not be to a page — it would
be to the client relationship and to every other claim on the site. This is the
same category as the fabricated `aggregateRating` removed during the original
audit, except worse, because it implicates someone else's company.

**What is needed from you: 20 minutes per client, answering the script at the
bottom of this document.** That is genuinely all. The writing is the easy part.

---

# Case study 1 — ready to publish

**This one is real.** Every figure below was measured during the rebuild, and
most can be independently re-verified by anyone with a browser.

> ### Rebuilding trajectra.com
>
> **The problem**
>
> Our own website was invisible to Google in the way that mattered most. Search
> results showed "trajectra.com" instead of our brand name, and we did not know
> why.
>
> The answer turned out to be a single character class. Every piece of
> structured data on the site — the company details, the services, the contact
> information — was being delivered inside a `<meta>` tag rather than a
> `<script>` tag. Search engines only parse JSON-LD from `<script>`. Six
> kilobytes of carefully written markup, on every page, that no search engine
> had ever read.
>
> Fixing that meant auditing everything else, and everything else had problems
> too.
>
> **What we found**
>
> - The home page was rendering on every single request with no caching at all —
>   the CDN was serving nothing.
> - Every image in the assets folder was a photograph base64-encoded inside an
>   SVG wrapper. Image optimisers pass SVG through untouched, so none of them
>   could be compressed. The largest was 708 KB and it was the first thing on
>   the page.
> - The site downloaded five font files and then rendered in Arial. The CSS
>   asked for `"Poppins"`; the font loader had registered it under a hashed
>   name. The two never matched.
> - Every primary call-to-action on the site failed WCAG colour contrast at
>   2.22:1 against a 4.5:1 requirement.
> - The contact form endpoint accepted the recipient address, the subject and
>   the raw HTML body from the browser. Anyone could have sent arbitrary email
>   from our domain.
>
> **What we did**
>
> Rebuilt the front end on a documented design system — one neutral scale, two
> brand greens with measured contrast pairs, a fluid type scale, one spacing
> rhythm. Replaced a four-slide auto-rotating hero carousel with a single static
> one. Extracted the embedded photographs and let the image pipeline do its job.
> Locked down the mail endpoint. Upgraded two major versions of the framework.
>
> **The numbers**
>
> | | Before | After |
> |---|---|---|
> | Structured data readable by search engines | none | valid on every page |
> | Largest image on the page | 708 KB, uncompressible | 69 KB |
> | Total image payload in the repository | 20.3 MB | 3.1 MB |
> | Home page rendering | uncached, every request | static, edge-cached |
> | Speed Index | 9.7 s | 0.9 s |
> | Primary CTA contrast | 2.22:1 (fails AA) | 5.43:1 |
> | Indexable pages | 4 | 11 |
> | Build time | ~30 s | 3.1 s |
> | Lighthouse, mobile | — | 96–100 across all four page types |
>
> Accessibility, best practices and SEO all score 100 on every page type. No
> horizontal overflow at any width from 320 px to 2560 px, and none at 200%
> zoom.
>
> **What we would do differently**
>
> Two of these bugs were invisible because nothing measured them. The font never
> rendering and the structured data never being read had both been live for
> months without anyone noticing, because everything *looked* fine. We now run
> Lighthouse budgets in CI, which would have caught the first within a day.
>
> **Stack:** Next.js 16, React 19, TypeScript, Tailwind, Vercel.

### Notes before publishing this

- **Re-verify the numbers on production** before it goes live. Mine were
  measured locally and on the pre-launch branch.
- It is legitimate and common for an agency to case-study its own site. It is
  also, right now, the only project you can publish without asking anyone.
- It is deliberately unflattering about the starting point. That is the
  strength: an agency willing to publish its own bad code is far more credible
  than one showing only polished outcomes. Do not soften it.

---

# Template for the client case studies

Aim for 600–900 words. Structure, in this order:

1. **One-line summary** — client, sector, what was built. This is what shows in
   the `/work` index.
2. **The problem** — in the client's words if possible. What was broken, what it
   was costing, why it mattered *then*.
3. **Constraints** — budget, deadline, existing systems, team size. Constraints
   are what make the work legible as engineering rather than decoration.
4. **What we did** — the approach, and one or two decisions that could have gone
   the other way. *This is the part CTOs read.*
5. **The hard part** — every project has one. Naming it is what separates a case
   study from a brochure.
6. **The outcome** — with a number. If there is no number, say what changed in
   concrete terms instead.
7. **What we would do differently** — always include this. It is the single
   highest-trust paragraph on the page.
8. **Stack and timeline.**
9. **Client quote**, if they will give one.

### Rules

- **A number in every case study.** "Faster" is worthless. "Report generation
  went from 40 seconds to under two" is a case study.
- **Name the client, or describe them precisely.** "A vehicle recovery company
  in Lagos operating 400 tracked units" beats "a leading logistics firm".
- **Never publish anything the client has not seen.** Send the draft. Get it in
  writing.
- **No adjectives.** Same rule as the rest of the site.

---

# The interview script

Answer these per project. Twenty minutes, voice notes are fine — the writing is
not your problem to solve.

**Context**
1. Who was the client, and what do they do?
2. When did the work happen, and how long did it take?
3. Who worked on it, and how many of you?

**The problem**
4. What was broken or missing before you started?
5. What was it costing them — money, time, customers, risk?
6. Why did they come to you rather than someone else, or rather than hiring?

**The work**
7. What did you actually build? Be specific — services, screens, integrations.
8. What was the stack, and why that stack?
9. **What was the hardest technical problem, and how did you solve it?**
10. What decision could have gone the other way, and why did you choose as you did?
11. What did you get wrong first and have to redo?

**The outcome**
12. What can you measure? Anything — users, response times, uptime, volume
    processed, hours saved, cost avoided.
13. What does the client say about it?
14. Is it still running? Are you still maintaining it?

**Permissions**
15. Can we name them? *(Both current clients already said yes.)*
16. Can we show screenshots? Which parts must stay hidden?
17. Will they give a two-sentence quote?
18. Will they take a reference call from a prospect? *(Worth more than
    everything else on this list combined.)*

---

## What to do with these once written

- `/work` — index of all case studies
- `/work/<slug>` — the individual study, with `Article` schema
- Link the relevant one from each service page. `/services/legacy-modernisation`
  should link to the modernisation case study; without that, the case studies
  are orphans and the service pages have no evidence.
- One paragraph and the headline number on the home page, beneath the proof band.

**Two case studies changes the site more than any redesign will.** It is the
difference between a company that says it builds software and one that visibly
has.
