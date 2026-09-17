# CrafterWIKI — Implementation plan

Format follows the `planner` agent contract (Goal → Relevant files → Risks → Steps → Open questions →
Complexity). Status is tracked per step.

## Goal

Build CrafterWIKI: a public, standalone, provenance-first wiki of hackathons, winners and submissions
analyzed by winning mechanism and judging lens, and a demo-first planning harness (problem → solution →
demo moment → pitch → *then* architecture) accessible through the web, CLI, MCP, static API and a
Claude Code plugin.

## Relevant Files Found

- `schema/taxonomy.json` — controlled vocabularies; the contract every surface depends on.
- `data/hackathons/*.json`, `data/projects/<event>/<slug>.json`, `data/leads/*.json` — the corpus.
- `cli/query.mjs` — pure validation and queries (browser-safe); `cli/lib.mjs` — loading, overlay, build.
- `cli/crafterwiki.mjs` — CLI; `mcp/tools.mjs`, `mcp/server.mjs` — MCP server.
- `web/` — Astro site (pages in `web/src/pages`, shared card markup in `web/src/lib/labels.mjs`).
- `test/lib.test.mjs`, `test/mcp.test.mjs` — 21 tests.
- `.claude-plugin/plugin.json`, `commands/`, `agents/`, `skills/` — harness plugin (declares the MCP server).
- `hack-plan/nasa-space-apps-2026/` — first dogfood run.
- `private/` (gitignored) — consent-gated overlay; never tracked.
- `docs/research/*`, `docs/architecture.md`, `docs/adr/*`, `docs/DEMO.md`.

## Risks & Considerations

- **Survivorship and small-n bias.** 35 confirmed winners across 4 event kinds (20 from NASA Space Apps); patterns must be
  stratified and labelled with sample size. Winners-only rosters (NASA, Solo) give no base rates.
- **Placement errors.** Summarizers mislabel galleries; voting pages look like results; press and local
  posts disagree with official counts (NASA finalists 40 vs 45). Mitigation: placement taxonomy,
  validator, official source wins, conflicts log.
- **Privacy in a public repo.** Git publishes files, not builds. Mitigation: `private/` overlay,
  `publicCorpus()` on every surface, tests (ADR-008). Team size only; names deferred.
- **Event rules vs harness.** Some events forbid work before the start (NASA Space Apps). The harness
  must stop at recon, patterns, angle shapes and legitimate pre-work.
- **Client-rendered sources.** Some organizer sites render only in a full browser; extraction tools
  return empty shells. Mitigation: use a real browser for public pages; record access notes.
- **Terms of service / copyright.** Facts + short paraphrase + link; never full write-ups; removal flow.
- **Taxonomy drift.** New event kinds need new lenses and mechanisms; add definitions first and audit.
- **Dependency upkeep in `web/`.** Astro and Vite upgrades need a build check (exact pin).
- **Harness over-engineering.** Keep `/hack-plan` under two hours; allow a fast mode.

## Implementation Plan

### Phase 0 — Foundation (status: **done 2026-09-14**)

Research and source audit; schema and taxonomy; seed corpus; CLI, tests and static API build;
harness plugin v0.

### Phase 0.5 — MVP (status: **done 2026-09-14, local only**)

#### Step M.1: Public/private split — done
- What: interview material moved to gitignored `private/`; overlay loader (`--private`); publish gates
  validated; public records rewritten from public sources; docs scrubbed of identifying details.
- Why: the owner chose a public repo; a build-only gate would still publish raw files (ADR-008).

#### Step M.2: Shared pure query module — done
- What: `cli/query.mjs` without Node built-ins; `lib.mjs` re-exports it.
- Why: identical semantics in CLI, MCP and browser (ADR-007, ADR-009).

#### Step M.3: MCP server — done
- What: 8 tools over `publicCorpus()`, stdio transport, declared in the plugin manifest; 5 tests.

#### Step M.4: Astro web wiki — done (not deployed)
- What: home, projects explorer, project pages, hackathon briefs, mechanisms, patterns, similar
  situations (with presets), deal me one, guide, harness-run pages, 404; JSON-LD; static API served.

#### Step M.5: NASA Space Apps corpus — done
- What: 2025 edition (rubric, 10 awards, judging phases, submission rules) with the 10 Global Winners
  analyzed from NASA's announcement and team pages; 2026 edition with timeline and rules; taxonomy
  additions (event kind, lenses, domains, mechanisms, AI patterns, build styles, source kind). 2024
  edition and its 10 Global Winners indexed as a holdout (Step 1.2).

#### Step M.6: Harness dogfood for NASA Space Apps 2026 — done up to the rule-limited gates
- What: `hack-plan/nasa-space-apps-2026/01…06`, pre-registered predictions, friction log and first skill fixes.

### Phase 1 — Dogfood the harness (in progress)

#### Step 1.1: Load the plugin per session — ready
- `claude --plugin-dir <repo>`; do not enable globally.

#### Step 1.2: Holdout backtest — done 2026-09-14; prediction check — January 2027
- What: hypotheses pre-registered from the 2024 NASA Space Apps challenge list and awards only, then the
  10 Global Winners indexed and scored (`docs/research/holdout-nasa-2024.md`). Result: the patterns step
  partially held — the agency playbook beat chance and the other playbooks, but the whole margin comes
  from one mechanism the challenge statements request, so the step is unconfirmed until the blind re-tag
  and a second holdout; the recommended angle did not hold. The 2026 predictions in
  `hack-plan/nasa-space-apps-2026/02-patterns.md` remain a secondary stability check (January 2027).
- Why: tests ADR-004 against winners the corpus did not contain.
- Next: blind re-tag of the 2024 records by a second tagger; a second holdout on another event kind
  (Cal Hacks 12.0 or TreeHacks 2026).

#### Step 1.3: Live run — NASA Space Apps 2026
- 2026-09-17: map challenge summaries onto the angle shapes; form the team (≤ 6, same Local Event).
- 2026-10-28: read full challenge statements; problem shortlist per candidate challenge (no building).
- 2026-11-13: confirm rubric and awards from the new guides; update the event record.
- 2026-11-14/15: run phases 3–6 for real; submit before 23:59 local time.
- After judging: `wiki-curate` planned vs actual (FR-15).

#### Step 1.4: Skill evaluation and fixes — first batch applied
- What: fixes from `docs/research/harness-dogfood-nasa-2026.md`; re-run on the next event.
- Proposed by the backtest, not applied: score angle shapes against the definition of the award they
  target, not only the generic rubric (tested first as predictions P7–P8).

### Phase 2 — Corpus expansion

#### Step 2.1: Devpost adapter
- What: gallery → project links → project page facts → draft records for curator review.

#### Step 2.2: Results-post adapter
- What: organizer results pages (Croma, Solo, NASA announcements) → structured placements.

#### Step 2.3: Coverage sprint
- What: NASA Space Apps 2023 Global Winners (2024 done); Space Apps LATAM local events; HTN 2025 finalists;
  Platanus 26 results; Hack the Valley 10; Cal Hacks 12; TreeHacks; hack0 LATAM index.
- Target: 30 events / 300+ items; ≥ 60 analyzed winners with at least 3 event kinds × 15 winners each.

#### Step 2.4: Tagging audit
- What: double-tag a 20% sample; reconcile disagreements into sharper definitions. Start with
  `complete-submission-package`, applied to 6 of 10 NASA 2024 winners but 1 of 10 in 2025.

### Phase 3 — Access surfaces

#### Step 3.1: Deploy site and static API — pending owner (host, domain)
#### Step 3.2: MCP server — done (M.3)
#### Step 3.3: CI — validate, `node --test`, `npm --prefix web run build` on every push
#### Step 3.4: OpenAPI for dynamic endpoints — only if static proves insufficient

### Phase 4 — Web wiki

#### Step 4.1: Design-intent pass — skipped for the MVP; run before launch
#### Step 4.2: Astro site — done (M.4)
#### Step 4.3: ES/EN copy
#### Step 4.4: `anti-slop-review`, `landing-audit`, `production-readiness` before launch

### Phase 5 — Community and governance

#### Step 5.1: Contribution flow — PR template + CI; a submission form and database only when PRs stop scaling
#### Step 5.2: License, removal requests and privacy policy

## Decisions taken (owner, 2026-09-14)

1. Public from day one.
2. Standalone project, not a Crafter-branded product.
3. Dogfood event: NASA Space Apps Challenge 2026.
4. Store team size now; member names later.
5. Web stack: Astro.

## Open Questions (needs user input)

1. **Hosting and domain** for the site and static API.
2. **NASA Space Apps 2026 team** — size, skills, Local Event (the plan assumes defaults).
3. **Member names policy** (deferred).

Answered 2026-09-16: license is MIT for code and CC BY 4.0 for the corpus; the repository is public at
`github.com/RikepilB/crafterwiki`, including the NASA 2026 harness run.

## Estimated Complexity

**High overall.** Phases 0 and 0.5 are complete. Phase 1 is Low–Medium but calendar-bound (Sep 17 →
Jan 2027). Phase 2 is Medium–High; Phases 3–4 are Low–Medium now that the surfaces exist.
