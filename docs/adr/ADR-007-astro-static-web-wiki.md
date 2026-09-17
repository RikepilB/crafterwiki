# ADR-007: Astro static site in `web/` for the public wiki

## Context

The corpus needed a human surface: feed, event and project pages, mechanism pages, patterns, the
"similar situation" finder, "deal me one" and a guide. Requirements: public and indexable (JSON-LD),
cheap to host, same query semantics as the CLI and MCP server, no server or database, and the core
library must stay zero-dependency (ADR-001, ADR-005). The owner chose Astro over Next.js on 2026-09-14.

## Decision

- A static Astro site lives in `web/` with its own `package.json` (Astro pinned exactly). The root
  package, `cli/` and `mcp/` keep zero runtime dependencies.
- Pages read the corpus at build time through `cli/lib.mjs` and render `publicCorpus()` only.
- Pure validation and query logic moved to `cli/query.mjs` (no Node built-ins). Client scripts import
  it directly, so search, similar and deal in the browser run the CLI's exact code over
  `/data/corpus.json`.
- `npm run build` in `web/` first emits the static API into `web/public/api/v0` (gitignored), so the
  deployed site also serves the read API.
- One card markup function (`web/src/lib/labels.mjs`) is used for server-rendered lists and client
  results, so both always match.

## Consequences

### Positive
- No server, no database; any static host works. Pages are plain HTML with small islands of script.
- A change to query semantics lands once and shows up in CLI, MCP and web together.

### Negative
- The site depends on Astro and Vite; upgrades need a build check. Mitigation: exact pin, dependency
  confined to `web/`.
- Client search downloads the full public item list; fine up to a few thousand items (see
  architecture scalability plan for the index-shard step).

### Alternatives Considered
- **Next.js static export:** heavier runtime and conventions for a content site; owner preferred Astro.
- **Render HTML from the CLI with templates:** zero dependencies but reimplements routing, bundling
  and dev server.

## Status
Accepted

## Date
2026-09-14
