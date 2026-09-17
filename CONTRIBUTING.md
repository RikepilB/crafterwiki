# Contributing to CrafterWIKI

Thanks for helping. The value of this project is that every claim is checkable, so most of
these rules are about provenance rather than code style.

## Quick start

Node ≥ 20 for the CLI and MCP server; Node ≥ 22.12 for the website. No install step for the
CLI — it has no dependencies.

```bash
node cli/crafterwiki.mjs validate
```

```bash
node --test
```

```bash
npm --prefix web install && npm --prefix web run dev
```

Both commands must pass before you open a pull request. CI runs them plus the site build.

## The rules that matter

1. **Primary sources only.** Organizer results pages, official announcements and team project
   pages. Aggregators, awesome-lists and summaries are *pointers* — record them in
   `data/leads/` and then go find the primary source. Never copy another site's records or prose.
2. **Placement honesty.** A voting page is not a result. Use the real status: `grand-winner`,
   `podium`, `track-winner`, `runner-up`, `finalist`, `submitted-only`, `public-vote-ranked`,
   `featured`, or `reported-winner` (an unverified claim, which must say how to verify it).
3. **Every claim carries a basis.** Each "why it stood out" entry is `organizer-stated`,
   `team-stated` or `curator-inference`. The first two must cite a source index.
4. **Taxonomy first.** New mechanism, lens, domain or event kind? Add it to
   `schema/taxonomy.json` with a definition in the same change. The validator rejects unknown values.
5. **People's names are not stored.** Record `team.size` and countries. Do not add member names,
   emails, personal social-media links or photos — not even when the organizer publishes them.
6. **Base rates need full rosters.** Only claim "N of M teams did X" when the event's
   `roster_coverage` is `full`. Otherwise say "N indexed (partial roster)".
7. **Sample size and event kind.** Any pattern claim states its n and which event kinds it covers.

## Adding a hackathon or a project

Follow `skills/wiki-curate/SKILL.md` — it is the full checklist. In short:

- Event record → `data/hackathons/<slug>.json` (dates, format, judging criteria mapped to lenses,
  prizes, submission rules, `results_status`, `roster_coverage`, sources).
- Analyzed project → `data/projects/<event-slug>/<project-slug>.json` (placement, team size,
  problem, solution, demo moment, stack, mechanisms, lenses, lessons, links, sources).
- Slugs are kebab-case and match the file name.
- Write in English; keep names in their original language.
- Run `validate` — it checks enums, source requirements, roster coverage and privacy gates.

## What is not in this repository

Some analysis came from private conversations. Those records live only in a local, gitignored
`private/` overlay and never reach the public corpus, the website or the API. You do not need
them to contribute, and pull requests must not add them.

## Corrections and removals

If a record is wrong about your project, or you want it taken down, open an issue with the
"Correction or removal request" template. See [SECURITY.md](SECURITY.md) for the removal policy.

## Licensing of contributions

Code contributions are MIT; corpus contributions are CC BY 4.0 (see LICENSE and LICENSE-DATA).
By opening a pull request you agree to license your contribution on those terms.
