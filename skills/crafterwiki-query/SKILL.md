---
name: crafterwiki-query
description: Query the CrafterWIKI corpus of hackathon winners and submissions — search, "similar situation" lookup, winning-pattern frequencies, event recon briefs and random inspiration. Use when asked "what won at X", "projects like ours", "what wins at student/sponsor/LATAM hackathons", "has this been done at a hackathon", "deal me a hackathon idea", or when another CrafterWIKI step needs evidence. Do NOT use to add or edit records (use wiki-curate) or for fresh web research on an event (use hackathon-recon).
---

# CrafterWIKI query

## Locate the CLI

`node <plugin root>/cli/crafterwiki.mjs` — the plugin root is two directories above this SKILL.md
(the folder with `.claude-plugin/`). `${CLAUDE_PLUGIN_ROOT}` points there when available. Always add
`--json` when you will reason over the output.

## Commands

| Need | Command |
|---|---|
| Allowed facet values | `facets mechanisms` · `facets judging_lenses` · `facets domains` |
| Text + facet search | `search "voice agent" --domain health --winners` |
| Similar situation (profile) | `similar --domain govtech-transparency --lens impact,business-potential --ai agent` |
| Similar to a record | `similar --to woki --limit 5` |
| Include roster entries | add `--include-entries` (they only carry domains/tracks) |
| Winning patterns | `patterns --event-kind student-major-league` · `patterns --event croma-govtech-ai-2026` |
| Event recon brief | `event hack-the-north-2025` |
| Inspiration | `deal --mechanism familiar-thing-new-job` (add `--seed n` for repeatability) |
| Full record | `show centinela` |
| Index | `list hackathons` · `list projects` |

## Interpretation rules

1. **Placement honesty.** Only `grand-winner`, `podium`, `track-winner`, `runner-up`, `finalist` are
   wins. Say "submitted" for `submitted-only`, "ranked Nth in the public vote" for `public-vote-ranked`,
   "featured by the organizer" for `featured`, and "reported (unverified)" for `reported-winner`.
2. **Cite** record slugs and statuses for every claim, e.g. `centinela (grand-winner)`.
3. **Basis.** When quoting a reason a project stood out, say whether the organizer, the team or the
   curator said it (`basis`).
4. **Sample size.** Always state `sample.analyzed_records`. Stratify with `--event-kind`: unstratified totals mix
   playbooks and are dominated by two events. As of 2026-09-14, NASA Space Apps (2024 and 2025) supplies 20
   of 35 confirmed winners (every `expert-data-for-everyone`, 6 of 9 `human-stakes`) and one open-source
   event supplies 8 (most `sponsor-platform-mastery`, half of `complete-submission-package`). Before
   generalizing a mechanism, check which events its count comes from (`patterns --event <slug>`) and
   whether it held across editions (`human-stakes`: 5 of 10 NASA winners in 2025, 1 of 10 in 2024).
5. **Base rates only from full rosters.** Call counts "saturation" only when `base_rate_valid` is true
   (`roster_coverage: full`); otherwise say "N indexed (partial roster)". A crowded lane can still win
   (Centinela won inside a 7-of-12 procurement lane); report which mechanisms won inside it.
6. **Publish gates.** Records with `publish_gate` may inform private planning but must not be quoted in
   anything published.
7. If the corpus lacks the event, say so and suggest `hackathon-recon` + `wiki-curate`.

## Answer shape

- Direct answer (2–4 lines).
- Evidence: bullet per record — name, event, status, the relevant mechanism or lens, basis.
- Caveats: sample size, event-kind skew, missing results.
