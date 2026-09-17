## What this changes

<!-- One or two sentences. For data changes, name the event and the records. -->

## Checks

- [ ] `node cli/crafterwiki.mjs validate` → 0 errors
- [ ] `node --test` → all pass
- [ ] `npm --prefix web run build` (only if `web/`, `data/` or `schema/` changed)

## For data changes

- [ ] Every record cites a **primary source** (organizer page, official announcement, team project page)
- [ ] Placement status matches what the source actually says (a voting page is not a result)
- [ ] Each "why it stood out" claim has a basis: `organizer-stated`, `team-stated` or `curator-inference`
- [ ] New facet values were added to `schema/taxonomy.json` with definitions
- [ ] No member names, emails, photos or personal social-media links — team size and country only
- [ ] Any base-rate claim comes from an event with `roster_coverage: full`
