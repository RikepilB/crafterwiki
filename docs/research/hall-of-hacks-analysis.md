# Hall of Hacks — concept, structure, usefulness, gaps

Reviewed 2026-09-14 via public pages and a logged-in read of `/feed` (read-only). This note records
**structure and product lessons only**. Hall of Hacks' records and editorial prose are its own work;
CrafterWIKI never imports them (see [ADR-006](../adr/ADR-006-primary-sources-only.md)).

## What it is

"The ultimate feed for winning hackathon projects": a curated archive of winners from major
(mostly North American university) hackathons, each explained in plain language with a "why it won"
paragraph. Founded by a young, repeat hackathon winner (public profile).

## Coverage snapshot

| Measure | Value |
|---|---|
| Events indexed | 29 editions (Cal Hacks 12.0, TreeHacks 2025/2026, UofTHacks 2026, Hack the North 2025, QHacks, nwHacks, LA Hacks, HackHarvard, UC Berkeley AI, HooHacks, Call My Agent, MHacks, DubHacks, Hack the 6ix, YHack, TAMUhack, PennApps XXVI, ConUHacks, Hack the Valley, SwampHacks, Bitcamp, McHacks, Hack Western, VTHacks, HackPrinceton, StormHacks, HackGT, DeltaHacks) |
| Projects | 51 (1–6 per event) |
| Categories | AI/ML 38 · Software 29 · Hardware 22 · Games 15 · Health 14 · Social Good 12 · Dev Tools 6 · AR/VR 4 · Sustainability 4 (multi-label) |
| Geography | North America, student events, 2025–2026 editions |

Signals: ~75% of archived winners are tagged AI/ML and ~43% hardware — consistent with the HTN 2025
finalists we verified independently (3 of 4 have custom hardware).

## Information architecture

- **Feed (`/feed`)** — video-first grid like YouTube: thumbnail, award badge with field size
  ("1st out of 699 teams", "Finalists (261 teams)"), plain-language one-liner, event · month · category.
- **Left rail** — Home, History, Saved, Get the app, and the event list (acts as navigation + coverage proof).
- **Filters** — category chips; search box (`/feed?q=`, declared as a schema.org `SearchAction`).
- **"No idea? Deal me one"** — jumps to a random winner. Strong low-friction inspiration mechanic.
- **Classic view** toggle; **`/hackathons`** (teams count + winners archived per event);
  **`/categories`** (counts); **`/library`** / collections and saves behind sign-in.
- **Project page (`/project/<slug>`)** — video embed; Devpost / YouTube / GitHub links; Save;
  award · event · date; one-liner; **"Why it won"**; "Built by" (Devpost profiles); "Built with" tags;
  **"Up next"** recommendations; request-removal link in the footer.
- **`/guide`** — "How to win a hackathon", eight habits (summarized below).
- **SEO** — JSON-LD `CreativeWork` per project (headline = name + award + event, description =
  one-liner, abstract = why it won, award, image), Organization + WebSite graph, OG/Twitter cards,
  keyword-targeted titles ("50+ Winning Hackathon Project Examples").
- Thumbnails and builder links point to Devpost → Devpost is its upstream source.

## Why it is useful

1. **Calibration** — award + field size tells you how hard a win was.
2. **Plain-language framing** — every project explained so a non-expert gets it; this *is* the
   one-sentence test applied editorially.
3. **"Why it won"** turns a gallery into a lesson.
4. **Zero-friction inspiration** — Deal me one, Up next, video-first cards.

## Guide: the eight habits (paraphrased)

1. Solve a real problem, ideally your own. 2. Make the demo work live. 3. One-sentence idea.
4. Familiar thing, unexpected use. 5. Do the opposite of the obvious. 6. Scope tiny and finish.
7. Give judges something to feel. 8. Spend the last hours on the demo, not the code.

Independently corroborated by a private practitioner interview (demo-first, wow factor, live proof,
scoped enough to sleep; anonymized and not published). This agreement is the evidence base
for the harness phase order ([ADR-004](../adr/ADR-004-demo-first-harness-phase-order.md)).

## Gaps = CrafterWIKI's opportunity

| Gap in Hall of Hacks | CrafterWIKI response |
|---|---|
| Winners only — no base rates or saturation | Roster entries (`submitted-only`) per event: Platanus 26 Bogotá 24, Buenos Aires 25, Croma 12 |
| One "category" facet | Controlled facets: winning mechanism, judging lens, domain, AI pattern, build style, event kind |
| No judges, rubric or prizes per event | Event records carry rubric, judge profile, prizes and sponsor lanes → `crafterwiki event <slug>` |
| North-American student events only | LATAM (Platanus, Croma, hack0 index), sponsor-platform, open-source, residential formats |
| "Why it won" has no basis label | Every claim tagged `organizer-stated` / `team-stated` / `curator-inference`, with source index |
| Browse-only | CLI + static JSON API + Claude Code plugin; MCP server next |
| Inspiration stops at browsing | Demo-first planning harness: recon → patterns → angles → judge panel → demo script → architecture |

## Adopt / avoid

- **Adopt:** plain-language one-liner; award + field size; "why it won"; Deal me one (`crafterwiki deal`);
  Up next (`crafterwiki similar --to`); request removal; JSON-LD + SearchAction for the future web UI.
- **Avoid:** copying records or prose; treating it as a data source; winner-only survivorship bias.
