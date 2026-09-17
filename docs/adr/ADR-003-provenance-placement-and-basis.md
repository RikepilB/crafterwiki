# ADR-003: Mandatory provenance, placement status and analysis basis

## Context

During seeding, three traps appeared: voting pages that look like results (Platanus 26), a summarizer
that labeled every Devpost gallery card "Winner", and a win reported only in a private interview.
Pattern analysis built on mislabeled placements would teach the wrong lessons.

## Decision

- **Placement status** is a controlled value: `grand-winner, podium, track-winner, runner-up, finalist,
  public-vote-ranked, featured, reported-winner, submitted-only, unknown`, each with `counts_as_winner`.
  Winner analytics use `counts_as_winner` only unless the caller opts into `reported-winner`.
- **Sources** are required on every hackathon and project, with `kind` and `retrieved_at`.
- **Analysis claims** carry `basis`: `organizer-stated`, `team-stated` (both require a source index) or
  `curator-inference`.
- `reported-winner` requires `placement.verification` and cannot appear on inline entries.
- Placement is confirmed on the project page or official results, never on gallery summaries.

## Consequences

### Positive
- Machine-enforced honesty; every surface can show "why we believe this".
- Survivorship bias is measurable (winners vs rosters).

### Negative
- More curation effort per record.
- Some useful signals (public vote, featured) are excluded from winner stats by default.

### Alternatives Considered
- **Free-text confidence notes:** unenforceable, inconsistent.
- **Binary winner flag:** loses finalists, public votes and unverifiable claims.

## Status
Accepted

## Date
2026-09-14
