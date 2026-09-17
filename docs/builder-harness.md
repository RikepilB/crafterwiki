# General builder harness

## Goal

Use CrafterWIKI's source-labelled references to improve problem selection, ideation and
demo-first planning for any hackathon or independent build. Winning references inform
hypotheses; they do not establish why a project won or predict a team's odds.

## Architecture and scope

CrafterWIKI remains the evidence library. A builder run is a separate local workspace,
usable by a person or any coding assistant without installing a plugin. Event-specific
rules, rubrics, dates and required technologies belong to the run's brief, not the core.
Independent projects use user outcomes and acceptance criteria instead of award categories.

The existing `/hack-plan` stays available. The first general entry point is the
dependency-free CLI `plan <slug> --mode project|hackathon`. It creates editable documents,
not a completed plan, agent execution engine, or permission to start event work.

## Evidence behind the direction

- Existing `commands/hack-plan.md` and ADR-004 already order recon → patterns → angles →
  judge review → demo → architecture → build plan.
- The existing holdout in `docs/research/holdout-nasa-2024.md` did not support the recommended
  idea shape. Preserve counterexamples and rejected alternatives, not just winner imitation.
- Generalize execution roles, timed scope cuts, integration checks, validity review,
  rehearsal and handoffs from the sibling Space Apps harness's approach. Do not copy its
  event rules, dataset catalogue, award assumptions or private material into this project.

## Priority plan

1. **Local foundation (this change):** portable workspace generator, explicit project/event
   modes, source ledger, three-angle comparison, demo and build gates, operational runbook,
   regression tests for input safety and preservation of existing work.
2. **Evidence-assisted runs:** attach public corpus records with source indexes, placement,
   claim basis, sample size and event-kind filters. Rank by stated relevance, not win odds.
   Acceptance: a non-NASA event and an independent project each produce a usable shortlist;
   unknown rules and incomplete rosters remain visible. No private overlay export.
3. **Execution and review:** machine-readable gate status, checkpoint/resume and bounded
   role adapters using the same run documents. Acceptance: blocked event work cannot advance,
   a failed integration triggers a scope cut, and fabricated sources fail review.
4. **Behavioral evaluation before distribution:** compare assisted and baseline planning on
   held-out events and independent projects. Grade source accuracy, distinctness of ideas,
   feasibility, demo clarity and decision usefulness; record time/cost and failures.
   Deterministic tests alone do not prove better ideas or cross-harness compatibility.

## Start a run

From the CrafterWIKI root:

```sh
node cli/crafterwiki.mjs plan my-build --mode project
node cli/crafterwiki.mjs plan my-event --mode hackathon --event nasa-space-apps-2026
```

Default output: gitignored `builder-runs/<slug>/`. `--out <directory>` selects a parent
directory. Existing run directories are refused. A known `--event` is only a corpus pointer;
it does not verify current rules. Never publish a run without reviewing its personal data.

Open the generated `README.md` and work through the numbered documents. Give an assistant
the run directory and ask it to complete the next unresolved stage using cited evidence.
Commands in these documents run from CrafterWIKI's root. No external tools are installed.

## Operating contract

| Stage | Decision and exit evidence |
|---|---|
| Brief | Beneficiary, problem, constraints, team capability, success test; event rules with primary URL and verification date where applicable |
| References | Relevant records and counterexamples, source/basis labels, transfer limits; unknowns explicit |
| Angles | Three structurally different options, alternatives, riskiest assumption, keep/merge/kill rationale |
| Demo | One sentence, visible outcome, real versus mocked behavior, fallback and acceptance test |
| Build | Minimal architecture after demo selection; dependency order, owners, integration spike, cut lines, freeze and rehearsals |
| Review | Actual test evidence, source/claim audit, submission or release checklist, remaining risks and next action |

Use Lead, Evidence, Build and Demo/Review responsibilities; one person can own several.
These are responsibilities, not an instruction to spawn agents. At each checkpoint record
the current outcome, failing assumption, next cut and owner. Rehearse the actual demo twice.
Capture planned versus actual results after the event/build to improve future references.

Unknown or prohibitive event rules hold architecture and implementation until resolved.
Independent builds need no invented event or judging rubric. Generated templates describe
these gates; programmatic gate enforcement is a later milestone. No claim of higher win
rates, live model evaluation, release or installation is made by this foundation.
