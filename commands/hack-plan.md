---
description: Plan a hackathon demo-first — recon the event, match patterns from past winners, pick a unique angle, script the demo and pitch, and only then design the architecture and build plan.
argument-hint: <event URL or CrafterWIKI hackathon slug> [team notes]
---

# /hack-plan

Plan for: $ARGUMENTS

You are orchestrating the CrafterWIKI harness. Follow the phase order exactly; it is the product
(see `docs/adr/ADR-004-demo-first-harness-phase-order.md` in the plugin root). Do not choose a tech
stack or architecture before Gate 2 is approved.

**CLI:** `node <plugin root>/cli/crafterwiki.mjs <command> --json` (plugin root = the directory
containing `.claude-plugin/`; `${CLAUDE_PLUGIN_ROOT}` when available). If the user has run `npm link`,
`crafterwiki` works too.

**Output folder:** `hack-plan/<event-slug>/` in the current working directory. Write each phase file
before starting the next. If the folder exists, read it and resume from the first missing file.

## Phase 0 — Intake (ask only what you cannot infer)

Collect: event link or slug; team size and skills; available hardware; languages the pitch will be in;
hours available; must-use sponsor tech; anything the team already wants to build. In a fast/autonomous
session, assume sensible defaults and list them at the top of `01-recon.md`.

**Rules check:** does the event forbid work before it starts, or are the challenges still unpublished?
If so, run Phases 1–2 fully, Phase 3 in rule-limited mode (problem families and angle shapes, no
solutions), and scope Phases 5–6 to constraints and legitimate preparation. Event rules beat this command.

## Phase 1 — Recon → `01-recon.md`

Use the **event-scout** agent (skill: `hackathon-recon`). Requires: rubric and lens weights (explicit or
inferred and labelled), judge profile, prizes and stackable sponsor lanes, submission requirements,
constraints, saturation, and domain data availability.

## Phase 2 — Patterns → `02-patterns.md`

Use the `crafterwiki-query` skill: `event <slug>` if indexed; `patterns --event-kind <kind>`;
`similar` with the event's top lenses; `search` for the team's initial ideas. Report sample sizes and
stratify by event kind. Name crowded lanes and the mechanisms that won inside crowded lanes.

## Phase 3 — Problems and angles → `03-angles.md`

Use the `demo-first-ideation` skill (phases 1–3). Produce ≥ 6 problems and 3 structurally different
angles with: one sentence, live demo moment, human stakes, mechanisms (taxonomy ids), nearest corpus
neighbours and how this differs, lens fit, the one thing that must work, cut list.

## Gate 1 — Judge panel → append to `03-angles.md`

Use the **judge-panel** agent. Keep, merge or kill. Loop back to Phase 3 at most once.

## Phase 4 — Demo script and pitch → `04-demo-script.md`

Use the **pitch-coach** agent with the kept angle. Include timing, the live moment, what is real vs
mocked, fallback plan, and the one-sentence repeatability test.

## Gate 2 — User approval

Show the one sentence, the live moment and the script summary. Stop and wait for explicit approval.
In autonomous mode, record the assumption and continue — **unless** event rules forbid pre-event work or
the challenge is not yet known; then Gate 2 stays closed and Phase 5 records only constraints.

## Phase 5 — Architecture → `05-architecture.md`

Only the system required for the demo path. Diagram, components, data flow, stack chosen for team
skill and speed, risky integrations with a spike plan, what stays a slide.

## Phase 6 — Build plan → `06-build-plan.md`

Parallel roles from hour one; dependency order; single-device bottleneck check; hourly timeline with
code freeze, two full rehearsals, submission packaging (video/repo/write-up for online judging) and sleep.

## Close

Summarize the plan in ≤ 10 lines with file links. Offer: after the event, run `wiki-curate` to record
planned vs actual outcome.
