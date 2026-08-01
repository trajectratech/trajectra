# UI/UX evaluation and redesign recommendations

Nothing in this document has been implemented. The fixes shipped so far were
defects — contrast failures, keyboard traps, broken images. Redesign is a
product decision and needs your sign-off first.

## The core problem

**A visitor cannot tell what Trajectra does, who it does it for, or what makes
it different — and the page never asks them to do anything specific.**

Walk the current homepage as a CTO in Berlin evaluating vendors:

1. A full-screen carousel rotates four headlines every 6 seconds. By the time
   you have read one, it has changed. You learn that Trajectra does custom
   software, training, consulting, and "innovation" — four different companies.
2. Scroll: a gradient panel repeats roughly the same claim in different words.
3. "Who We Are": Mission, Vision, Values. Three paragraphs of abstractions
   ("integrity, innovation, and excellence") that every agency on earth also
   claims. You still do not know who works here.
4. "Our Core Services": six dense paragraphs of undifferentiated text. Every one
   is keyword-optimised prose written for a crawler, not a buyer.
5. Contact form.

**You never see:** a client name, a project, a number, a face, a
timeline, or a reason to choose Trajectra over the forty other agencies in the
same search results. There is no proof of anything.

## Friction points, ranked by revenue impact

**F1 · The hero says nothing specific.** Four rotating claims dilute into no
claim. Carousels are also a well-documented conversion failure — the overwhelming
majority of interactions land on slide 1, so slides 2–4 are effectively invisible
while still costing four image downloads.
→ **Replace with a static hero.** One headline naming the buyer and the outcome.
One primary CTA. One supporting image. This is the single highest-impact change
on the site.

**F2 · No proof of any kind.** No case studies, no logos, no testimonials, no
metrics, no team. The site asks an international buyer to wire five figures to a
company they cannot verify.
→ **A proof band directly under the hero,** and `/work` case studies. Even three
short ones ("Problem → What we built → Result") change the site's character
completely. If client names are under NDA, use anonymised profiles: "A Series-A
fintech in London."

**F3 · Services are paragraphs, not offers.** Six blocks of prose with no
scope, no price, no timeline, no differentiation.
→ **Turn each into an offer card:** outcome-led title, one-sentence promise,
"best for", indicative timeline, engagement model, link to a full page.
Timeline and scope do most of the qualifying work a price band would.

**F4 · Two competing CTAs with no hierarchy.** "Let's Talk", "Get a Free
Consultation", "Start Your Project", "Book a Consultation", "Let's Talk
Strategy" all point at the same booking page. Five labels, one destination.
→ **One primary action site-wide** — "Book a 30-minute call" — used verbatim
everywhere. One secondary — "See our work". Nothing else.

**F5 · The About section is the weakest page element and should be the
strongest.** For a Nigerian company selling to Europe and North America, "who
are you and can I trust you" is *the* question. Mission/Vision/Values answers
none of it.
→ **Replace with real people.** Photos, names, roles, years of experience,
GitHub/LinkedIn. Plus: CAC registration number, founding year, team size,
timezone overlap, and a contract/IP-assignment statement. Concrete facts, not
adjectives.

**F6 · The contact form is the only conversion path on the page and it is
buried at the bottom** behind six paragraphs of service copy.
→ Keep it, but the booking link should be the primary path. A form promises a
wait; a calendar promises a time.

**F7 · Nothing communicates timezone or working model** — the first practical
question a remote client asks.
→ State it plainly: "West Africa Time (UTC+1). Four hours of overlap with
London, six with New York."

## Visual system

**Typography.** Poppins at nine weights, four actually used, and none of it
rendering (see the performance audit). Poppins is a geometric sans that reads as
friendly-startup rather than serious-engineering. It is a defensible choice, but
if the positioning shifts upmarket, a more neutral grotesque (Inter,
Söhne, Geist) will carry more authority. Either way: define a real type scale.
Body copy currently ranges from `text-xs` to `text-xl` with no system.

**Colour.** The palette has eleven tokens, nine of which are near-greys with
overlapping roles (`brandGrey`, `brandMid`, `brandSemiMid`, `brandMuted`,
`brandAlt`, `brandSemiGrey`, `brandSoft`). Nobody can choose between
`text-muted` and `text-accent` correctly.
→ Collapse to a 9-step neutral scale plus one brand green in two variants
(the accessible one for light surfaces, the bright one for dark), each with a
documented contrast pair.

**Spacing.** Section padding varies between `py-16` and `py-20` arbitrarily;
inner containers switch between `max-w-7xl`, `max-w-4xl` and `max-w-xl` without
a rule.
→ One vertical rhythm (`py-24` desktop / `py-16` mobile), one content width
(`max-w-6xl`), one prose width (`max-w-2xl`).

**Hierarchy.** The mid-page CTA heading was `text-[1.2rem]` on mobile and
`text-5xl` on desktop — a 3.3× jump with nothing in between, and smaller than
the body text beside it on small screens. Symptomatic of ad-hoc sizing rather
than a scale.

## Proposed homepage structure

```
1  Hero            One headline. One sub. One CTA. One image.
                   "Custom software teams for companies that need to ship."
2  Proof band      Client logos, or "12 products shipped · 6 countries · since 2023"
3  Services        6 offer cards → 6 service pages
4  Case study      One flagship, told properly, with a number in it
5  How we work     4 steps, plus engagement models, typical timelines and
                   contract/IP terms. Removes the "what happens after I
                   email you" fear. No figures — pricing stays a
                   conversation, so this page does the qualifying instead.
6  Team            Real faces. The trust page.
7  FAQ             Timezone, contracts, IP, payment, what if it goes wrong
                   (also earns an FAQPage rich result)
8  Final CTA       Same words as the hero CTA.
```

## Principles for the rebuild

- **Specific beats impressive.** "We built a claims platform that cut processing
  from 5 days to 4 hours" outperforms "innovative solutions that drive growth"
  every time.
- **Show, don't adjective.** Delete every instance of world-class, cutting-edge,
  forward-thinking, innovative, seamless, and empower. Replace with a fact.
- **One page, one job.** Each page should have exactly one thing it wants the
  visitor to do next.
- **No animation without a job.** The two blurred pulsing blobs communicate
  nothing and repaint continuously. Motion should indicate state, not decorate.
- **Design for the sceptic.** The buyer's default is "this is probably not
  legitimate." Every element should reduce that suspicion.
