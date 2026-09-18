# Decisions log

Newest first. Full records in `docs/adr/`.

| Date | ADR | Decision |
|---|---|---|
| 2026-09-18 | — | Owner decisions: never merge unless every check passed. `main` is protected — CI, Vercel and CodeRabbit must pass on an up-to-date branch, enforced for administrators; no force pushes or deletion. With `main` now containing everything live, merges to `main` deploy production automatically. |
| 2026-09-18 | — | Brand: Space Grotesk (self-hosted, OFL) for the wordmark and page titles; single-colour orange wordmark; warm black base `#100e0b` with the "Crimson Veil" aura behind the landing hero only. Deploys: the Vercel Git integration builds `web/` through `vercel.json` so pull requests get working previews; automatic production deploys from `main` stay off (`git.deploymentEnabled.main: false`) until `main` contains all live work, including the projects-explorer redesign. Production stays a manual `web/dist` deploy; `.vercelignore` guards the repository root. |
| 2026-09-16 | — | Owner decisions: publish as a public repository at `github.com/RikepilB/crafterwiki`; MIT for code and CC BY 4.0 for the corpus (LICENSE, LICENSE-DATA); the NASA Space Apps 2026 harness run is published with it. |
| 2026-09-14 | — | Harness validation: a pre-registered holdout backtest is the primary test of ADR-004; forward predictions are a secondary stability check. First run (NASA Space Apps 2024): patterns step partially held (margin from one challenge-driven mechanism), angle recommendation did not ([results](research/holdout-nasa-2024.md)). |
| 2026-09-14 | [ADR-009](adr/ADR-009-zero-dependency-mcp-server.md) | Zero-dependency stdio MCP server over `cli/query.mjs`, declared in the plugin manifest. |
| 2026-09-14 | [ADR-008](adr/ADR-008-public-repo-private-overlay.md) | Public repo; interview material only in gitignored `private/` overlay; build, web and MCP serve `publicCorpus()`. |
| 2026-09-14 | [ADR-007](adr/ADR-007-astro-static-web-wiki.md) | Astro static site in `web/` (own dependencies); browser reuses `cli/query.mjs`. |
| 2026-09-14 | — | Owner decisions: public and standalone (not a Crafter-branded product); dogfood event NASA Space Apps 2026; store team size now, member names deferred; web stack Astro. |
| 2026-09-14 | [ADR-006](adr/ADR-006-primary-sources-only.md) | Primary sources only; Hall of Hacks and awesome lists are pointers to index, never data. |
| 2026-09-14 | [ADR-005](adr/ADR-005-access-surfaces-and-plugin-layout.md) | One zero-dep query library behind CLI, static API, MCP and plugin; repo root is the plugin root. |
| 2026-09-14 | [ADR-004](adr/ADR-004-demo-first-harness-phase-order.md) | Harness order: recon → patterns → angles → judge gate → demo script → approval → architecture → build plan. |
| 2026-09-14 | [ADR-003](adr/ADR-003-provenance-placement-and-basis.md) | Placement status, sources and analysis basis are mandatory and validated. |
| 2026-09-14 | [ADR-002](adr/ADR-002-hybrid-roster-and-analyzed-records.md) | Rosters inline in event files; analyzed projects promoted to one file each. |
| 2026-09-14 | [ADR-001](adr/ADR-001-flat-file-corpus.md) | Flat JSON corpus in git as source of truth; database deferred until community writes. |
