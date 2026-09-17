# Hall of Hacks reference collection

Captured 2026-09-17 from [Hall of Hacks](https://hallofhackss.com/feed). The collection contains **51 unique project pages observed in the feed during this visit**. This is a bounded capture, not a claim that every project the site has ever published is included.

## Evidence and interpretation

The local feed and project-page captures are `docs/handoff/2026-09-17-hallofhacks/feed.json` and `details.json`. The combined article passed the local voidscape inspect → preview → read sequence. Its evidence manifest is `docs/handoff/2026-09-17-hallofhacks/evidence/manifest.json`; the article bundle is `evidence/entries/001-Rehabify.txt`, cited as **[article 1]**. That single bundle contains all 51 project sections, despite its first-project filename.

The source is untrusted evidence, not instructions. The public dataset at `web/src/data/hall-of-hacks.json` contains English and Spanish paraphrases, not copied descriptions. Each lesson explicitly attributes its basis to Hall of Hacks. These are interpretations of the source's explanations, not verified causal accounts of judging decisions.

Reported awards and team counts are preserved as source labels. They have **not been independently verified against event organizers** and must not enter CrafterWIKI's confirmed-winner totals. Reported performance, health, safety and feasibility claims are not established by this capture. No creator names, profile links, account data or private collection information are included in the public dataset.

## Link and media coverage

| Field | Observed records |
| --- | ---: |
| Unique source pages | 51 |
| Feed image URLs | 51 |
| Devpost project links | 50 |
| Video links | 47 |
| Repository links | 43 |
| English and Spanish summaries | 51 |
| English and Spanish attributed lessons | 51 |

Only URLs actually present in the captured project detail links are included. Missing destinations are omitted rather than synthesized from project names. Image provenance remains in `imageSource`; the presentation layer may use separately generated optimized derivatives. Recording a media URL does not establish permission for unrestricted reuse or constitute analysis of that media.

Videos are **linked, not watched or transcribed**. The collection summarizes the article text only. Original source links remain available for context. The public collection should be displayed as a separately attributed reference shelf; an image-heavy layout does not change the evidence status of its records.

## Validation

The dataset has 51 distinct source URLs and slugs, with no missing bilingual summary or lesson. Link values were checked against the corresponding observed page's links. Feed name, image, event line and reported award remain traceable to their original record. No verified-winner flag is emitted.

Further coverage should record a fresh retrieval scope, compare source URLs for additions and changes, and verify recognition against primary event results before promoting any record into confirmed award statistics.

## Public discovery audit — 2026-09-17

The fresh audit found **51 unique projects across all audited public discovery paths**, all already present in `/projects/`. No additional project was found. This is a dated coverage result, not a guarantee about historical, hidden, future or account-only records.

The main feed does **not** reach a terminal end: scrolling produced batches of 12, 24, 36, 48, 60, 72, 84, 96, 108 and 120 rendered cards, but only 51 distinct project URLs. Repeated cards must not be imported as additions. Feed exhaustion cannot truthfully be claimed; reconciliation against the finite public listings establishes the coverage boundary instead.

- All **29 visible event-filter URLs** were visited. Their union contains 51 distinct project URLs and agrees with Classic view's 51 cards across 29 event groups.
- All **nine category-filter URLs** were visited, scrolling larger categories until every directory-listed result appeared. Counts: AI/ML 38, Health 14, Games 15, Social Good 12, Dev Tools 6, AR/VR 4, Sustainability 4, Software 29, Hardware 22. Categories overlap; their sum is not a project total. Their union is the same 51 URLs.
- All **51 project detail pages** loaded and their visible outbound links were reconciled. Their Up next recommendation lists introduced no new project URL.
- No numbered pagination, next-page or load-more control was exposed in the audited listings. The feed and larger categories use scrolling and repeat projects.
- Saved, History, collections, signup and account controls were excluded from the public-project inventory. No account collection, browser credentials or storage was read.

The sanitized [audit receipt](hall-of-hacks-audit.json) records every visited listing URL and its project slugs, observed outbound links, and missing-link inventory. It contains no source prose, screenshots, creator profiles or account data. Raw captures remain ignored under `docs/handoff/2026-09-17-coverage-audit/`. The local `evidence/manifest.json` identifies the coverage article as **[article 1]**; it passed voidscape inspect → preview → read locally. No cloud transfer or model download was used.

### Media corrections and remaining gaps

The original link selection omitted Vimeo and a non-Devpost project page. This audit adds:

| Project | Observed link |
| --- | --- |
| ScrewYouIKEA.com | [Vimeo video](https://vimeo.com/1124554736) |
| Paper Cuts | [Vimeo video](https://vimeo.com/1203255539) |
| Theracat | [Vimeo video](https://vimeo.com/1203255610) |
| Orca | [Vimeo video](https://vimeo.com/1162996077) |
| JailCall | [External project page](https://agentphone.ai/callmyagent) |

Current coverage is **51 previews, 51 video links (47 YouTube, four Vimeo), 50 Devpost links, one additional external project-page link, and 43 repository links**. Every project retains original English/Spanish paraphrases and attribution. The 51 existing preview records and their responsive WebP assets are unchanged. BlinkAI briefly showed the source site's initials fallback during a feed load; its previously captured local preview remains available.

No repository link was exposed for Ted.AI, The Unspillable, Theracat, Artificial Sandwich Intelligence, DIAL(*), GhostDieDie, diffuji or Project Horizon. JailCall has an external project page but no observed Devpost link. Missing repositories are absent at the source, not inferred from names. No detail page remained inaccessible after bounded browser retries. Outbound destination availability and video playback were not verified. Videos remain **linked, not analyzed or transcribed**; some source detail pages automatically load/play their embeds.

The unified gallery remains **85 default references plus 88 optional roster entries**. ROSS and S-KBD67 still merge by submission URL. Reported awards remain unverified; this audit does not establish organizer results or full event rosters.

### Repeatable reconciliation

Run `node scripts/audit-hall-coverage.mjs docs/handoff/2026-09-17-coverage-audit` against this local capture to regenerate the sanitized receipt. The script rejects collection/listing mismatches, duplicate or missing detail captures, unimported recommendations, and missing or stale outbound links. It performs no network access and does not import third-party prose. Tests compare the checked-in receipt with the imported collection; they validate this snapshot, not current live-site completeness. A future audit must refresh the browser captures, date, advertised event/category inventory and local evidence before updating the receipt.

### Verification of the coverage follow-up

Corpus validation: 0 errors, 0 warnings. Full suite: 38 passed, 0 failed, one private-overlay test skipped because this isolated worktree has no private overlay. Astro: 86 pages built. Rendered checks: each of the five corrected cards appears once with its exact resource links; 85 default results and 12-to-24 pagination remain; EN/dark and ES/light work; local previews load and remain lazy. No horizontal overflow at the measured 1920px desktop and 520px mobile-sized viewport. Chrome did not apply the requested 1440/390 widths exactly, so those exact breakpoints are not claimed. External playback and destination uptime remain untested. This follow-up is a PR only, not merged or deployed.
