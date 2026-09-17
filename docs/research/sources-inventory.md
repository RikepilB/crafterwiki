# Sources inventory (2026-09-14)

What each requested source contains, what placement data it actually supports, and how it was used.
Rule: placements come only from organizer results or project pages that list prizes.

| Source | Type | Contents | Placement data | Used as |
|---|---|---|---|---|
| hallofhackss.com (+ `/feed`, `/guide`, `/hackathons`, `/categories`, project pages) | Reference index | 29 events, 51 winners, guide | Theirs, editorial | Structure lessons + coverage pointers only → [hall-of-hacks-analysis.md](hall-of-hacks-analysis.md), `data/leads/coverage-targets.json` |
| hackthenorth.com | Official event page | HTN 2026 (Sep 18–20), 1,000+ hackers, applications closed; features S-KBD67, ROSS, DUM-E as past projects | Featured | `hack-the-north-2026.json`, corroboration for 2025 finalists |
| hackthenorth2025.devpost.com (overview, gallery, project pages) | Devpost | Dates, 872 participants, 28 prizes, 31 judges, rubric (WOW, technical, originality, design), sponsor criteria | Prize flags on project pages | `hack-the-north-2025.json` + 4 finalist records |
| soonhackathon.ca | Official event page | 48h residential house, 50 hackers, 17 projects, 5 featured, judges/speakers, outcome stats | Featured only | `soon-hackathon.json` |
| hackthevalley.io | Official event page | HTV 11 (Oct 16–18, 2026), 5 themes, sponsors, historical averages | None (upcoming) | `hack-the-valley-11.json` |
| hack0.dev | Directory | LATAM Builder Index: 85 communities, 32 historical hackathons, 20 countries, upcoming events ("The Next Craft" Lima/Arequipa/El Salvador, Cursor Hackathon Barranquilla) | None | Coverage target |
| usecroma.com/en/blog/hackathon-govtech-resultados | Official results | 12 projects, 1 winner (Centinela), organizer takeaways | Complete | `croma-govtech-ai-2026.json` + Centinela |
| hack.platan.us/26-co/vote | Voting page | 24 submissions by track | None — `/vote/results` returned server errors | Roster (`submitted-only`); WOKI analyzed from its public project page |
| hack.platan.us/26-ar/vote | Voting page | 25 submissions by track | None — `/vote/results` returned server errors | Roster (`submitted-only`) |
| solo.io blog (MCP & AI Agents 2026) | Official results | 5 tracks, winners + runner-ups | Complete | `solo-mcp-ai-agents-2026.json` + 8 records |
| hack.platan.us/25/vote/results | Official results (public vote) | Ranking with vote counts | Public vote | `platanus-hack-25.json` top 14 |
| vote.hack.platan.us/winners | Results (vote subdomain) | "Projects Ranking", no counts, edition not stated | Public vote, **low confidence** (edition inferred 2024) | `platanus-hack-24.json` |
| xi.uofthacks.com | Official event page | Empty shell (no extractable content) | — | Resolved to `uofthacks-11.devpost.com` (XI = 11, Jan 2024) |
| uofthacks-11.devpost.com (+ gallery, project pages) | Devpost | 399 participants, CAD 23,420 prizes, prize list, nostalgia theme | Project pages | `uofthacks-11.json` + FurMe (1st), BASIC Web (2nd + CSE) |
| github.com/unicorn-mafia/awesome-hackathon-winners | Community list (MIT) | ~50 repos/links across UK/US AI hackathons, many "TBD" | Claims only | `data/leads/awesome-hackathon-winners.json` (unverified) |
| tl;dv — 3 most recent meetings | Private interviews | Hackathon strategy, harness/tooling, community events | Not used for public placements | Anonymized notes kept outside the public repo (gitignored `private/`) |
| nasa.gov — 2025 Space Apps Global Winners announcement | Official results | 10 Global Awards with challenge, country, team size, description; event totals | Complete for winners | `nasa-space-apps-2025.json` + 10 records |
| nasa.gov — 2024 Space Apps Global Winners announcement | Official results | 10 Global Awards with challenge, city/country, description; 93,520 registered participants, 485 events, 163 countries, 9,996 submissions | Complete for winners | `nasa-space-apps-2024.json` + 10 records (holdout backtest) |
| spaceappschallenge.org (awards, FAQs, 2026 page, 2025 and 2024 team pages, 2024 challenge list) | Official event pages + team project pages | Award definitions, judging phases, 2026 timeline and rules; team-written summaries, stacks, AI-use disclosures, NASA data lists | Awards page; team pages carry no placement | `nasa-space-apps-2026.json`; enrichment of NASA 2025 records |
| Official 2025 Space Apps judging video (YouTube) + third-party-hosted copy of the 2024 Judging & Awards guide | Official guidance | Criteria names and 1–5 scale; criteria definitions; presentation advice | None | Rubric lenses (`scientific-validity`, `challenge-relevance` added to taxonomy) |
| Croma MCP | Tooling | Page-to-markdown extraction, web search; LATAM public-sector datasets (procurement, company registries, courts, tax) | — | Extraction this session; govtech recon in the harness |

## Access notes

- Firecrawl MCP key was revoked this session; Croma `extract_markdown` (`effort: max`) rendered
  JS-heavy pages; WebFetch recovered Devpost gallery links; Chrome (user session) for Hall of Hacks.
- **Summarizer trap:** WebFetch labeled every Devpost gallery card "Winner". Project pages showed the
  real prize (e.g. "Hack the North 2025: Finalists"). Always confirm placement on the project page.
- Platanus 26 `/vote/results` pages errored for both cities; retry before promoting anything.
- spaceappschallenge.org renders client-side: Croma extraction and the in-app browser returned only
  titles or a 404 shell; the user's Chrome (public pages, no login) rendered team pages. Team page slugs
  do not always match team names (QUEÑARIS → `watana-project`, Photonics Odyssey → `photonic-force`).

## Conflicts logged

| Fact | Source A | Source B | Resolution |
|---|---|---|---|
| Platanus Hack 26 Bogotá dates | Tour table on hack.platan.us: 11–13 Sep 2026 | Edition page + organizer post: 21–23 Aug 2026 | Edition page wins (more specific, corroborated) |
| Platanus Hack 26 Buenos Aires size | 110 hackers | 120 hackers (same page) | 110 recorded, note kept |
| Hall of Hacks "Finalists" vs Devpost | "Finalists (261 teams)" | Devpost prize "Hack the North 2025: Finalists" | Consistent: status `finalist` |
| Platanus Hack 26 Bogotá size | Edition record: 120 hackers | Organizer call-for-applicants and a participant post (2026-08-11, 08-25): 100 selected from 300+ applicants | Unresolved; recorded value kept, check the edition page again before using as a denominator |
| NASA Space Apps 2025 Global Finalists | Official finalists page: 45 Global Finalists | Local event organizer post (Arequipa, 2025-12-05): "top 40 teams", 124 expert judges | Official count recorded (45); local post kept as context only |
| NASA Space Apps 2024 Global Winners | nasa.gov announcement: 10 named winners | spaceappschallenge.org `/nasa-space-apps-2024/awards/global-winners/` rendered a list of unrelated teams, each labelled "2024 Global Winner" (2026-09-14) | nasa.gov used; the site list treated as a rendering fault. 2024 pages live under `/nasa-space-apps-2024/` (not `/2024/`); one team page exposes demo credentials, which were not copied |
| Platanus Hack 26 results | `/26-co/vote/results`, `/26-ar/vote/results` return server errors | Participant posts claim Tranquera (BA overall + AI Security) and Roxy (Bogotá AI Security 2nd) | Not recorded as placements; kept as team-stated leads in `data/leads/coverage-targets.json` |
