---
name: demo-first-ideation
description: Demo-first hackathon ideation — problem, solution, the live demo moment and the pitch BEFORE any architecture or tech stack. Generates structurally different angles, checks them against past winners and event saturation, runs a judge-panel gate and produces the demo script, then scopes architecture to the demo path. Use for "help us pick a hackathon idea", "how do we stand out/win", "what should we build at X", "plan our demo/pitch". Do NOT use for event research (hackathon-recon), querying alone (crafterwiki-query), or implementing the build.
---

# Demo-first ideation

**Hard rule:** no stack, framework or architecture discussion until the demo script is approved (Gate 2).
Evidence for this order: `docs/adr/ADR-004-demo-first-harness-phase-order.md`.

Inputs: `01-recon.md` (lens weights, lanes, constraints, judging funnel, saturation), team skills, hardware, hours.

**Rule-limited mode:** if the event forbids pre-event work or the challenges are not yet published,
Phase 1 lists problem *families* (to map onto challenges later) and Phase 3 produces angle *shapes* keyed
to award lanes, with templates instead of solutions. Precedent: `hack-plan/nasa-space-apps-2026/`.

## Phase 1 — Problem shortlist (≥ 6)

For each: a specific person · the moment it hurts · the consequence · why this team is close to it ·
data/hardware access. Kill any "solution looking for a problem" and any problem you cannot say in one breath.

## Phase 2 — Evidence pass

For each surviving problem:
- `crafterwiki search "<terms>" --include-entries --json` — prior art and how many submitted it.
- `crafterwiki similar --domain <d> --lens <top event lenses> --json` — which mechanisms won nearby.
- Note crowded lanes. Crowded is not fatal (`centinela` won inside a 7-of-12 procurement lane; judge crowding only from full rosters) but requires a
  mechanism edge: autonomy/action, dual use, live real-world proof, physical artifact.

## Phase 3 — Three angles, structurally different

Different shapes, not variants (e.g. physical artifact vs autonomous agent vs inverted market side).
For each angle:

| Field | Requirement |
|---|---|
| One sentence | Repeatable by a judge; no jargon |
| Live moment | What judges see happen, real, within 20 seconds ("wait, it does that?") — in the room, or on the submission video/page when later judging phases review materials without the team |
| Human stakes | Who, and what changes for them |
| Mechanisms | 2–4 ids from `crafterwiki facets mechanisms` |
| Nearest neighbours | Corpus slugs + status, and how this angle differs |
| Lens fit | Score vs each recon lens, one line each |
| Must work | The single capability the demo depends on |
| Cut list | What stays a slide |

Mechanism prompts: familiar thing, new job (`s-kbd67`, `furme`) · opposite of the obvious / other side of
the market (`speakeasy`) · theme twist (`basic-web`) · cultural reference hook (`dum-e`, `ross`) · takes
action, not report (`centinela`) · relatable wrapper for infrastructure (`mcp-store`).

## Gate 1 — Judge panel

Run the `judge-panel` agent on `03-angles.md`. Keep one (or merge two). Loop back once at most.

## Phase 4 — Demo script

Run the `pitch-coach` agent → `04-demo-script.md` (timeline, live moment, real vs mocked, fallback,
stage plan, online variant).

## Gate 2 — Approval

Present: one sentence, live moment, 6-line script summary. Wait for approval (autonomous: record the assumption).

## Phase 5 — Architecture for the demo path → `05-architecture.md`

- Trace the live moment end to end; only components on that path get built.
- Prefer boring, reliable techniques in the live path (`dum-e` chose inverse kinematics over research
  models); replace flaky LLM steps with deterministic code before demo day (`ross`).
- Choose the stack the team already knows; spike the riskiest integration in the first 2 hours.

## Phase 6 — Build plan → `06-build-plan.md`

- Roles run in parallel from hour one (hardware vs backend split in `s-kbd67`).
- **Bottleneck check:** any single device, account, API key or person everything depends on? Duplicate
  it or plan independent tasks (a single Raspberry Pi stalled a winning team).
- Timeline: spike → core path → integration → code freeze → rehearsal 1 → fix → rehearsal 2 → submit.
  Schedule sleep. Online judging: reserve time for video, README and blog.

## Anti-patterns

Kitchen-sink features · hardware or AI added "because it wins" when the problem doesn't need it ·
unfinished feature inside the demo (cut it, call it next) · faked data presented as live · stack debates
before Gate 2 · treating submitted or public-vote projects as proof of what wins.
