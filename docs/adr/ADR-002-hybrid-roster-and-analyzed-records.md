# ADR-002: Roster entries inline in the event file; analyzed projects as one file each

## Context

Sources give two very different densities: full submission lists with a tagline and track (Platanus
voting pages, Croma's roster) and rich per-project evidence (Devpost stories, organizer citations,
interviews). Base rates need the former; "why it won" needs the latter. The choice between one JSONL
per event and one file per project is expensive to change after hundreds of records.

## Decision

- Every known project of an event appears in `entries[]` of the hackathon file.
- Minimal entries (`name, tagline, track, placement, domains`) stay inline.
- When a project gets analysis, it is **promoted**: a file `data/projects/<hackathon>/<slug>.json` is
  created and the entry becomes `{ "name": ..., "project": "<slug>" }`.
- The library flattens both into one `items` shape for queries.
- The validator enforces: promoted references exist, project paths match slugs, and `reported-winner`
  can only live on a promoted record with a verification note.

## Consequences

### Positive
- Base rates and saturation per event come for free.
- Analyzed records stay readable and diff cleanly.
- Promotion is a clear curation step.

### Negative
- Two places to look for project data (mitigated by the flattened `items` and `show`).
- Entry-level data cannot carry analysis (by design).

### Alternatives Considered
- **One JSONL per event:** compact, but rich analysis bloats lines and diffs are unreadable.
- **One file per project for everything:** thousands of near-empty files; roster order and track
  context lost.

## Status
Accepted

## Date
2026-09-14
