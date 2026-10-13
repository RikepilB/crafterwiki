# ADR-012: Load roster cards on demand in the project explorer

## Context

`/projects/` renders every public reference as a card, and its filters run in the browser. Ingesting
full event rosters from primary sources (ADR-006) adds the optional "other submissions" by the hundreds
per event. Before this decision every roster card shipped in the page even though the default view
hides them. With 20 events indexed, the page was 2.09 MB of HTML, and the planned ingestion (more than
3,700 searchable items) would have pushed it several times higher. Most visitors never turn on
"Include other submissions".

## Decision

- `/projects/` ships only the default references: analyzed projects and editorial references,
  including editorial references that match an indexed roster entry.
- Roster cards render at build time into a static fragment, `/projects/roster/` (`noindex`), from the
  same `ReferenceCard` component, so card markup has one source.
- Each card carries `data-order`, its position in the merged explorer order. The first time the toggle
  is on (by click or `?entries=1`), the explorer fetches the fragment, imports the cards and slots them
  back into that order.
- Until the fragment arrives, or if the fetch fails, the explorer shows that results are incomplete,
  offers a retry, and never shows the "no matches" state.
- Search never matches roster cards while the toggle is off, so the default view and its counts are
  unchanged.

## Alternatives considered

- **Keep every card in the page.** This is the simplest option, but page weight grows linearly with
  every roster ingested, and the cost falls on every visitor.
- **A JSON index plus client-side rendering.** Smaller over the wire, but card markup would exist
  twice (Astro and JavaScript) and drift; the static fragment reuses the component.
- **Paginated roster pages.** These don't fit the explorer's client-side filters, which need every
  candidate card in the DOM to filter across events.

## Consequences

- Default `/projects/` dropped from 2.09 MB to 691 KB at 20 events, and it stays flat as rosters grow.
  The fragment carries the growth and is fetched only on request.
- Including other submissions needs one extra request; without JavaScript the toggle does nothing,
  which is the same as before, since the filters already needed JavaScript.
- Explorer tests must cover the fragment (order, no duplicates, roster flag) as well as the main page.
