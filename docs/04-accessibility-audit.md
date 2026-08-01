# Accessibility audit — WCAG 2.2 Level AA

Audited by source review, rendered-HTML inspection and automated testing.
Lighthouse Accessibility went from the pre-existing baseline to **100** on both
mobile and desktop. Automated tools catch roughly a third of real barriers, so
the manual findings below matter more than the score.

## Findings

Severity: **Blocker** = makes a task impossible for some users · **Serious** =
makes it significantly harder · **Moderate** = degrades experience ·
**Minor** = polish.

### Blockers — all fixed

**A1 · Tools dropdown was unreachable by keyboard.** The trigger was a `<div>`
with no `tabIndex`, and the menu opened on `:hover` only. Keyboard and switch
users could not reach the colour generator or the site generator at all.
*WCAG 2.1.1 Keyboard.* → Real `<button>` with `aria-expanded`, `aria-haspopup`,
`aria-controls`, click-to-open and Escape-to-close.

**A2 · Primary CTAs failed colour contrast.** White text on `#34C759` measures
**2.22:1** against a 4.5:1 requirement. Every conversion button on the site
failed, as did all green text on white. *WCAG 1.4.3 Contrast (Minimum).*
→ New `primary-accessible` token `#23863C` at 4.60:1, same hue and saturation.
`#34C759` retained where it passes (6.61:1 on the dark services background).

**A3 · Carousel could not be paused.** Slides auto-advanced every 6 s with no
pause control, no reduced-motion handling, and a reset-on-interaction that made
it impossible to finish reading a slide. *WCAG 2.2.2 Pause, Stop, Hide* and
*2.3.3 Animation from Interactions.* → Pauses on hover and on focus, never
autoplays under `prefers-reduced-motion`, and arrow keys navigate.

**A4 · Off-screen content stayed focusable.** The mobile menu and the three
inactive carousel slides were only faded and translated, not removed. Keyboard
users tabbed into invisible links; screen readers announced all four slide
headings and CTAs simultaneously. *WCAG 2.4.3 Focus Order, 1.3.2 Meaningful
Sequence.* → `aria-hidden` plus `tabIndex={-1}` on everything currently hidden.

**A5 · Six unlabelled social links in the footer.** Icon-only anchors with no
accessible name — announced as "link, link, link…". *WCAG 2.4.4 Link Purpose.*
→ `aria-label="Trajectra on LinkedIn (opens in a new tab)"` on each.

### Serious — all fixed

**A6 · No skip link.** Every page forced keyboard users through the full header
before reaching content. *WCAG 2.4.1 Bypass Blocks.* → Skip link that becomes
visible on focus.

**A7 · No `<main>` landmark on the homepage,** and two `<nav>` landmarks after
hydration from the duplicate navbar. *WCAG 1.3.1 Info and Relationships.*
→ One `<main>`, one header, uniquely-labelled navs.

**A8 · Heading order started at `h3`.** The four carousel headings were `h3`,
the sole `h1` appeared afterwards in a mid-page section, and `AboutUsCards`
declared `aria-labelledby="mission-section"` pointing at a *commented-out*
heading — a dangling reference. *WCAG 1.3.1, 2.4.6.* → `h1 → h2 → h3`, verified
in the rendered HTML.

**A9 · Form errors were visual only.** No `aria-invalid`, no `aria-describedby`,
no focus movement on failed submit. A screen-reader user pressing "Send Message"
received no indication that anything had failed. *WCAG 3.3.1 Error
Identification, 3.3.3 Error Suggestion.* → `aria-invalid` + `aria-describedby`
wiring, focus moves to the first field in error, and messages now say what to do
rather than what is wrong ("Please enter your email address" vs "Email is
required").

**A10 · `<button>` nested inside `<a>` in the carousel.** Invalid HTML;
assistive tech is given two conflicting controls for one action.
→ Single anchor.

**A11 · Non-interactive cards were tab stops.** `AboutUsCards` set `tabIndex={0}`
on each card, adding three empty stops to the tab order. *WCAG 2.4.3.* → Removed.

### Moderate — all fixed

**A12 · Focus indicators relied on the browser default,** which is invisible
against several of the site's backgrounds. *WCAG 2.4.7, and 2.4.11 Focus Not
Obscured (new in 2.2).* → Explicit `focus-visible:outline` with offset on every
interactive element, colour chosen per surface.

**A13 · Carousel dots were `<span>` with `onClick`.** Not focusable, not
operable by keyboard, invisible to assistive tech, and a 32×4 px hit area
against WCAG 2.2's new **2.5.8 Target Size (Minimum)** of 24×24.
→ Real `<button>`s with `aria-current`, padded to a 24 px hit area while the
visible pill keeps its shape.

**A14 · Decorative images carried meaningful `alt`.** Hero images repeated their
heading verbatim; service icons had both an `alt` *and* `aria-hidden="true"`,
which contradict each other. → `alt=""` with `aria-hidden` for genuinely
decorative art; text carries the meaning.

**A15 · Motion was unconditional.** Two `animate-pulse` blobs, hover scale
transforms and JS smooth-scrolling all ran regardless of user preference.
*WCAG 2.3.3.* → `motion-safe:` variants plus a global
`prefers-reduced-motion` block in `globals.css`.

**A16 · Phone required in the contact form.** Not strictly a WCAG issue but a
real barrier — and a conversion cost. → Optional, and labelled as such.

**A17 · Dark-mode media query broke the page.** Covered in the codebase audit.
Users with a dark OS saw a black frame around a white page. → Removed.

## Remaining, deferred to the redesign

**R1 · No focus trap in the mobile menu.** Focus moves into the panel on open
and Escape closes it, but Tab can still leave the dialog. Full trapping needs a
focus-management utility; queued with the redesign rather than hand-rolled now.
*Impact: moderate. WCAG 2.4.3.*

**R2 · The `h1` is visually hidden.** Legitimate for a carousel hero with no
stable headline, but the better answer is a static hero with a visible,
brand-led `h1`. See the UI/UX report.

**R3 · Contrast on secondary surfaces not exhaustively audited.** `#C4C4C4`
(`surface`) and `#ACACAC` (`border`) pass for their current non-text uses but
would fail if either is ever used behind text. The redesign should collapse the
nine near-grey tokens into a proper scale with documented contrast pairs.

**R4 · No testing with real assistive technology.** Everything above is source
review plus automated checks. Before declaring conformance, run the homepage and
the contact form through VoiceOver + Safari and NVDA + Firefox. This is the only
way to catch the last third of issues.

## Verified contrast ratios

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `#34C759` | white | 2.22:1 | ✗ — no longer used for text on white |
| `#23863C` | white | **4.60:1** | ✓ AA normal text |
| `#34C759` | `#1F2937` | **6.61:1** | ✓ AA — kept for the services section |
| `#1F2937` | white | **14.68:1** | ✓ AAA |
| `#6B7280` | white | **4.83:1** | ✓ AA |
| `#515151` | white | **7.94:1** | ✓ AAA |
| `#858383` | white | 3.77:1 | ✗ for normal text — large text only |
