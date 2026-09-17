# Harness dogfood: NASA Space Apps 2026 (2026-09-14)

First end-to-end run of `/hack-plan`, executed by following the command, skills and agent files as
written. Output: `hack-plan/nasa-space-apps-2026/`. This note records where the instructions were
ambiguous or wrong, and what was changed (plan Step 1.4).

## Findings

| # | Where | What happened | Severity | Fix |
|---|---|---|---|---|
| 1 | `commands/hack-plan.md` Gate 2 | “In autonomous mode, record the assumption and continue” would have produced a challenge-specific architecture before the event, which the event rules forbid | High | Phase 0 now checks pre-event work rules; Gate 2 stops when rules or missing challenges block it |
| 2 | `hackathon-recon` template | No place for multi-phase judging (local → SMEs → executives) or for whether the team is present | High | Added a “Judging funnel” step and template section |
| 3 | `hackathon-recon` lens mapping | Rubric criteria Validity and Relevance had no lens; the skill did not say what to do | Medium | Skill now says: add the lens to the taxonomy with a definition before writing recon |
| 4 | `hackathon-recon` step 8 | Data availability covered only LATAM govtech (Croma) | Medium | Generalized: list the datasets past winners used for agency open-data events |
| 5 | `demo-first-ideation` angle field “Live moment … in the room” | Two of three NASA judging phases review the submission without the team | Medium | Field now allows “on the submission video/page” when judging is remote or multi-phase |
| 6 | `demo-first-ideation` phases 1–3 | No guidance for events where challenges are unknown or pre-work is forbidden | Medium | Added rule-limited mode: problem families and angle shapes keyed to award lanes |
| 7 | `judge-panel` seen-before check | With a winners-only roster, “a winner did this” does not tell how crowded a shape is | Low | Agent now states crowding as unknown for winners-only rosters |
| 8 | `pitch-coach` online variant | Generic README/blog outline; the event has a fixed submission structure | Low | Mirror the organizer's submission sections when they are known |
| 9 | CLI `event` output | Printed “Judges (0):” when a judge profile exists without a judge list | Low | Fixed |
| 10 | Angle verdict vs unseen winners (`holdout-nasa-2024.md`) | The merged angle “local decision with a live validity check” matched 2 of 10 NASA 2024 winners on each half; `human-stakes` fell from 5/10 (2025) to 1/10 | High | NASA verdict revised in `03-angles.md`; proposed skill change (score shapes against the target award's definition) pre-registered as P7–P8, not applied |

## What worked

- Recon → patterns → shapes → judge panel produced a clear, evidence-backed direction in one pass.
- Stratified patterns changed the advice: the student-event playbook (hardware, cultural hooks) did not
  transfer; the agency-event winners emphasized relevance, stakes and accessible data.
- `similar` found the right 2025 neighbours for each shape, which made the seen-before check concrete.

## Not yet evaluated

- Phases 3–6 on a real challenge (14–15 November 2026).
- Whether the pre-registered 2026 predictions hold (January 2027).
- A blind re-tag of the 2024 holdout records by a second tagger.
