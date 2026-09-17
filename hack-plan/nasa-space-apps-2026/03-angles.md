---
title: "03 · Problems, angle shapes and judge panel"
---

# Problems and angle shapes

> **Rule-limited phase.** Teams may not work on 2026 challenges before 14 November, and the challenges
> are not public yet. This file holds problem *families* and structurally different angle *shapes*
> keyed to the award lanes — not solutions. On 2026-09-17 map each family to a challenge summary;
> drop families with no match.

## Problem families (≥ 6)

| # | Person · moment it hurts · consequence | Team proximity | NASA data |
|---|---|---|---|
| 1 | A smallholder farmer deciding when to plant or irrigate; a dry spell or heat wave wipes out the season | LATAM agriculture context | NDVI/EVI (MODIS, Landsat), POWER, drought monitors |
| 2 | A water utility or community in an Andean city watching springs dry up as vegetation cover is lost | LATAM, direct precedent (`quenaris`) | MODIS/Landsat indices, Earthdata |
| 3 | A family or school near a fire-prone area deciding whether to evacuate or close; smoke arrives before warnings | Seasonal fires in South America | FIRMS, air-quality products |
| 4 | A delivery rider, outdoor worker or event organizer planning the day; heat or storms hit mid-shift | Urban LATAM gig work | POWER, Earthdata weather variables |
| 5 | A teacher or student trying to make sense of space science data (exoplanets, space biology, space weather) | Education and community events | MAST, GeneLab, DONKI |
| 6 | An operator or regulator in low Earth orbit facing debris risk or connectivity gaps in remote regions | Business-framed challenge; 3 awards in 2025 | Orbital Debris Program Office tools, Space-Track |
| 7 | A pilot, grid operator or GNSS-dependent farmer affected by a solar storm without understanding it | Space-weather challenges recur | DONKI |

Killed now: any family that needs custom hardware (no 2025 precedent and no hardware assumed), and any
“platform for everything” without a named person.

## Evidence pass

- `search "weather"` → `hercode-space`, `pureflow`, `skysense` (all award winners).
- `search "satellite"` → `photonics-odyssey`, `zumorroda-x`, `quenaris` (all award winners).
- No base rates exist for this event (winners-only roster), so crowding is unknown; assume families 1
  and 4 are common readings of Earth-observation challenges.

## Angle shapes

### A · One-tap local decision

| Field | |
|---|---|
| One sentence (template) | “For [person] in [place], we turn NASA [dataset] into [one decision], with the evidence.” |
| Moment (live or on video) | A judge enters their own city and date and gets the decision, the dataset and its date, and how sure it is — in under 20 seconds |
| Human stakes | A named local user whose season, shift or water supply depends on the decision |
| Mechanisms | `expert-data-for-everyone`, `place-based-specificity`, `one-sentence-clarity`, `cited-evidence-trust` |
| Nearest neighbours | `skysense` (award winner): personal weather decision · `quenaris` (award winner): one named place and causal chain |
| How it must differ | SkySense's decision UX *plus* QUEÑARIS-level place specificity *plus* an explicit “how sure are we” — neither winner made uncertainty the feature |
| Lens fit | Impact 4 · Creativity 3 (seen before) · Validity 4 if uncertainty is shown · Relevance 5 on Earth-observation challenges · Presentation 4 |
| Must work | One real query over one NASA dataset for one region, fast |
| Cut list | Accounts, notifications, chat assistant, many regions |

### B · Stress test with live data

| Field | |
|---|---|
| One sentence (template) | “Design or predict [thing], then hit it with today's NASA [feed] and see whether it holds.” |
| Moment | The latest event from a live NASA feed changes the result on screen: a design fails, a false positive is rejected |
| Human stakes | A crew, operator or scientist about to make a costly decision |
| Mechanisms | `live-real-world-proof`, `visible-engineering-depth`, `cited-evidence-trust` |
| Nearest neighbours | `resonant-exoplanets` (award winner): false-positive checks · `pureflow` (award winner): live space-weather stress test |
| How it must differ | The failure is the demo: show it happen and explain it in one visual |
| Lens fit | Impact 3 · Creativity 4 · Validity 5 · Relevance 3 (fits only some challenges) · Presentation 3–4 |
| Must work | Live fetch plus a deterministic evaluation, with a cached fallback |
| Cut list | 3D polish, scenario editors |

### C · Play the stakeholder

| Field | |
|---|---|
| One sentence (template) | “You are [person]; real NASA data decides what happens to you.” |
| Moment | A judge plays 30 seconds and a real satellite image or data point changes the outcome |
| Human stakes | The character's livelihood or safety |
| Mechanisms | `familiar-thing-new-job`, `human-stakes`, `expert-data-for-everyone`, `place-based-specificity` |
| Nearest neighbours | `zumorroda-x` (award winner): farming game · `hercode-space` (award winner): children's story |
| How it must differ | The player's own place drives the level; otherwise it reads as a repeat of 2025 |
| Lens fit | Impact 3 · Creativity 3–4 · Validity 3 · Relevance depends on a story/game challenge · Presentation 5 |
| Must work | One playable scene on real data |
| Cut list | More levels, art beyond one scene |

## Judge panel (Gate 1)

### Personas

1. **Local judge** (mentor at a LATAM Local Event) — rewards a clear pitch, a working demo, local relevance.
2. **Earth-science SME** — rewards correct data use, stated uncertainty, a checkable method.
3. **Heliophysics / space-operations SME** — rewards physical plausibility.
4. **Executive committee member** — rewards stakes and memorability among 45 finalists.
5. **Science communicator** — rewards a page and video that explain it in a minute without the team.

### Scores (1–5, equal weights)

| Criterion | A | B | C | Justification (persona) |
|---|---|---|---|---|
| Impact | 4 | 3 | 3 | (4) A names a person and a place; B's stakes are indirect; C's are fictional |
| Creativity | 3 | 4 | 3 | (2) A is the obvious reading; B's live failure is less common; C repeats 2025 |
| Validity | 4 | 5 | 3 | (2) A holds only if uncertainty is shown; B is built around it; C simplifies |
| Relevance | 5 | 3 | 3 | (1) A fits most Earth-observation challenges; B and C fit fewer |
| Presentation | 4 | 3.5 | 5 | (5) C tells itself; B needs the failure to be visual |
| **Mean** | **4.0** | **3.7** | **3.4** | |

### Seen-before check

All three shapes have a 2025 award winner as nearest neighbour (`skysense`, `quenaris`;
`resonant-exoplanets`, `pureflow`; `zumorroda-x`, `hercode-space`). That proves the shapes win, and it
means the SMEs have seen them. Crowding among submissions is unknown (winners-only roster).

### Biggest objections

| Persona | Objection | Neutralizer |
|---|---|---|
| Earth-science SME | “Another weather app.” | Make trust the feature: show when the data should not be believed |
| Executive | “Why this place?” | One named community with a number that matters to it |
| Communicator | “I can't tell what it does from the page.” | First line of the page is the one sentence; video opens on the decision |
| Local judge | “Does it work or is it a mockup?” | Real query on stage; recorded fallback disclosed as such |

### Verdict

- **MERGE A + B → “Local decision with a live validity check.”** One place, one person, one decision from
  NASA data, plus a visible check of when that decision should not be trusted. Keeps A's relevance and
  stakes; borrows B's validity edge.
- **KEEP C in reserve** only if the chosen 2026 challenge asks for a story or a game *and* the team has an
  illustrator.
- **KILL B standalone:** its relevance depends on a narrow set of challenges.

## Revision after the 2024 holdout (2026-09-14)

The verdict above was tested on the 10 NASA Space Apps 2024 Global Winners, indexed after the hypotheses
were written (`docs/research/holdout-nasa-2024.md`).

- **Held across both editions:** expert data made usable by non-experts (12 of 20 winners), visible
  engineering depth (10 of 20), no custom hardware (0 of 20), AI optional (9 of 20 without AI).
- **Did not hold:** decision tools were 2 of 10 2024 winners and validated outputs 2 of 10; `human-stakes`
  fell from 5 of 10 to 1 of 10. “Local decision with a live validity check” is one option, not the direction.
- **New step on 2026-09-17 and 2026-10-28:** choose the target award before the shape, then score shapes
  against that award's definition as well as the rubric.

| Target award | What won in both 2024 and 2025 | Start from |
|---|---|---|
| Local Impact | a named person and place (`grow-team-io`, `quenaris`) | A |
| Best Storytelling · Art & Technology · Most Inspirational | a story site, game, concept design or crafted interactive experience (6 of 6) | C |
| Best Use of Science | an overlooked angle on expert data (`skyshield-wmpgang`, `spacegenes-plus`) | A, with B's check |
| Galactic Impact · Global Connection | a hard method shown on the page (visible engineering depth, 4 of 4) | B-style depth |
| Best Use of Data · Best Use of Technology · Best Mission Concept | no consistent pattern | decide on the challenge |

### Revised verdict

- **Default for Earth-observation challenges aiming at Local Impact or Galactic Impact:** A + B as above.
- **Promote C from reserve** to a first-class option when the team targets storytelling, art or inspiration
  — no longer conditional on the challenge asking for a game.
- **B's validity check** is a differentiator for science and impact awards, not a requirement.
- The award table is post hoc with two winners per award; it is pre-registered as P7–P8 in
  `02-patterns.md` and graded in January 2027.
