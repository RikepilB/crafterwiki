# ADR-009: Zero-dependency MCP server over the shared query module

## Context

Agents need structured access beyond the CLI: search, similar situations, event briefs, patterns,
random draws and full records, from Claude Code and other MCP clients. ADR-005 planned an MCP server
wrapping the library. The official SDK would be the first runtime dependency outside `web/`.

## Decision

- `mcp/tools.mjs` implements the MCP tool surface as a transport-free JSON-RPC handler:
  `initialize` (protocol version negotiation), `ping`, `tools/list`, `tools/call`; notifications get no
  reply; tool failures return `isError` in-band; unknown methods return JSON-RPC errors.
- `mcp/server.mjs` wires it to the stdio transport (newline-delimited JSON) with Node built-ins only.
- Tools: `search_projects`, `similar_situations`, `event_brief`, `patterns`, `deal`, `get_record`,
  `list_hackathons`, `list_facets` — thin wrappers over `cli/query.mjs`, serving `publicCorpus()`.
- Server `instructions` carry the placement-honesty and base-rate rules so any agent client sees them.
- The plugin manifest declares the server with `${CLAUDE_PLUGIN_ROOT}/mcp/server.mjs`.

## Consequences

### Positive
- No install step; the same checkout runs CLI, MCP and tests.
- Unit tests call the handler directly; one test exercises the real stdio process.

### Negative
- Protocol changes must be tracked by hand (supported versions listed in `PROTOCOL_VERSIONS`).
- No resources, prompts or HTTP transport yet.

### Alternatives Considered
- **Official MCP SDK:** less protocol code, but a dependency and a build of its own for a tool surface
  this small.
- **HTTP API only:** agents would need custom glue per client.

## Status
Accepted

## Date
2026-09-14
