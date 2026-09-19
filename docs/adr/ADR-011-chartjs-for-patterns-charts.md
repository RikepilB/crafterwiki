# ADR-011: Chart.js for the charts on `/patterns/`

## Context

`/patterns/` showed per-kind lists of bars built from HTML. The owner asked for clearer numbers,
calculations and Chart.js charts (2026-09-18). The project's rule is no new runtime dependency without
an ADR (`CLAUDE.md`); `cli/`, `mcp/` and the root package stay dependency-free, while `web/` has its own
pinned dependencies (ADR-007).

## Decision

- Add `chart.js` **4.5.1** to `web/` only, pinned exactly (MIT; one runtime dependency,
  `@kurkle/color`, MIT; `npm audit` reports 0 vulnerabilities). Import only the bar controller, bar
  element, category and linear scales, and tooltip, so the rest of the library is tree-shaken away.
  The charts load on `/patterns/` alone.
- All numbers are computed at build time in `patterns.astro` from the public corpus and embedded as
  JSON; the browser only draws. The confidence math lives in the pure query module as `wilson()`
  (Wilson score interval, 95%), with unit tests, so the CLI and MCP server can use the same function.
- Honesty rules built into the page: every share shows its sample size and 95% range; kinds of event
  with fewer than five winners are tabled but not charted; the range is drawn on each bar by a small
  in-house plugin rather than an extra dependency.
- Accessibility and theming: each chart has a table view with the same numbers; the categorical colours
  follow the kind of event (never its rank) and were validated with the dataviz palette checks against
  the site's dark and light card surfaces (all pairs pass colour-vision separation; the light-mode
  contrast warning is relieved by the table views); charts redraw on theme and language changes and
  skip animation under `prefers-reduced-motion`.

## Alternatives considered

- **Hand-written SVG charts** — no dependency, but tooltips, responsive layout and axes would be
  re-implemented and harder to maintain than a small, widely used library.
- **A plugin for error bars** (`chartjs-chart-error-bars`) — a second dependency for one visual; a
  30-line plugin draws the same range.

## Consequences

- One new, pinned dependency in `web/`; Chart.js upgrades need the same build and visual check as Astro
  upgrades.
- The chart page needs JavaScript; without it, the tables show every number.
