# ADR-008: Public repository with a gitignored private overlay

## Context

The owner decided on 2026-09-14 that CrafterWIKI is public and standalone. Some useful planning
evidence comes from private practitioner interviews that can identify participants even when
anonymized. A publish gate that only filtered the static build was not enough: a public git
repository publishes every tracked file verbatim.

## Decision

- Interview-derived material lives only under `private/` (gitignored): notes in `private/docs/`,
  record overrides in `private/data/projects/<event>/<slug>.json`.
- `loadCorpus(root, { includePrivate: true })` (CLI `--private`) lets overlay records replace public
  records by slug for local planning.
- Overlay records must carry `publish_gate`; records citing `private:` sources must too (validator).
- `build` refuses a corpus loaded with overlays; `publicCorpus()` removes gated and overlay records
  from every publishing surface (static API, web, MCP server).
- Public records are rewritten from public sources only. A win known only from an interview is not
  public: the record keeps the organizer-visible status (e.g. `submitted-only`).
- Tracked docs may say a private interview informed a decision, but never who, which team or what was
  said beyond general advice.

## Consequences

### Positive
- A fresh public clone validates with zero errors and contains nothing consent-gated.
- Local planning keeps the richer private evidence.

### Negative
- Two versions of some records; the overlay can drift from the public record. Mitigation: overlay
  replaces by slug and is validated with the same schema.
- Private evidence cannot back public pattern claims.

### Alternatives Considered
- **Private repository:** rejected by the owner (public from day one).
- **Build-time filtering only:** leaks through git history and raw files.
- **Delete the interview material:** loses planning value that is legitimately usable in private.

## Status
Accepted

## Date
2026-09-14
