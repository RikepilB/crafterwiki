# Winning patterns — second read (v0.2, 2026-09-14)

Generated from the corpus with `crafterwiki patterns` (overall and `--event-kind`). **Small sample,
not causal.** Mechanism tags are mostly `curator-inference`; organizer- and team-stated claims are
marked in each record. Re-run after every coverage sprint.

## Samples

| Event kind | Confirmed winners/finalists | Events | Extra signal |
|---|---|---|---|
| agency-open-data-challenge | 20 | NASA Space Apps 2025 (10 Global Winners), 2024 (10, indexed as a holdout) | Five-criterion rubric, 10 named awards, three-phase judging |
| student-major-league | 6 | Hack the North 2025 (4 finalists), UofTHacks 11 (1st, 2nd) | Full HTN rubric + 31 judges |
| open-source-community | 8 | Solo.io MCP & AI Agents 2026 | Organizer comments per winner |
| sponsor-platform | 1 | Croma GOV-TECH AI 2026 | Complete 12-project roster + organizer takeaways |
| startup-accelerator | 0 | Platanus 24/25/26 | 49 submitted (2026), public-vote counts (2025) |
| invite-residential | 0 (5 featured) | SOON | Judge/speaker profile |

Total: 35 confirmed. Unstratified totals are dominated by NASA Space Apps (20 of 35) and one
open-source event (8 of 35) — always stratify.

## By event kind

### Agency open-data challenge (n = 20, NASA Space Apps 2024 and 2025)

| Mechanism | 2025 | 2024 | Total |
|---|---|---|---|
| expert-data-for-everyone | 4 | 8 | 12 |
| visible-engineering-depth | 5 | 5 | 10 |
| complete-submission-package | 1 | 6 | 7 (tagged more generously in 2024; see caveats) |
| human-stakes | 5 | 1 | 6 |
| place-based-specificity | 3 | 2 | 5 |
| one-sentence-clarity | 2 | 3 | 5 |
| trend-wave-timing | 2 | 3 | 5 |
| cited-evidence-trust | 2 | 2 | 4 |

Lenses: challenge relevance 11, design/UX 11, impact 9, scientific validity 8, technical depth 8,
storytelling 7. Build: software 17, concept design 2, media/story 1, **custom hardware 0**.
AI: **9 of 20 had no AI in the product**; ML model 5, LLM API 4, generative media 3.
LATAM teams won 3 of 10 awards in both editions.

Award by award (post hoc, two winners each): Best Storytelling, Art & Technology and Most Inspirational went
to a story, game, concept or crafted interactive experience in both years (6 of 6); both Local Impact
winners named a person and a place; the other awards show no consistent shape.

Holdout: hypotheses written from the 2024 challenge list alone, then scored on the 2024 winners — the
agency playbook beat the other playbooks and chance, but only through `expert-data-for-everyone`; the
recommended angle did not hold (`holdout-nasa-2024.md`).

### Student major-league (n = 6)

| Mechanism | Count | Records |
|---|---|---|
| physical-artifact | 4 | dum-e, s-kbd67, ross, furme |
| demo-first-wow | 4 | dum-e, s-kbd67, ross, furme |
| cultural-reference-hook | 4 | dum-e (Iron Man), ross (Bob Ross), furme (Furby), s-kbd67 (Nerf) |
| one-sentence-clarity | 4 | dum-e, speakeasy, s-kbd67, furme |
| visible-engineering-depth | 4 | dum-e, speakeasy, ross, basic-web |
| theme-native-twist / familiar-thing-new-job / tight-scope-finished / human-stakes | 2 each | |

Lenses: technical-depth 4, wow-factor 4, originality 3, impact 2. Build: hardware 4/6.
AI: computer vision 4, voice 4 — and **2 of 6 used no AI** (S-KBD67 finalist, BASIC Web 2nd place).
Rubric evidence: HTN 2025 lists WOW factor, technical ability, originality, design; judges are
overwhelmingly founders/CTOs.

### Open-source community, online (n = 8)

| Mechanism | Count |
|---|---|
| complete-submission-package (blog + video + repo cited by organizer) | 7 |
| sponsor-platform-mastery | 5 |
| visible-engineering-depth | 4 |
| trend-wave-timing | 3 |

Lenses: impact 5, technical-depth 5, sponsor-api-use 3. AI: agent 6, MCP server 4. Build: software 7/8, no hardware.
Note: one track winner is a long-time contributor to the organizer's project — prior contribution is an advantage.

### Sponsor platform (n = 1 winner, 12 roster)

Centinela: dual-use value, takes action (drafts the legal information request), cited evidence,
autonomous monitoring. Organizer takeaways: 7/12 teams chose procurement; every team crossed several
official sources (table stakes, not a differentiator); almost every team built its own
counter-explanation — "the judgment used to read the data becomes the product".

### Startup accelerator (Platanus; no confirmed results yet)

- **Public vote is winner-take-most** (Platanus 25): #1 took 771 of the top-14's 2,625 votes (29%); the
  top 3 took 74%. For vote-judged events, pitch reach and community mobilization are a lens of their own.
- **2026 saturation:** Buenos Aires — vertical AI 8, future 7, AI security 6, agentic money 4 (25 items);
  Bogotá — emergencies 7, simulations 7, access 6, AI security 4 (24 items). AI security was **10 of 49**
  submissions across both stops; agent-payments ideas 6 of 49.
- WOKI (Bogotá, Emergencies — the joint most crowded track) is analyzed from its public page only:
  hardware plus an offline-first promise. Placement unknown.

## Cross-cutting findings

1. **Playbooks differ by event kind — partly confirmed on unseen winners.** Physical artifacts won 4 of 6 at
   student events and 0 of 20 at NASA Space Apps; cultural hooks 4 of 6 versus 0 of 20. On the 2024 holdout
   the agency playbook scored 1.6 mechanisms per winner, the open-source playbook 1.4, the student one 0.8
   — but without `expert-data-for-everyone`, which the 2024 challenges asked for, the agency set scores
   0.8. Unconfirmed until a blind re-tag and a second holdout.
2. **Visible engineering depth is the one mechanism strong everywhere** (4/6 student, 4/8 open-source,
   10/20 agency). Plan one moment in the demo that *proves* depth.
3. **AI is not required.** 2 of 6 student winners and 9 of 20 agency winners had no AI in the product.
4. **At agency challenges, make expert data usable by non-experts** (12 of 20) — partly because the
   challenges ask for it, so it is table stakes rather than an edge.
5. **Human stakes are not stable across editions** (NASA: 5 of 10 in 2025, 1 of 10 in 2024). Use them where
   the award rewards them (Local Impact, 2 of 2), not as a rule. At student events they make engineering
   legible (ROSS).
6. **Pick the award, then the shape** (post hoc, two winners per award): storytelling, art and inspiration
   awards went to stories, games, concepts or crafted experiences 6 of 6. Pre-registered for 2026.
7. **Crowded lanes are winnable with an edge**: autonomy/action and dual use (Centinela, 7 of 12
   teams in the same lane).
8. **Trust is a feature** in data-heavy domains: citations, published error against ground truth,
   self-limiting explanations (`centinela`, `2plant`, `resonant-exoplanets`).
9. **Scope the demo, not the ambition**: ROSS reached the finals with its colour feature cut from the demo.

## "Similar situation" examples

| Situation | Query | What the corpus says |
|---|---|---|
| Agency open-data challenge (NASA Space Apps) | `patterns --event-kind agency-open-data-challenge` · `similar --mechanism expert-data-for-everyone` | expert data for non-experts plus visible depth; choose the target award first; no hardware needed |
| Govtech/public-data event with a required API | `similar --domain govtech-transparency --lens impact,sponsor-api-use` | `centinela` (grand-winner): compete on autonomy + next action + dual use, not on search |
| Storytelling/wow-heavy student event | `patterns --event-kind student-major-league` | physical artifact, cultural hook, one sentence, live wow |
| Technical judges (CTOs, engineers) | `similar --lens technical-depth --mechanism visible-engineering-depth` | `basic-web`, `dum-e`, `speakeasy`, `agentgateway-identity-control-plane` |
| AI for payments / agentic money | `search --domain agentic-payments --include-entries` | 6 submissions, **0 confirmed winners** → unvalidated lane; borrow adjacent winning mechanisms: takes-action, cited-evidence-trust, relatable-demo-wrapper (`mcp-store`) |
| Agent security in 2026 | `search --domain ai-security --include-entries` | 10/49 LATAM submissions; confirmed wins only in the open-source event (`k8s-mcp-governance`, `mcp-store` runner-up) — make the guarantee visible in a familiar app |
| Online judging | `patterns --event-kind open-source-community` | invest in video + blog + repo as the demo |

## Caveats

- n = 35 confirmed; NASA Space Apps contributes 20 and one open-source event 8. Nothing here is
  statistically significant.
- Mechanisms are curator-tagged. The 2024 NASA records were tagged by the author of the holdout
  hypotheses; a blind re-tag is planned.
- `complete-submission-package` was applied to 6 of 10 NASA 2024 winners but 1 of 10 in 2025 under a
  stricter reading; the tagging audit (plan Step 2.4) starts there.
- No confirmed jury results yet for startup-accelerator events.
- Winners-only rosters (HTN, UofTHacks, NASA, Solo) cannot show base rates.

## Data needed next

Platanus 26 results (accelerator n = 0 → usable), the other 8 HTN 2025 finalists, NASA Space Apps 2023,
Cal Hacks 12.0 or TreeHacks as a second holdout on another event kind, a second sponsor-platform event, and
LATAM events from the hack0 index.
