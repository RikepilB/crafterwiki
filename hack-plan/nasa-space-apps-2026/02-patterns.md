---
title: "02 · Patterns and predictions"
---

# Patterns: what won at the last edition, and how it differs from other events

Queries: `crafterwiki event nasa-space-apps-2026`, `patterns --event-kind agency-open-data-challenge`,
`patterns --event-kind student-major-league`, `patterns --event-kind open-source-community`, three
`similar` profiles (see `03-angles.md`). Corpus state 2026-09-14.

## Sample

**n = 10** confirmed winners (the 2025 Global Winners), one edition, one event. Mechanism tags are
mostly curator inference; organizer- and team-stated claims are labelled in each record. Treat every
number below as a prior, not a law.

## Agency open-data challenge (NASA Space Apps 2025, n = 10)

| Winning mechanism | Count | Records |
|---|---|---|
| human-stakes | 5 | spacegenes-plus, pureflow, photonics-odyssey, zumorroda-x, quenaris |
| visible-engineering-depth | 5 | resonant-exoplanets, astro-sweepers, pureflow, gaia-leo, quenaris |
| expert-data-for-everyone | 4 | spacegenes-plus, skysense, hercode-space, zumorroda-x |
| place-based-specificity | 3 | photonics-odyssey, zumorroda-x, quenaris |
| cited-evidence-trust · inverted-approach · one-sentence-clarity · takes-action · trend-wave-timing | 2 each | |

| Judging lens played to | Count |
|---|---|
| challenge-relevance | 6 |
| impact | 5 |
| design-ux · originality · scientific-validity · technical-depth | 4 each |
| storytelling-pitch | 3 |

- **Build:** software 8, concept design 1, media/story 1, **custom hardware 0**.
- **AI in the product:** 5 of 10 used none. The rest: LLM API 2, trained or custom ML model 2, computer
  vision 1, generative media 1, unspecified 1. AI was rarely the reason a project won.
- **Submission package:** all 10 team pages carry a demonstration link and a project link; 9 of 10 link a
  deployed site or repository (the concept winner linked slides and a folder).
- **Team size:** one solo winner, four teams of 4, one of 5, four of 6.

## How this differs from other kinds of event

| Signal | Agency open data (n=10) | Student major league (n=6) | Open-source online (n=8) |
|---|---|---|---|
| Physical artifact | 0 | 4 | 0 |
| Cultural reference hook | 0 | 4 | 0 |
| Complete submission package (tagged) | 1 | 0 | 7 |
| Human stakes | 5 | 2 | 1 |
| Expert data made accessible | 4 | 0 | 0 |
| Top lens | challenge relevance | wow factor / technical depth | impact / technical depth |

**Reading:** the student-event playbook (hardware on the table, a pop-culture hook, a live “wait, it does
that?”) does not transfer. At the agency challenge, winners answered the challenge closely, made expert
data usable by a named person or place, and showed real depth — often without AI.

## Similar situations

| Angle shape | Nearest winners (score) | What they share |
|---|---|---|
| A · one-tap local decision | `skysense` (0.68), `quenaris` (0.57), `spacegenes-plus` (0.38) | earth observation; expert data for everyone; place specificity |
| B · stress test with live data | `resonant-exoplanets` (0.64), `pureflow` (0.47) | visible depth; cited evidence; live real-world proof |
| C · play the stakeholder | `zumorroda-x` (0.79), `hercode-space` (0.46) | familiar thing, new job; human stakes; storytelling lens |

Every shape has a 2025 winner as its nearest neighbour: these shapes *can* win, and judges have *seen*
them. The edge has to come from combination and specificity, not from the shape.

## Crowded lanes

Unknown. With a winners-only roster the corpus cannot say how many of 11,500+ submissions built a
weather app or a farming game. Curator inference: “personal weather/climate app” is the most obvious
reading of Earth-observation challenges, so assume it is common and plan an edge.

## Update: two editions (2026-09-14)

The 2024 Global Winners were indexed as a holdout after this file was written
(`docs/research/holdout-nasa-2024.md`). Agency sample now n = 20.

| Signal | 2025 | 2024 | Total |
|---|---|---|---|
| expert-data-for-everyone | 4 | 8 | 12 |
| visible-engineering-depth | 5 | 5 | 10 |
| human-stakes | 5 | 1 | 6 |
| place-based-specificity | 3 | 2 | 5 |
| Custom hardware | 0 | 0 | 0 |
| No AI in the product | 5 | 4 | 9 |
| LATAM award winners | 3 | 3 | 6 |

Reading: accessible expert data and visible depth held; human stakes did not. The angle verdict in
`03-angles.md` is revised accordingly.

## Pre-registered predictions for the 2026 Global Winners

Written 2026-09-14, before 2026 challenges exist. Grade in January 2027 by tagging the 2026 winners with
the same taxonomy from NASA's announcement and team pages. Baseline in brackets is the 2025 value.

| # | Prediction | 2025 |
|---|---|---|
| P1 | At most 1 of 10 winners builds custom hardware | 0 |
| P2 | At least 4 of 10 winners carry `human-stakes` or `place-based-specificity` | 5 |
| P3 | At least 3 of 10 winners have no AI in the product | 5 |
| P4 | At least 2 of 10 winning deliverables are a story, game or concept design rather than a conventional software product | 3 |
| P5 | At least one challenge produces 2 or more Global Winners | yes (3) |
| P6 | At least 9 of 10 winner pages name specific NASA datasets and link a demonstration | 10 |
| P7 | At least 2 of the 3 awards Best Storytelling, Art & Technology and Most Inspirational go to a story, game, concept design or crafted interactive experience rather than a data tool | 3 of 3 (2024: 3 of 3) |
| P8 | The Local Impact winner carries both `human-stakes` and `place-based-specificity` | yes (2024: yes) |

P7–P8 were added on 2026-09-14 after the 2024 holdout and before any 2026 challenge exists; P1–P6 are
unchanged. P7–P8 test the award-first step proposed in `03-angles.md`.

Context prior (not a harness claim): LATAM teams won 3 of 10 awards in 2025.
