# CrafterWIKI — Product Requirements (v0.1, 2026-09-14)

## Summary

CrafterWIKI is a wiki of hackathons, their winners and what everyone else built — analyzed by
*why* projects stood out — plus a **demo-first planning harness** that turns those patterns into a
plan for your next hackathon in hours, not a weekend of wandering. It is accessible to humans (web
wiki), to terminals (CLI) and to agents (static API, MCP server, Claude Code plugin). CrafterWIKI is a
public, standalone project.

## Problem

Teams lose the first 6–12 hours of a hackathon choosing an idea, then pick one that is crowded,
unclear, or impossible to demo. The knowledge of what wins is scattered across Devpost galleries,
results blog posts, voting pages and people's memories, and existing indexes (Hall of Hacks, awesome
lists) show only winners, only one region, with no rubric, no base rates and no workflow.

## Users and jobs

| User | Job to be done |
|---|---|
| Hackathon team (primary: builders in LATAM and North America) | "Given this event, its judges and our skills, pick an angle that can win and plan the demo before we code." |
| Solo builder browsing | "Show me winning projects like the one I have in mind and why they won." |
| Agent (Claude Code, other harnesses) | "Query structured evidence: similar situations, patterns by event kind, event rubric." |
| Curator (later: community contributors) | "Add an event and its results with provenance, fast, without breaking the schema." |
| Organizer/sponsor (secondary) | "See what past editions produced and what lanes are saturated." |

## Differentiation

1. **Winning-mechanism and judging-lens facets** — the "similar situation" lookup across different
   problems and stacks that share a pattern (storytelling-heavy, technical-heavy, AI-for-payments…).
2. **Base rates** — submitted-only rosters show saturation (e.g. 7 of 12 Croma projects did procurement).
3. **Event intelligence** — rubric, judge profile, prizes and sponsor lanes per event.
4. **Honesty labels** — placement status and analysis basis on every claim.
5. **Coverage beyond North-American student events** — LATAM, sponsor-platform, open-source, residential.
6. **Harness** — recon → patterns → angles → judge panel → demo script → architecture.
7. **Agent-first access** — CLI with `--json`, static API, plugin; MCP server next.

## Scope

### v0 (this foundation — delivered)

- Taxonomy + validated flat-file corpus (11 events, 16 analyzed projects, 88 roster entries, leads).
- CLI: validate, search, similar, patterns, event brief, deal, show, list, facets, build (static API).
- Claude Code plugin: `/hack-plan` command, 4 skills, 4 agents.
- Research docs, PRD, plan, architecture, ADRs.

### v0.2 MVP (delivered 2026-09-14, not deployed)

- Public/private split: consent-gated interview material only in a gitignored overlay (ADR-008).
- NASA Space Apps coverage: 2025 edition with the 10 Global Winners analyzed from NASA's announcement
  and team pages; 2026 edition with timeline and rules. New taxonomy values for agency open-data events.
- MCP server with 8 tools (ADR-009).
- Astro web wiki: home, projects explorer, project pages, hackathon briefs, mechanisms, patterns,
  similar situations, deal me one, guide, harness-run pages; JSON-LD; static API served (ADR-007).
- Harness dogfood run for NASA Space Apps 2026 up to the rule-limited gates.

### v1 (next)

- Deploy site and static API; ES/EN copy.
- Ingestion adapters (Devpost gallery + project pages; results posts) → ~30 events / 300+ items.
- Grade the NASA 2026 pre-registered predictions after winners are announced (January 2027).

### Out of scope (for now)

User accounts and social features; hosting videos; scraping behind logins or against site terms;
importing third-party editorial content; automated "why it won" generation without basis labels;
real-time event tracking; payments.

## Functional requirements

| ID | Requirement | v |
|---|---|---|
| FR-1 | Store hackathons with dates, format, kind, tracks, prizes, rubric, judge profile, sponsors, required tech, sources | v0 |
| FR-2 | Store analyzed projects with placement, team, problem, solution, demo moment, stack, AI patterns, domains, mechanisms, lenses, basis-labelled claims, lessons, sources | v0 |
| FR-3 | Store roster entries (name, tagline, track, placement, domains) inside the event | v0 |
| FR-4 | Reject any facet value not in the taxonomy; require sources and basis citations | v0 |
| FR-5 | Search by text and facets; winners-only filter never includes submitted/reported/featured/public-vote | v0 |
| FR-6 | Similar-situation lookup by facet profile or by an existing record | v0 |
| FR-7 | Pattern frequencies stratifiable by event and event kind, plus saturation per event | v0 |
| FR-8 | Event recon brief (rubric, judges, prizes, saturation, priors from same event kind) | v0 |
| FR-9 | Random inspiration ("deal me one") with filters and seed | v0 |
| FR-10 | Static read API build | v0 |
| FR-11 | Harness producing recon, patterns, angles, judge review, demo script, architecture and build plan files with approval gates | v0 |
| FR-12 | MCP tools: `search_projects`, `similar_situations`, `event_brief`, `patterns`, `deal`, `get_record`, `list_hackathons`, `list_facets` | v0.2 |
| FR-13 | Ingestion adapters with caching, rate limits and lead verification | v1 |
| FR-14 | Web UI with event, project, mechanism and guide pages; JSON-LD | v0.2 (EN only) |
| FR-15 | Record own hackathon outcome (planned vs actual) back into the corpus | v1 |
| FR-16 | Removal request flow for teams | v1 |

## Non-functional requirements

- **Provenance:** 100% of records have a primary source with `retrieved_at`.
- **Honesty:** every surface shows placement status and analysis basis; `curator-inference` is visible.
- **Agent-first:** all CLI commands support `--json`; schema documented; deterministic output with `--seed`.
- **Zero-dep core** until a dependency clearly pays for itself.
- **Privacy:** public names only from organizer/Devpost pages; interviews anonymized; removal honored.
- **Bilingual-ready:** LATAM sources stay faithful; UI copy ES/EN in v1.

## Success metrics

| Metric | Target |
|---|---|
| Time from "event announced" to approved angle + demo script using the harness | < 2 hours |
| Corpus coverage | 30 events / 300 items by v1 |
| Records with primary source | 100% |
| Harness dogfooded at a real hackathon | ≥ 1 by end of 2026 — chosen: NASA Space Apps 2026 (Nov 14–15) |
| Placement errors found in audits | 0 promoted without official source |

## Risks

See [plan.md](plan.md#risks--considerations).

## Open questions

See [plan.md](plan.md#open-questions-needs-user-input).
