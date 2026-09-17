---
title: "06 · Preparation and hackathon plan"
---

# Build plan

Two parts: legitimate preparation until 13 November (no challenge work), and the plan for the
hackathon itself.

## Part 1 — Preparation (now → 13 November)

| When | Do | Not allowed |
|---|---|---|
| This week | Register; choose a Local Event (all members the same); read the Participant Terms & Conditions, including any rule on pre-existing code | — |
| 17 Sep | Read challenge summaries; shortlist three that fit the angle shapes; team formation opens — recruit the missing roles | Starting any solution |
| Sep–Oct | Skill drills on **past** data: each member creates an Earthdata login and pulls one dataset listed in `01-recon.md` (POWER, MODIS/Landsat indices, FIRMS, DONKI) into a throwaway notebook | Building toward a 2026 challenge |
| Sep–Oct | Prepare team tooling: shared drive, AI-use log template, screen-recording setup, a generic submission checklist | Designing screens for a challenge |
| 28 Oct | Read full challenge statements; pick the challenge; list problems on paper | Code, designs or data pipelines for it |
| 2 Nov | Join Space Apps Connect; ask Local Lead about schedule, venue network and judging format | — |
| 13 Nov | Read the Project Submission and Judging & Awards guides; update `01-recon.md` (rubric, video rules) and this plan | — |

## Part 2 — Hackathon (relative hours; fit to the Local Event schedule)

| Hour | Milestone |
|---|---|
| H0–H1 | Lock the challenge; fill the one sentence; run the judge-panel check again on the real challenge |
| H1 | **Gate 2** with the whole team: sentence, moment, script summary approved |
| H1–H3 | Spikes from `05-architecture.md` (data access, latency, validity signal) |
| H3–H14 | Core demo path; page skeleton started in parallel |
| H14–H18 | Integration on the demo region; fallback snapshot saved |
| H18–H24 | **Sleep in shifts** — nobody works more than one shift through the night |
| H24–H30 | Validity check visual; polish only what is on the demo path |
| H30 | **Code freeze** on the demo path |
| H30–H32 | Rehearsal 1 (timed, network off once); fix |
| H32–H35 | Record the demonstration video; write the page sections |
| H35–H36 | Rehearsal 2; final page read-through by someone who did not build it |
| ≥ 2 h before 23:59 local | **Submit** — then verify the page, links and video play from another device |

## Roles from hour one

| Role (4-person team) | Owns |
|---|---|
| Data lead | Dataset access, snapshot, validity signal |
| App lead | Demo path and deployment |
| Story/design lead | One sentence, page, video, visuals, AI disclosure log |
| Pitch/PM lead | Timeline, rehearsals, Local Event pitch, submission checklist |

With 5–6 people add a **science reviewer** (checks every claim on the page against the data) and a
**video editor**.

## Bottleneck check

| Single point | Mitigation |
|---|---|
| One Earthdata account or API key | Every member has their own account before the event |
| One laptop with the video editor | Export drafts to the shared drive every hour after H30 |
| One presenter | Second presenter runs rehearsal 2 |
| Live data feed or venue network | Cached snapshot + recording, disclosed if used |
| One person writing the page | Page sections assigned by owner at H3 |

## After the event

Run `wiki-curate` to record planned vs actual: which angle shape was used, what changed at Gate 2, and the
outcome at each judging phase. Grade the predictions in `02-patterns.md` when the 2026 Global Winners are
announced.
