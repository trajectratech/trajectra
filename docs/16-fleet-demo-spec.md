# Flagship demo: live fleet tracking platform

A public, permanently-running map showing thousands of vehicles moving in real
time — with geofencing, alerts and trip replay. No signup, no sales gate.

This is the flagship in [14-tool-strategy.md](./14-tool-strategy.md). That
document originally ranked six free report tools; all six were withdrawn on
2026-08-03 after the client asked whether an AI agent could simply do them. It
could — one of them was demonstrated in-session. This is the only item from that
list that survived, and the reason it survived is worth stating precisely.

---

## Why this survives when the report tools did not

The test that killed the others:

> **Is it doing a job the user would otherwise ask an AI to do?**

A report tool is. A CTO can point a coding agent at their own repository and get
a better answer than any questionnaire could produce. The audience for these
tools — technical buyers — is exactly the audience that already has the agents.

**This is not doing a job for anyone.** Nobody visits it to get something done.
They visit to answer one question: *can these people build hard things?* A system
that has streamed five thousand vehicles at sixty frames a second, without
falling over, since March, answers that. Uptime is the evidence, and uptime
cannot be generated on demand.

That is also why an AI helping to *build* it changes nothing. The proof is not
that the code exists — it is that the system has persisted, under load, in
public, with someone accountable for it.

**It is unfakeable, and it invites inspection.** A technical evaluator will open
devtools, watch the WebSocket frames, check the frame rate, and try to break it.
That is the entire point. It is one of the few artefacts that gets *more*
convincing the harder a sceptic pokes at it.

**It is anchored in a vertical you already serve.** Top Car Tracker Recovery
Solutions and Cartracker Plus Telematics are both in this space. This is not a
speculative side project — it is a public demonstration of work you already do,
which means it doubles as a case study and shortens every sales conversation in
that vertical.

**It is the only idea on the list that legitimately opens the government door.**
Fleet and asset tracking is a real public-sector procurement category — transit
authorities, waste collection, emergency services, agricultural extension. You
have been asking about government buyers; this is the credible route in, because
it arrives as a demonstration rather than a tender response.

---

## What the visitor sees

Landing on the URL, with no signup and no loading spinner longer than a second:

- A map of a real city with **~5,000 vehicles moving smoothly**, not jumping
- Click any vehicle → speed, heading, current trip, follow mode
- **Draw a geofence** with the mouse → live enter/exit alerts within a second
- **Scrub a timeline** back through the last 24 hours and watch the fleet replay
- A live counter: *vehicles tracked · updates/second · bytes/second to your browser*
- **"Add your own device"** — a QR code that opens on their phone, streams their
  own GPS into the same pipeline, and puts them on the map within seconds —
  **visible only in their own session, never to other visitors**

That last one is the whole credibility argument in a single interaction. The
obvious objection to any demo is *"this is fake"*. Letting a visitor put
themselves into it answers that before they finish forming the thought.

### The privacy design, which the first draft of this document got wrong

An earlier version of this spec said the visitor's device "appears on the map"
without qualifying it. **That would have broadcast a stranger's live coordinates
to everyone viewing a public demo.** Someone testing it from their home would be
publishing their home address to the internet. That is a real harm, not a
theoretical compliance point.

The design must be:

- **Private to the session.** The visitor sees their own device on their own
  map. No other viewer ever sees it. This still proves the pipeline is real —
  they watch themselves move — without publishing anything.
- **Explicit, informed consent.** The browser permission prompt is not enough on
  its own. State plainly what is collected, where it goes, and for how long,
  before requesting permission.
- **Ephemeral by default.** Positions held in memory for the session, never
  written to the history store, deleted on disconnect.
- **One-tap stop**, always visible while streaming.
- **HTTPS only**, which the Geolocation API requires anyway.

Handled this way it is a strong feature and a good advertisement for how you
treat data. Handled the way the first draft implied, it is a liability and
arguably a NDPR/GDPR breach.

---

## The engineering, and why each part is hard

This is the section to publish. The demo gets attention; **this** is what makes a
CTO trust you.

### 1. Bandwidth — the actual problem

5,000 vehicles at 1 Hz is 5,000 messages per second per viewer. Naive JSON at
~100 bytes each is **500 KB/s to every connected browser**. Unusable on a Lagos
connection, unusable on mobile anywhere.

Getting that to ~20 KB/s requires four things stacked:

- **Viewport culling** — only send vehicles inside the client's current bounding
  box, updated as they pan
- **Zoom-dependent aggregation** — below a zoom threshold, send server-side
  clusters with counts instead of individuals
- **Delta encoding** — send changed fields, not full objects
- **Bit-packed binary frames** — quantised lat/lng deltas, heading in one byte,
  speed in one byte

That progression, measured and written up honestly, is a genuinely good
engineering blog post. It is also the thing most teams get wrong.

### 2. Rendering 5,000 moving things at 60fps

DOM markers die at a few hundred. This needs **MapLibre GL with a custom WebGL
layer** or deck.gl, updating GPU buffers in place rather than recreating layers
each frame. Decode runs in a **Web Worker** so the main thread never blocks.

### 3. Interpolation — why it looks real

Updates arrive at 1 Hz; the display runs at 60 fps. Rendering raw positions
makes vehicles teleport once a second, which looks broken.

The fix is **client-side dead reckoning**: project each vehicle forward along its
heading and speed between updates, then smoothly correct when the true position
arrives. This is the same problem multiplayer games solve, and it is the single
detail that separates "a demo" from "a product". Most fleet dashboards on the
market get this wrong and it is immediately visible.

### 4. Geofencing at rate

Continuously answering *"which vehicles are inside which polygons?"* for many
geofences across 5,000 moving points. An in-memory spatial index (R-tree or grid
hash) for the live path, PostGIS for persistence and complex queries. Entry and
exit events must fire within a second.

### 5. Time-series at volume

5,000 vehicles at 1 Hz is **432 million points per day**. Naive inserts will not
survive it. **TimescaleDB hypertables** with compression, plus downsampling —
trip replay at city zoom does not need per-second fidelity, so paths are
simplified server-side (Douglas–Peucker) per zoom level.

### 6. Fan-out and backpressure

Two hundred concurrent viewers cannot each trigger their own 1 Hz query. One
simulation loop writes to shared state; the WebSocket gateway filters per
connection. Slow clients must be dropped frames rather than allowed to back up
memory.

### 7. Simulation that is not embarrassing

Vehicles must follow **real roads**. Routes generated over OpenStreetMap data via
OSRM, with realistic speeds, stops, dwell times and traffic variance. A demo
where vehicles drive through buildings is worse than no demo — it tells a
technical viewer you did the easy 80% and stopped.

---

## Architecture

```
 OSRM route gen ──┐
                  ▼
        Simulation service (Node)        Real device ingest API
        5k vehicles, 1 Hz tick   ◄────── (same schema, open endpoint)
                  │
                  ▼
        Redis  ── current state + pub/sub
                  │
     ┌────────────┼─────────────┐
     ▼            ▼             ▼
 Geofence     WebSocket     TimescaleDB
 engine       gateway       (history, compressed)
 (in-mem      (viewport
  spatial      filtering,
  index)       binary deltas)
                  │
                  ▼
        Browser: MapLibre GL + WebGL layer
        Web Worker decode · dead-reckoning interpolation
```

Everything is in the stack you already sell: **TypeScript, Node, Postgres**,
plus Redis and TimescaleDB. That consistency is itself a signal — you are
demonstrating the thing you would actually build for a client, not a one-off in
an unfamiliar stack.

---

## Scope

### MVP — the version that sells

- Live map, 5,000 simulated vehicles, smooth at 60 fps
- Vehicle detail and follow mode
- Draw-a-geofence with live enter/exit alerts
- 24-hour trip replay with a scrubber
- "Add your own device" via phone GPS
- Live stats bar (updates/sec, bytes/sec)
- **A `/how-it-works` page** with the architecture and the bandwidth numbers

### Deliberately excluded from v1

Auth, multi-tenancy, an alert-rules engine, reports, driver scoring, native
mobile apps, billing. Every one of those is what you build *for a client*. Ship
none of them in the demo — they add months and impress nobody.

### Later, if it becomes a product

Multi-tenant with auth, configurable alert rules, driver behaviour scoring,
maintenance scheduling, fuel and route analytics, hardware integrations
(Teltonika, Queclink), native apps. Realistic SaaS pricing in this market is
**$2–8 per vehicle per month**, which is a real business at a few thousand
vehicles.

---

## Effort — revising my earlier estimate

**I said 8–10 weeks. That was optimistic and I should correct it.**

| Scenario | Realistic time to a strong public v1 |
|---|---|
| Two engineers, focused | 7–9 weeks |
| One engineer, full time | 13–16 weeks |
| One engineer, 3 days/week (the allocation I recommended) | **~4–5 months** |

The bandwidth work and the rendering layer are each a solid two weeks on their
own, and both are the parts you cannot cut without losing the entire point.

**Ongoing:** roughly $50–150/month to run, and it must never be down. A broken
flagship demo is worse than no demo — it actively argues against you.

---

## Honest risks

**It is simulated, and someone will say so.** Have the answer ready and put it on
the page: *"Simulated telemetry, real pipeline. Point your own device at it."*
The ingest endpoint being open and documented is what makes that credible rather
than defensive.

**Do not use client data. At all.** Vehicle positions are personal and
commercially sensitive. Even with written permission from Top Car Tracker or
Cartracker Plus, publishing live positions of real vehicles is a bad idea —
it exposes their customers' movements. Simulated only. This is not a
conservative reading; it is the only defensible one.

**It is a permanent operational commitment.** Unlike a report tool, this runs
24/7 and is publicly visible when it breaks. Budget for monitoring and someone
on call, or do not start.

**It will not rank in search.** Effectively zero SEO value — nobody searches for
this. Its distribution is Hacker News, LinkedIn, sales calls and word of mouth.
That is a real limitation and the reason to *also* keep one cheap report tool
for organic lead flow.

---

## How it converts

**On the site**

- The demo at `/demo/fleet` — full value, no gate
- The engineering write-up at `/work/fleet-tracking-demo` — *this is the
  portfolio piece*; the demo proves you can build, the write-up proves you can
  think
- **A new service page: real-time and IoT systems.** You currently sell build,
  modernise and embed. This demo justifies a fourth capability page, and that
  page is where demo traffic converts

**In sales.** Open it on the call. For any prospect within a hundred miles of
logistics, telematics, asset tracking or field operations, the conversation
changes immediately.

**In distribution.** The bandwidth write-up — *"500 KB/s to 20 KB/s: streaming
5,000 vehicles to a browser"* — is a genuine Hacker News front-page candidate.
That is not true of any report tool.

**With AI systems.** A detailed, honest technical write-up of a hard problem is
exactly the sort of source an LLM cites when asked how to build real-time
tracking. That is how you become recommended rather than merely legible.

---

## Recommendation

Build this **second**, not first.

Ship **Rewrite or Refactor?** first — three to four weeks, near-zero
maintenance, well-qualified leads, and it starts returning while this is still
being built. Then commit a protected allocation to the fleet platform as the
flagship.

And be honest with yourself about the allocation before starting. At three days
a week this is a four-to-five month project. It is worth it — but only if it
actually gets those days. A half-finished demo that goes dark in month three
costs more credibility than never starting.
