# CrafterWIKI

[![CI](https://github.com/RikepilB/crafterwiki/actions/workflows/ci.yml/badge.svg)](https://github.com/RikepilB/crafterwiki/actions/workflows/ci.yml)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA)

**Know why hackathon projects win before you pick your idea.**

CrafterWIKI is an open, provenance-first wiki of hackathons: the winners *and* what everyone else
built, each project tagged by the mechanisms that made it stand out and the judging lenses it played
to. A demo-first planning harness turns that evidence into a plan for your next event:
recon → patterns → angles → judge panel → demo script → *then* architecture.

Live website: **[crafterwiki.com](https://crafterwiki.com)**.
14 events, 36 analyzed projects and 88 additional roster entries. The site includes video
previews, original resource links, event/year/placement filters and a downloadable builder brief.
CLI, MCP server, static API and the existing Claude Code plugin remain available.

Next coverage work: [project and media acquisition plan](docs/coverage-and-media-plan.md).

## Surfaces

| Surface | Where | Start |
|---|---|---|
| Web wiki | `web/` (Astro, static) | `npm install` then `npm run dev` inside `web/` |
| CLI | `cli/crafterwiki.mjs` | `node cli/crafterwiki.mjs --help` |
| MCP server | `mcp/server.mjs` (stdio, zero dependencies) | `claude mcp add crafterwiki -- node <repo>/mcp/server.mjs` |
| Static API | `crafterwiki build` → `api/v0/*.json` | also served by the web build at `/api/v0/` |
| Claude Code plugin | repo root: `/hack-plan`, 4 skills, 4 agents, MCP server | `claude --plugin-dir <repo>` |

## Quick start

Requires Node ≥ 20 (the web site needs Node ≥ 22.12). The CLI and MCP server have no install step.

```bash
node cli/crafterwiki.mjs validate
```

```bash
node cli/crafterwiki.mjs event nasa-space-apps-2026
```

```bash
node cli/crafterwiki.mjs similar --mechanism expert-data-for-everyone --lens scientific-validity
```

```bash
node cli/crafterwiki.mjs patterns --event-kind student-major-league
```

```bash
node --test
```

Every CLI command supports `--json`.

## A real harness run

For a general builder workflow, start with the [builder harness plan and runbook](docs/builder-harness.md).
It supports independent projects and any hackathon through editable local workspaces:

```bash
node cli/crafterwiki.mjs plan my-build --mode project
node cli/crafterwiki.mjs plan my-event --mode hackathon
```

Open `builder-runs/<slug>/README.md`. Runs are gitignored and existing directories are never
overwritten. This is a workspace generator; evidence retrieval and gate decisions are manual.

`hack-plan/nasa-space-apps-2026/` is the `/hack-plan` output for NASA Space Apps 2026 (14–15 Nov 2026),
also rendered at `/plans/nasa-space-apps-2026/` on the site. The five-minute product demo is scripted in
[`docs/DEMO.md`](docs/DEMO.md).

## Repository map

| Path | What |
|---|---|
| `schema/taxonomy.json` | Controlled vocabularies: placement, basis, domains, mechanisms, lenses, AI patterns, event kinds… |
| `data/hackathons/` | Events with rubric, judges, prizes, tracks, timeline and roster entries |
| `data/projects/<event>/` | Analyzed projects with basis-labelled “why it stood out” |
| `data/leads/` | Unverified leads and coverage targets |
| `cli/query.mjs` | Pure validation and query logic, shared by CLI, MCP server and browser |
| `cli/lib.mjs`, `cli/crafterwiki.mjs` | Corpus loading, static build, CLI |
| `mcp/` | MCP tool handler and stdio server |
| `web/` | Astro site |
| `test/` | `node --test` suites (library, MCP) |
| `.claude-plugin/`, `commands/`, `agents/`, `skills/` | Harness plugin |
| `hack-plan/` | Harness runs |
| `docs/` | PRD, plan, architecture, ADRs, research, demo script |

## Principles

1. Primary sources only; other indexes are pointers.
2. Placement status and analysis basis on every claim — no fake podiums.
3. Winners *and* rosters, and base rates only from full rosters.
4. Demo before architecture.
5. Public by default; consent-gated material never enters the tracked tree (`private/` is gitignored).

## Is this accurate?

Every record names its sources and labels each claim as organizer-stated, team-stated or
curator-inference, so you can check it. Where results are unverified the record says so, and where a
roster is incomplete the tooling refuses to present counts as base rates. It is still a small,
hand-tagged corpus: 35 confirmed winners across four kinds of event, and the pattern claims say so
every time.

The harness's own advice has been tested once against winners it had never seen
([holdout](docs/research/holdout-nasa-2024.md)): the event-kind patterns partly held, the recommended
idea shape did not, and the plan changed as a result.

## Contributing

Corrections, new events and new projects are all welcome — start with
[CONTRIBUTING.md](CONTRIBUTING.md) for the sourcing rules (primary sources only, placement honesty,
team size instead of names). Please also read the [code of conduct](CODE_OF_CONDUCT.md).

## Corrections and removal

If a record about your project is wrong, or you want it taken down, open an issue with the
"Correction or removal request" template — removal is honored on request, no justification needed.
Prefer to ask privately? Open a
[security advisory](https://github.com/RikepilB/crafterwiki/security/advisories/new). Details in
[SECURITY.md](SECURITY.md).

## Licenses

- **Code** (`cli/`, `mcp/`, `web/`, `test/`, `skills/`, `agents/`, `commands/`) — MIT, see [LICENSE](LICENSE).
- **Corpus** (`data/`, `schema/`, and the same data served through the API and MCP server) —
  CC BY 4.0, see [LICENSE-DATA](LICENSE-DATA). Credit as:
  *Hackathon data from CrafterWIKI (https://github.com/RikepilB/crafterwiki), CC BY 4.0.*

Linked write-ups, images and videos belong to the teams and organizers who made them; this project
links and paraphrases rather than republishing them.
