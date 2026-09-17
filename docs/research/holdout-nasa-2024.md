# Holdout backtest — NASA Space Apps 2024 (pre-registered 2026-09-14)

Purpose: test ADR-004's claim that recon → patterns → angle shapes points at what wins, on winners the
corpus does not contain. The 2026 predictions in `hack-plan/nasa-space-apps-2026/02-patterns.md` only
test whether 2026 resembles 2025; this backtest tests the harness outputs themselves.

## Protocol

1. **Inputs frozen before any 2024 winner is read:** the 2025 corpus (n = 10 Global Winners), the harness
   outputs for 2026 (playbook mechanisms, angle shapes A/B/C, judge-panel verdict), and the 2024 challenge
   list (`spaceappschallenge.org/nasa-space-apps-2024/challenges/`, retrieved 2026-09-14). Award categories
   are assumed identical to 2025; checked when the winners are fetched.
2. **This file is written first.** Only then fetch the 2024 Global Winners announcement and team pages.
3. **Tag every winner against the whole taxonomy** (all 23 mechanisms, `schema/taxonomy.json` definitions),
   with a quoted or paraphrased evidence line per tag, and save the records under
   `data/projects/nasa-space-apps-2024/` **before** running the scoring script.
4. Score with a script over the saved records; report every hypothesis as pass or fail, including misses.

## Known threats (stated before grading)

- **Self-tagging.** The curator who tags 2024 winners wrote these hypotheses. Mitigation: whole-taxonomy
  tagging with evidence lines; a blind re-tag by a second tagger is the stronger fix and is not done here.
- **Contamination.** The model doing the tagging may have seen 2024 winner coverage in pre-training. The
  project had not read any 2024 winner page before this file.
- **Challenge and award design.** Many 2024 challenges ask for student or public materials, which pushes
  `expert-data-for-everyone` up regardless of the harness; the storytelling and art awards guarantee some
  media winners. H2 and H4 compare against the challenge mix for that reason.
- **n = 10.** One miss moves a rate by 10 points. Nothing here is statistically significant.

## Frozen playbooks (from `patterns --event-kind`, corpus 2026-09-14)

| Playbook | Mechanisms |
|---|---|
| Agency open data (n = 10) | human-stakes, visible-engineering-depth, expert-data-for-everyone, place-based-specificity |
| Student major league (n = 6) — five tied at 4, all kept | cultural-reference-hook, demo-first-wow, one-sentence-clarity, physical-artifact, visible-engineering-depth |
| Open-source online (n = 8) | complete-submission-package, sponsor-platform-mastery, visible-engineering-depth, trend-wave-timing |

## Frozen challenge mix (20 challenges eligible for global awards; "Create Your Own" excluded)

Deliverable a challenge statement asks for:

| Type | Definition | 2024 challenges | Share |
|---|---|---|---|
| D1 decision tool | user gives a place, person or parameters and gets a decision-ready answer (risk, recommendation, alert, schedule) | Community Mapping; Landsat Reflectance Data; Earth Observation for Agricultural Decision-Making; Greenhouse Gases in Your Neighborhood | 4/20 |
| D2 explorer / visualization app | interactive viewer without a decision output | Orrery Web App; Exosky!; HWO Navigator; Visualize Space Science | 4/20 |
| D3 game | playable game or interactive story | Galactic Games; GLOBE Protocol Games | 2/20 |
| D4 media / learning materials | video, music, collage, story, lesson plan, classroom materials | Chronicles of Exoplanet Exploration; Imagine our Connected Earth; May 2024 Geomagnetic Storms; Symphony of the Stars; Tell Us a Climate Story!; PACE in the Classroom; SDGs in the Classroom | 7/20 |
| D5 science pipeline | detection, model or analysis program | Seismic Detection Across the Solar System | 1/20 |
| D6 concept design | design of a world, mission or system | Beyond Sunlight | 1/20 |
| unclear | statement truncated on the page | Human Development & the Environment | 1/20 |

Winners are classified by what they delivered, not by the challenge they entered.

## Hypotheses

| # | Tests | Prediction | Pass if |
|---|---|---|---|
| H1 | patterns step | The agency playbook describes 2024 winners better than the other playbooks and than chance | mean agency-mechanism hits per winner > student playbook (5 mechanisms) **and** > open-source playbook, **and** ≥ 90th percentile of all 8,855 random 4-mechanism sets |
| H2 | angle shape A | Decision tools for a named place or person are over-represented among winners | ≥ 3 of 10 winners are D1 (challenge mix: 4/20 = 20%) |
| H3 | angle shape B (exploratory) | A visible validity check is common | ≥ 4 of 10 winners show output checked against observed data, ground truth, error metrics or a live feed |
| H4 | shape C ranked last | Game, media and concept deliverables are not over-represented | D3 + D4 + D6 winners ≤ 5 of 10 (challenge mix: 10/20 = 50%) |
| H5 | stability (secondary) | Build and AI priors hold | ≤ 1 winner with custom hardware **and** ≥ 3 winners with no AI in the product |

H1 and H2 are the ADR-004 tests. H3 has no 2025 baseline under this criterion, so it does not count toward
the verdict. H5 is a corpus-stability check, like the 2026 predictions.

## Results (scored 2026-09-14)

Records saved first: `data/projects/nasa-space-apps-2024/` (10) and `data/hackathons/nasa-space-apps-2024.json`.
Award categories matched 2025 (the storytelling award is named "Best Storytelling" in 2024).

| # | Result | Verdict |
|---|---|---|
| H1 | Mean playbook mechanisms per winner: agency 1.60, open-source 1.40, student (5 mechanisms) 0.80. The agency set is at the 98.4th percentile of 8,855 random 4-mechanism sets (best possible set: 2.20) | **Pass** |
| H2 | 2 of 10 winners delivered a decision tool (`waterwise`, `2plant`). `grow-team-io` is borderline — it answers wildfire facts for a place but gives no risk score; counting it gives 3 | **Fail** as registered |
| H3 | 2 of 10 show validation against ground truth (`quakeheroes`: held-out Moon and Mars events; `2plant`: error against probes and flux towers) | Fail (exploratory) |
| H4 | 3 of 10 delivered a game, media or concept (`eco-metropolis`, `terratales`, `landsat-connect`); 4 if `connected-earth-museum` counts as media | **Pass** |
| H5 | 0 custom hardware; 4 of 10 with no AI in the product | **Pass** |

### What each winner delivered

| Record | Award | Type | Validity check | AI in product |
|---|---|---|---|---|
| `skyshield-wmpgang` | Best Use of Science | D2 | — | none |
| `waterwise` | Best Use of Data | D1 | — | LLM API |
| `quakeheroes` | Best Use of Technology | D5 | held-out validation | ML model |
| `2plant` | Galactic Impact | D1 | error vs ground truth | none |
| `landsat-connect` | Best Mission Concept | D6 (designs a data-access tool) | — | none |
| `eco-metropolis` | Most Inspirational | D3 | — | none |
| `terratales` | Best Storytelling | D4 (with a game and a forecast model) | — | ML model, generative media |
| `asteroid-destroyer` | Global Connection | D2 | — | LLM API, ML model |
| `connected-earth-museum` | Art & Technology | D2 (borderline D4) | — | generative media |
| `grow-team-io` | Local Impact | D2 (borderline D1) | — | agent, voice |

2024 mechanism counts: `expert-data-for-everyone` 8, `complete-submission-package` 6,
`visible-engineering-depth` 5, `one-sentence-clarity` 3, `trend-wave-timing` 3; `human-stakes` 1,
`place-based-specificity` 2.

### What this says about ADR-004

- **Patterns step: partially held, unconfirmed.** H1 passed as registered: the agency playbook described
  unseen winners better than the other playbooks and chance. But the whole margin comes from
  `expert-data-for-everyone` (8 of 10), which many 2024 challenge statements ask for directly. Without it the
  agency set scores 0.80, below the open-source set (post hoc, not registered). Treat the step as unconfirmed
  until the blind re-tag and a second holdout on another event kind.
- **Two of the four agency mechanisms did not carry over:** `human-stakes` fell from 5 of 10 (2025) to 1 of 10;
  `place-based-specificity` from 3 to 2. One edition was not enough to call them the playbook.
- **Angle step: not supported.** The merged recommendation, "local decision with a live validity check",
  matched 2 of 10 winners on each half. Explorers and visualizations (D2) were the most common winning
  delivery (4 of 10).
- **What lined up instead (post hoc, n = 2 per award):** the award. Storytelling, Art & Technology and Most
  Inspirational went to a story, game, concept or crafted interactive experience in both years (6 of 6);
  both Local Impact winners carried `human-stakes` and `place-based-specificity`; the other awards show no
  consistent shape. Pre-registered as P7–P8 in `hack-plan/nasa-space-apps-2026/02-patterns.md` before
  anyone relies on it.

### Threats that materialized

- **Self-tagging.** H2 turns on one borderline classification (`grow-team-io`), made by the author of the
  hypotheses. A blind re-tag is the next step (plan Step 1.2).
- **Tag inconsistency.** `complete-submission-package` went on 6 of 10 2024 winners but 1 of 10 in 2025 under
  a stricter reading. It belongs to the open-source playbook, so it made H1 harder to pass, not easier.
  Audit in plan Step 2.4.
- **Contamination** cannot be ruled out.

### Changes made

- `hack-plan/nasa-space-apps-2026/03-angles.md`: verdict revised (award first; C promoted from reserve).
- `hack-plan/nasa-space-apps-2026/02-patterns.md`: two-edition numbers and predictions P7–P8 added; P1–P6 unchanged.
- Proposed harness change, not applied: score angle shapes against the target award's definition as well as
  the rubric (`docs/research/harness-dogfood-nasa-2026.md`, finding 10).
