# ADR-004: Demo-first phase order for the planning harness

## Context

Richard's hypothesis (from a friend): think first about problem, solution, presentation and pitch;
only then system design, architecture, stack and product. Evidence gathered on 2026-09-14:

- A private practitioner interview (anonymized, not published): designed the demo and its wow moment
  first, architecture after; a live real-world moment; enough clarity to sleep.
- Hall of Hacks guide: real problem, live demo, one sentence, familiar thing new job, opposite of the
  obvious, tiny scope, emotion, last hours on the demo.
- Hack the North 2025 rubric lists WOW factor first; sponsor rubrics (Cohere, Warp) repeat it.
- Counter-example (public post by a young hackathon winner): forcing hardware into an oversaturated
  problem lost — the problem must drive the solution.

## Decision

`/hack-plan` runs, with gates:

1. **Recon** — rubric → lens weights, judge profile, prizes and sponsor lanes, constraints, saturation.
2. **Patterns** — event brief, patterns for the event kind, similar situations.
3. **Problems → angles** — ≥ 6 problems; 3 structurally different angles, each with a one-sentence
   idea, a named live demo moment, human stakes, 2–4 mechanisms, nearest corpus neighbours.
4. **Judge-panel gate** — score angles against the rubric; kill, merge or keep.
5. **Demo script + pitch** — 2–3 minute storyline with a fallback for the live moment.
6. **User approval gate.**
7. **Architecture** — only the system needed for the demo path; the rest is a slide.
8. **Build plan** — roles in parallel from hour one, single-device bottleneck check, code freeze,
   two rehearsals, sleep.

## Consequences

### Positive
- The expensive decision (what to build) is made against judging reality, not tech preference.
- Architecture is scoped by the demo, preventing kitchen-sink builds.

### Negative
- Risk of "demo theatre": polished pitch over real substance. Mitigation: live-real-world-proof and
  honest disclosure of mocked parts are part of the script template; judge panel penalizes fakery.
- Some events (open-source, online) reward packaging and platform depth over live wow. Mitigation:
  lens weights from recon change the angle scoring; online events get a video-first script.

### Alternatives Considered
- **Classic product flow (PRD → stack → build → pitch at the end):** the failure mode the practitioner
  interview warned about; loses hours and produces solution-without-problem.
- **Tech-first ("what can we build with sponsor X?"):** valid for sponsor lanes; kept as an input to
  angles, not the starting point.

## Status
Accepted (to be backtested in plan Phase 1.2)

## Date
2026-09-14
