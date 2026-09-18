# Project coverage and media acquisition plan

## Outcome and scope

Make Explore useful for finding project precedents across event editions: overall winners, podium places, category and sponsor winners, runners-up, finalists, officially named nominees, and other submissions. Each result should expose its verified placement, event/year, original project page, available demo/video/repository links, and authentic preview media where permitted.

The target is complete coverage of explicitly selected event editions and result categories, measured against their official lists. It is not a claim to contain every hackathon or every project ever submitted. A missing public resource is a documented outcome, not a reason to manufacture a URL or image.

This is an implementation and research plan. No external source availability, media permission, or new result has been verified by writing it.

## Verified local baseline

Inventory checked against `data/hackathons/*.json`, `data/projects/**/*.json`, `schema/taxonomy.json`, and `cli/query.mjs` on 2026-09-16. Counts use `buildItems`: inline entries pointing to analyzed projects are excluded to avoid double counting.

- 14 indexed event editions; 11 contain projects and 3 are recorded as upcoming.
- 124 unique searchable records: 36 analyzed projects plus 88 additional roster entries. The 124 raw inline entries include references to the 36 analyzed projects; they are not another 124 projects.
- Among the 36 analyzed projects: 19 video URLs, including 11 YouTube videos; 17 demo URLs; 2 repository URLs. URL presence does not establish live availability or playable content.
- No analyzed project currently has a `links.image` field. `web/src/lib/media.js` contains 11 derived YouTube poster pointers. These are previews, not evidence that a video has been watched or that redistribution rights were granted.
- Existing link keys are `project_page`, `project`, `devpost`, `demo`, `video`, `repo`, and `blog`. Preserve them during normalization.

| Stored year | Analyzed | Additional roster entries | Total |
| --- | ---: | ---: | ---: |
| 2024 | 12 | 10 | 22 |
| 2025 | 14 | 14 | 28 |
| 2026 | 10 | 64 | 74 |
| Total | 36 | 88 | 124 |

SOON's year is inferred in its existing curator notes and its edition is undated. Resolve that source uncertainty before presenting a precise historical chronology. Event states below reflect stored data, not a fresh check of current dates or results.

| Edition | Analyzed | Additional entries | Stored results / roster coverage | Indexed placements |
| --- | ---: | ---: | --- | --- |
| Croma GovTech AI 2026 | 1 | 11 | complete / full | 1 overall winner; 11 submitted |
| Hack the North 2025 | 4 | 0 | partial / partial | 4 finalists |
| Hack the North 2026 | 0 | 0 | upcoming / none | None indexed |
| Hack the Valley 11 (2026) | 0 | 0 | upcoming / none | None indexed |
| NASA Space Apps 2024 | 10 | 0 | partial / winners-only | 10 category winners |
| NASA Space Apps 2025 | 10 | 0 | partial / winners-only | 10 category winners |
| NASA Space Apps 2026 | 0 | 0 | upcoming / none | None indexed |
| Platanus Hack 24 | 0 | 10 | public-vote-only / partial | 10 public-vote ranked |
| Platanus Hack 25 | 0 | 14 | public-vote-only / partial | 14 public-vote ranked |
| Platanus Hack 26 Bogotá | 1 | 23 | submissions-only / full | 24 submitted |
| Platanus Hack 26 Buenos Aires | 0 | 25 | submissions-only / full | 25 submitted |
| Solo MCP & AI Agents 2026 | 8 | 0 | complete / winners-only | 5 category winners; 3 runners-up |
| SOON (undated, stored as 2026) | 0 | 5 | featured-only / partial | 5 featured |
| UofTHacks 11 (2024) | 2 | 0 | partial / partial | 1 overall winner; 1 podium |

| Placement status | Analyzed | Additional entries |
| --- | ---: | ---: |
| grand-winner | 2 | 0 |
| podium | 1 | 0 |
| track-winner | 25 | 0 |
| runner-up | 3 | 0 |
| finalist | 4 | 0 |
| public-vote-ranked | 0 | 24 |
| featured | 0 | 5 |
| submitted-only | 1 | 59 |

The current taxonomy includes finalists in `counts_as_winner`. Therefore 35 records matching that flag must not be displayed as “35 prize winners”: 31 have winner/podium/runner-up statuses and 4 are finalists. Separate the public labels and document any later analytics migration. Partial and winners-only rosters cannot support winner probabilities or representative success-rate claims.

## P0 — Establish the coverage contract

1. Add a versioned coverage matrix per event edition and result scope. Separate overall podium, category/sponsor awards, finalist round, nomination stage, honorable mentions, public vote, and submission roster.
2. Add nominee, semifinalist, and honorable-mention statuses only with explicit definitions and corresponding validator, filter, ordering, and label changes. None currently exists. Preserve the organizer's original label; do not equate a NASA nomination with a global finalist or a prize.
3. Represent multiple recognitions separately so a project can be both an overall winner and a sponsor winner. Keep a backward-compatible primary placement for current consumers until migration is tested. Preserve exact rank, award name, track, stage, geographic scope, evidence URL, and verification basis for every recognition.
4. Give lightweight entries stable event-scoped identifiers and optional links/media. A project should not require speculative analysis merely to appear with a source link and image. Promotion to analyzed status must preserve its identity and avoid duplication.

Proposed coverage matrix fields:

| Field | Purpose |
| --- | --- |
| event_id, edition, year, date_basis | Stable edition identity and known date uncertainty |
| result_scope, organizer_label | What list is being counted, using the source's terminology |
| official_list_url, retrieved_at | Primary evidence and freshness |
| expected_count, count_basis | Official denominator; null if unavailable |
| indexed_count, missing_ids | Progress against that exact list |
| completeness | not-started, partial, complete-for-source, unavailable |
| blockers, last_attempt, next_action | Bounded retry and honest acquisition state |
| analyzed_count | Analysis depth, separate from roster coverage |
| project_url_count, demo_count, video_count, image_count | Presence by resource type |
| checked_resource_count, unavailable_resource_count | Availability verification, separate from presence |

“Complete-for-source” requires every item on the cited official list to be represented and reconciled. It never implies that the source itself lists all submissions or all award categories.

## P1 — Make existing records visually usable

First render the resources already present on all 36 analyzed records. Avoid delaying useful links while expanding the corpus.

- Use labeled actions: Original project, Live demo, Watch demo, Code, Team write-up, and Award source. Multiple URLs of the same type must remain accessible on the detail page.
- Prefer a verified project screenshot or team-supplied cover; use an allowed provider video preview when available. Otherwise show a designed text fallback containing the project name, domain, and event. Never generate an image that could be mistaken for the actual product.
- Display exact placement labels, awards, event/year, analysis depth, and source freshness. Show roster entries by default or provide an obvious one-click switch with both counts visible.
- Add combinable event/year, placement, analysis depth, domain, and resource filters: Has demo, Has video, Has image, Has code. Keep selected filters in the URL and provide a clear reset and useful empty state.
- Cards use one main project link and distinct resource actions. Details expose all verified URLs, captions/credits, and a source trail. Avoid automatic video playback and loading many video iframes in the grid.

Proposed media record: `id`, `project_id`, `kind`, `url`, `source_page_url`, `provider`, `title`, `alt`, `credit`, `rights_basis`, `license_url`, `retrieved_at`, `checked_at`, `availability`, `embed_allowed`, `width`, `height`, and optional `local_path` for permitted assets. Use explicit unknown values rather than treating public access as permission to copy or redistribute.

Availability values should distinguish unverified, reachable, playable-verified, broken, restricted, embed-blocked, not-found-after-search, and not-published. A successful HTTP response alone cannot prove a video plays or a demo works.

## P2 — Acquire media and links in bounded batches

For each selected record, follow its existing primary project page, organizer entry, or team repository. Collect only directly evidenced project, demo, video, code, slides, write-up, and asset URLs. Search discovery can locate a primary page; directory summaries cannot establish placements.

1. Check 10 analyzed records per batch, starting with the records without usable previews and the highest-priority result gaps. Reconcile known video/demo pointers before searching for new ones.
2. For each record, inspect its primary project page and at most two directly linked team/organizer pages. If needed, perform one targeted search for the exact project plus event/year. Do not guess live-demo domains or cross-link same-name projects from another year.
3. Capture source URL, exact resource URL, retrieval time, media ownership/usage basis, and availability outcome. Preserve blocked/deleted URLs as historical evidence with an appropriate UI state.
4. Use at most one retry for a transient failure in the batch. Authentication, rate limits, unclear permissions, or blocked embeds become recorded blockers; do not bypass access controls or download videos to avoid a restriction.
5. Before any media/article evidence reading, follow the repository's required voidscape `inspect -> preview -> read` workflow. Cloud transfer or first model download requires its applicable current approval. URL inventory alone does not justify claims about video contents.
6. Validate the batch, review changed records and rendered cards, publish the evidence/count delta, then take the next batch. Never silently convert “not found in this bounded search” into “does not exist.”

Next process the 88 additional entries in batches of 10, starting with entries whose organizer pages already expose project links. Keep placement verification independent of media collection. A polished team demo is not evidence of winning.

## P3 — Complete selected results, then expand years

Use `data/leads/coverage-targets.json` as a research queue; its guessed/unverified URLs and historical failure notes remain leads until checked.

| Order | Research batch | Completion gate |
| --- | --- | --- |
| 1 | Hack the North 2025 remaining finalists and sponsor awards; UofTHacks 11 remaining podium and sponsor awards | Reconcile each official result list and every missing project |
| 2 | Platanus 2026 Bogotá/Buenos Aires results and Platanus 2024/2025 jury awards | Separate jury awards from existing public votes; retain submission status where evidence is absent |
| 3 | NASA 2024/2025 official finalists/nominees and any other published recognition lists | Distinguish local/global scope and stage; count against exact official lists |
| 4 | Existing complete-result editions: Solo 2026 and Croma 2026 | Audit category coverage and media; distinguish complete awards from complete roster |
| 5 | One earlier edition each from existing event families | Add edition identity, official results, all listed recognitions, then media; avoid parallel half-filled years |
| 6 | Two new event families per research cycle, prioritizing LATAM plus another geography | Verify official edition/results URLs before importing records |

Potential expansion leads already recorded include Hack the Valley 10, TreeHacks 2025/2026, Cal Hacks 12.0, UofTHacks 2026, and LATAM events. These are candidates, not verified coverage commitments. Refresh dates and official results for editions stored as upcoming before treating them as concluded.

For each new edition, first enumerate its official award list into lightweight records; then enrich links/media; then select projects for deeper source-backed analysis. This expands breadth without presenting shallow entries as studied examples.

## Verification and release gates

- Data: validate controlled statuses, recognition provenance, event references, stable IDs, duplicate promotion, and HTTP(S)-only public URLs. Reject secrets, executable URL schemes, malformed provider IDs, and unsourced placement upgrades.
- Coverage: every public count is reproducible from the corpus; unknown denominators show “coverage unknown”; complete claims name their result scope and source.
- Media: each displayed asset has source/credit and a recorded usage decision; failed/blocked resources have fallbacks. No synthetic project screenshots or claims to have watched unreviewed videos.
- Behavior: combined filters, URL restore, keyboard focus, mobile layouts, empty states, external actions, long titles, broken posters, and blocked videos work. Test zero-media and roster-only records as well as visually rich winners.
- Performance: lazy-load images, reserve dimensions to prevent shifts, use appropriately sized previews, and load video players only after user interaction.
- Regression: run root tests and corpus validation, then the Astro build. Preview representative desktop/mobile pages, including a winner, finalist, public-vote entry, nominee once supported, and a missing-media record.
- Deployment: deploy the tested build to Vercel within the user's deployment authorization; confirm project list/detail pages, images, outgoing links, and filters on the deployed URL. Source freshness and functional demo verification remain distinct checks.

The first delivery gate is honest labels and useful resource actions for the existing 124 records, with all 36 analyzed projects audited for available resources or documented gaps. Subsequent gates close named event/result scopes and report exactly how many records and usable resources were added.
