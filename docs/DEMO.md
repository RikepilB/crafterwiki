# CrafterWIKI — 5-minute demo

Audience: hackathon teams, organizers and builders. Goal: they leave knowing CrafterWIKI tells them *why*
projects win at *their kind of event*, and plans the demo before the code.

## Setup (before the demo)

```bash
npm --prefix web install
```

```bash
npm --prefix web run dev
```

Open `http://localhost:4321`. Keep a terminal in the repo root for the CLI and MCP steps. Fallback: run
`npm --prefix web run build` beforehand and serve `web/dist` with `npm --prefix web run preview`.

## Script

| Time | Beat | Do | Say |
|---|---|---|---|
| 0:00–0:30 | Hook | Home page | “Teams lose the first hours of a hackathon picking an idea — and pick one judges have already seen. This is the evidence of what actually won, and why.” |
| 0:30–1:30 | Similar situation | Similar → preset **Space data for non-experts** → open `skysense` | “Different problem, different stack, same situation. Every reason is labelled: organizer said it, team said it, or we inferred it — with the source.” |
| 1:30–2:00 | Honesty | Hackathons → Platanus Hack 26 Bogotá (full roster) → Hack the North 2025 (partial) | “Base rates only where every submission is indexed. Here we say so; there we refuse to.” |
| 2:00–2:45 | Patterns by kind | Patterns page: student major league vs agency open-data challenge | “Hardware and pop-culture hooks won 4 of 6 at student events and 0 of 20 across two NASA Space Apps editions. The playbook depends on the event.” |
| 2:45–4:00 | The harness | Guide → **See a real run** (NASA Space Apps 2026) | “Recon found a three-phase judging funnel where two phases never see the team, so the pitch lives on the page. Gate 2 stayed closed: the rules forbid starting early. And we tested the advice on 2024 winners it had never seen — the patterns only partly held, the recommended angle didn't, so the plan changed.” |
| 4:00–4:45 | Agents | Terminal: `node cli/crafterwiki.mjs event nasa-space-apps-2026`; mention `claude mcp add crafterwiki -- node mcp/server.mjs` and `/hack-plan` | “The same queries run in the CLI, an MCP server and the browser — one code path.” |
| 4:45–5:00 | Close | Home | “Open corpus, primary sources, no fake podiums. Tell us which hackathon to add next.” |

## Numbers to quote (corpus of 2026-09-14)

- 14 hackathons, 36 analyzed projects, 35 confirmed winners and finalists, 88 other submissions.
- NASA Space Apps 2024–2025 winners: 0 of 20 custom hardware; 9 of 20 without AI in the product.
- Holdout on 2024 winners: the recommended angle (a local decision tool) matched 2 of 10. The agency
  playbook scored 1.6 mechanisms per winner vs 1.4 (open-source) and 0.8 (student), but only because of
  one mechanism the 2024 challenges asked for directly; without it the agency set scores 0.8.
- Student major-league winners: physical artifact 4 of 6; cultural reference hook 4 of 6.

## Known limits to state if asked

- Small samples; mechanism tags are mostly curator inference.
- Not deployed yet; English only.
- No base rates for winners-only events.
