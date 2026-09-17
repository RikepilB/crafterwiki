# ADR-005: One query library behind CLI, static API, MCP and plugin; repo root is the plugin root

## Context

Richard wants CLI-, agent- and API-driven access that is easy and friendly, packaged as a plugin with
agents and skills. Surfaces must not drift in semantics, and the plugin should work offline.

## Decision

- `cli/lib.mjs` is the single implementation of load/validate/search/similar/patterns/event/deal/build.
- Surfaces in order: **CLI with `--json`** (now) → **static JSON API** via `build` (now, deploy later) →
  **MCP server** wrapping the same functions (phase 3) → **web UI** over the static API (phase 4). A
  dynamic HTTP API is added only for a proven need.
- The **repository root is the Claude Code plugin root** (`.claude-plugin/plugin.json`, `commands/`,
  `agents/`, `skills/`), so an installed plugin includes the CLI and corpus; skills resolve the CLI at
  `<plugin root>/cli/crafterwiki.mjs`.
- Zero runtime dependencies (Node ≥ 20 built-ins only) until a dependency clearly pays for itself.

## Consequences

### Positive
- Identical results for humans and agents; tests cover all surfaces at once.
- No hosting needed to start; plugin works offline.

### Negative
- Installed plugin snapshots data (stale until updated) — solved later by MCP/static API.
- Root directory mixes wiki content and plugin folders.
- Hand-rolled argument/validation code instead of libraries.

### Alternatives Considered
- **Server-first API (Hono/Bun) + DB:** better for third-party clients; premature.
- **Plugin in a `plugin/` subfolder:** cleaner root, but the installed plugin would lack the CLI and data.
- **Zod/JSON Schema libraries:** stronger schemas; adds install step and dependency surface.

## Status
Accepted

## Date
2026-09-14
