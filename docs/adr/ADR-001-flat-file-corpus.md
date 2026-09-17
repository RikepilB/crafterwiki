# ADR-001: Flat-file JSON corpus in git as the source of truth

## Context

The corpus must be readable by humans, CLI, agents, a static API and later a web UI; edits must be
reviewable and every fact traceable. Volume in the next year: hundreds to low thousands of items.
Writers: one curator plus agents, later community contributors.

## Decision

Store the corpus as JSON files in git: `schema/taxonomy.json`, `data/hackathons/<slug>.json`,
`data/projects/<hackathon>/<slug>.json`, `data/leads/*.json`. A zero-dependency Node library validates
and queries it; `build` emits a static API.

## Consequences

### Positive
- Diffs and PR review for every change; history is provenance.
- No infrastructure; works offline; installable plugin carries the data.
- Agents read files directly or through the CLI.

### Negative
- No concurrent multi-writer story; merge conflicts on busy event files.
- Full load into memory (fine below ~20k items).
- JSON is less pleasant to hand-edit than Markdown/YAML.

### Alternatives Considered
- **Postgres (Neon available):** better for community writes and relational queries; premature now,
  adds hosting and migration overhead. Revisit when contributions exceed PR throughput.
- **Markdown + YAML frontmatter:** nicer prose editing; needs a YAML parser (dependency) and weaker
  validation of nested facets.
- **Notion/Airtable:** fast UI, but locked-in, weak provenance, harder for agents and CI.

## Status
Accepted

## Date
2026-09-14
