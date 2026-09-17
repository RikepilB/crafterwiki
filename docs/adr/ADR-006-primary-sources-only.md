# ADR-006: Primary sources only; existing indexes are pointers

## Context

Hall of Hacks already curates 51 winners with editorial "why it won" text and offers a removal link;
community lists (awesome-hackathon-winners) mix verified and "TBD" entries. Copying either would be a
reskin, legally weak, and would inherit their errors and coverage limits.

## Decision

- Facts come from organizer pages, results posts, Devpost project pages, repositories, or anonymized
  interviews.
- Hall of Hacks, awesome lists and directories feed `data/leads/` (what to index next), never records.
- Store facts, short paraphrases and links — not full team write-ups or third-party editorial prose.
- Respect site terms, robots rules and rate limits; do not scrape behind authentication. Logged-in
  reading is limited to learning product structure when the user grants it.
- Honor removal requests.

## Consequences

### Positive
- Defensible content; accuracy traceable to the organizer.
- Coverage can exceed existing indexes (LATAM, online, open-source events).

### Negative
- Slower growth; each record needs a primary fetch.

### Alternatives Considered
- **Aggregate existing indexes:** fast, but derivative, error-inheriting and legally risky.

## Status
Accepted

## Date
2026-09-14
