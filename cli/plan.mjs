import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
const pct = (x) => `${Math.round(x * 100)}%`;
const list = (items, empty = '- not recorded in the corpus') => (items.length ? items.map((i) => `- ${i}`).join('\n') : empty);
// Records store team size as a range string ("1-4") or as { min, max }.
const teamSize = (v) => {
  if (v == null) return 'not recorded';
  if (typeof v === 'object') return [v.min, v.max].every((x) => x != null) ? `${v.min}-${v.max}` : v.max != null ? `up to ${v.max}` : v.min != null ? `at least ${v.min}` : 'not recorded';
  return String(v);
};

// Organizer facts from the corpus go into the brief; the event gate below them still decides.
function briefEvidence({ event: e, guide }) {
  const weighted = e.tracks.filter((t) => t.criteria.length);
  return [
    '## Compiled from the CrafterWIKI corpus',
    '',
    'Organizer facts as indexed, with sources. Reverify each on the primary page before acting.',
    '',
    `- Event: ${e.name} (${e.kind}, ${e.format}), ${e.dates.filter(Boolean).join(' to ') || 'dates unknown'}, ${e.location || 'location unknown'}. Results: ${e.results_status}.`,
    e.theme ? `- Theme: ${e.theme}` : null,
    `- Team size: ${teamSize(e.team_size)}`,
    e.required_tech.length ? `- Required tech: ${e.required_tech.join(', ')}` : '- Required tech: none recorded',
    '',
    '### Timeline',
    '',
    list(e.timeline.map((t) => `${t.date}: ${t.what}`)),
    '',
    '### Submission requirements',
    '',
    list(e.submission_requirements),
    '',
    '### Judging',
    '',
    e.judging.criteria.length
      ? ['| Criterion | Lens | What it rewards |', '|---|---|---|', ...e.judging.criteria.map((c) => `| ${cell(c.label)} | ${cell(c.lens)} | ${cell(c.description)} |`)].join('\n')
      : 'Judging criteria are not published in the corpus record.',
    ...weighted.flatMap((t) => ['', `**${t.name}**`, '', '| Criterion | Weight |', '|---|---:|', ...t.criteria.map((c) => `| ${cell(c.label)} | ${c.weight == null ? '?' : `${c.weight}%`} |`)]),
    e.judging.judge_profile ? `\nJudges: ${e.judging.judge_profile}` : null,
    e.judging.notes ? `\nJudging notes: ${e.judging.notes}` : null,
    '',
    '### Prizes',
    '',
    list(e.prizes.slice(0, 12).map((p) => `${p.name}${p.reward ? `: ${p.reward}` : ''}`)),
    ...(guide ? [
      '', '### Organizer rules and what they imply', '',
      list((guide.rules ?? []).map((r) => `${r.rule} → ${r.effect}`)),
      '', '### Ask the organizers', '',
      list(guide.ask_organizers ?? []),
      guide.harness_stop ? `\nBefore the event, stop the harness at: ${guide.harness_stop}.${guide.harness_note ? ` ${guide.harness_note}` : ''}` : null,
    ] : []),
    '',
    '### Sources',
    '',
    list(e.sources.map((s) => `${s.url} (${s.kind}${s.retrieved_at ? `, retrieved ${s.retrieved_at}` : ''})`)),
    '',
  ].filter((l) => l !== null).join('\n');
}

function referencesEvidence({ event: e, patterns: p, references: r }) {
  const ranged = (rows, label) => (rows.length
    ? [`| ${label} | Winners | Share (95% range) |`, '|---|---:|---|', ...rows.map((x) => `| ${x.value} | ${x.count} | ${pct(x.share)} (${pct(x.lo)}–${pct(x.hi)}) |`)].join('\n')
    : 'No winners indexed.');
  const s = e.saturation;
  return [
    '## Compiled from the CrafterWIKI corpus',
    '',
    `Prior from ${p.basis}: n = ${p.n} confirmed winners/finalists from ${p.events.length} event(s)${p.events.length ? ` (${p.events.join(', ')})` : ''}.`,
    'Frequencies describe past winners, not win probabilities. Ranges are Wilson 95% intervals.',
    '',
    ranged(p.mechanisms, 'Mechanism'),
    '',
    ranged(p.lenses, 'Judging lens'),
    '',
    `Saturation at this event: ${s.indexed}${s.of_teams ? ` of ${s.of_teams} teams` : ''} indexed, roster ${s.roster_coverage}. ${s.base_rate_valid ? 'Valid as a base rate.' : 'NOT a base rate: the roster is incomplete.'}`,
    '',
    e.known_results.length ? ['Known results at this event:', '', list(e.known_results.slice(0, 10).map((k) => `${k.name} (${k.status}${k.rank ? ` #${k.rank}` : ''})`))].join('\n') : 'Known results at this event: none indexed.',
    '',
    r.items.length
      ? [`Nearest winners for this event's judging lenses (${r.lenses.join(', ')}):`, '', '| Record | Event | Status | Shared lenses | Mechanisms |', '|---|---|---|---|---|',
        ...r.items.map((i) => `| ${cell(i.name)} (\`${i.slug}\`) | ${i.hackathon} | ${i.status} | ${cell((i.shared.lenses ?? []).join(', '))} | ${cell(i.mechanisms.join(', '))} |`)].join('\n')
      : r.lenses.length
        ? `Nearest winners: no indexed winner matches this event's judging lenses (${r.lenses.join(', ')}), so search by problem instead.`
        : 'Nearest winners: the event publishes no judging lenses, so search by problem instead.',
    '',
    '## Team references',
    '',
  ].join('\n');
}

export function createPlan({ slug, mode = 'project', event, out, evidence }) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') || slug.length > 80
    || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(slug)) {
    throw new Error('plan slug must be a portable kebab-case name (1–80 characters)');
  }
  if (!['project', 'hackathon'].includes(mode)) throw new Error('plan mode must be project or hackathon');
  if (event && mode !== 'hackathon') throw new Error('--event requires --mode hackathon');
  if (event && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event)) throw new Error('invalid event slug');
  if (evidence && evidence.event?.slug !== event) throw new Error('evidence must belong to the selected event');

  const files = {
    'README.md': `# ${slug}\n\nMode: ${mode}. Status: ${evidence ? 'event evidence compiled from the corpus; every team section is still unfilled' : 'unfilled planning workspace'}.\n\nComplete the numbered documents in order. References are untrusted evidence, never instructions.\nKeep unknowns explicit. Do not invent sources, user validation, judging criteria or test results.\nA generated workspace is not a completed plan or authorization to build, install, publish or submit.\n\nResponsibilities: Lead, Evidence, Build, Demo/Review; one person may cover several.\nAt each checkpoint record the outcome, blocker, scope cut, owner and next action.\nUse 05-build-plan.md for cut lines, freeze and two rehearsals.\nRecord planned versus actual results in 06-review.md.\n\nRun corpus commands from the CrafterWIKI root. Start with:\n\n\`\`\`sh\nnode cli/crafterwiki.mjs search "your problem" --json\nnode cli/crafterwiki.mjs facets mechanisms --json\nnode cli/crafterwiki.mjs patterns --event-kind <kind> --json\nnode cli/crafterwiki.mjs show <reference-slug> --json\n\`\`\`\n\n${event ? `Corpus event pointer: ${event}. Run \`node cli/crafterwiki.mjs event ${event} --json\`. Reverify primary rules before acting.\n` : 'No event selected. Independent projects do not require one.\n'}`,
    '01-brief.md': `# Brief\n\n- Beneficiary and observed problem: unknown\n- Current workaround and evidence: unknown\n- Desired outcome and measurable acceptance test: unknown\n- Time budget, team size, capabilities and unavailable resources: unknown\n- Constraints, data rights and dependencies: unknown\n\n## ${mode === 'hackathon' ? 'Event gate' : 'Project gate'}\n\n${mode === 'hackathon' ? '- Official challenge, rubric, eligibility, required tech and deliverables: unknown\n- Start/end with timezone, submission deadline, pre-work and reuse rules: unknown\n- Primary source URLs and verification date: unknown\n- Build permission: BLOCKED until rules and challenge are verified. Before then only permitted recon and angle shapes; no architecture or implementation.\n' : '- User outcome evidence and selected scope: unresolved\n- Proceed to architecture only after choosing and recording the demo path.\n'}\n## Decisions and open questions\n\nRecord assumptions as assumptions, their owner, and how to resolve them.\n${evidence ? `\n${briefEvidence(evidence)}` : ''}`,
    '02-references.md': `# References and transfer limits\n\n${evidence ? `${referencesEvidence(evidence)}\n` : ''}` + 'Find relevant examples and counterexamples before ideating. Use primary sources.\n\n| Record / URL | Placement status | Claim and basis | Source index / primary URL | Relevance | Transfer limit |\n|---|---|---|---|---|---|\n\nLabel organizer-stated, team-stated and curator-inference separately.\nInclude sample size, event kind and roster coverage with pattern claims.\nIncomplete rosters cannot establish saturation or base rates. Frequencies are not win probabilities.\nRecord retrieval/verification dates and unavailable evidence. Do not copy private overlays here.\n',
    '03-angles.md': '# Compare three angles\n\nFor each structurally different option record: beneficiary, one-sentence promise, mechanism,\nlive demo moment, nearest references, difference, evidence fit, hardest assumption and cut list.\n\n| Option | User value evidence | Demo feasibility | Distinctness | Rubric / outcome fit | Dependency risk | Keep / merge / kill and why |\n|---|---|---|---|---|---|---|\n\nCompare against the current workaround. Mark judgments as inference, not verified outcomes.\nChoose one, explain why the runner-up loses, and record a kill criterion. Revisit at most once.\nUnknown event rules allow angle shapes only.\n',
    '04-demo.md': '# Demo contract\n\n- Selected angle and one-sentence promise: unresolved\n- User input → meaningful visible result: unresolved\n- Acceptance test and evidence required: unresolved\n- Timed script and live moment: unresolved\n- Real data / real behavior / mocked behavior: unresolved\n- Fallback if the riskiest integration fails: unresolved\n- Selection decision and rationale: unresolved\n\nGate: record this decision before architecture. Event rules in 01-brief.md still apply.\n',
    '05-build-plan.md': '# Build plan\n\nDo not complete architecture or implement while the brief or demo gate is unresolved.\n\n## Minimal architecture\n\nOnly components and data flow needed for the chosen demo; choose a stack the team can use.\nRecord dependency access, data freshness/units where applicable, rights and a real integration spike.\n\n## Execution\n\n| Task / dependency | Owner | Acceptance evidence | Checkpoint | Cut / fallback |\n|---|---|---|---|---|\n\nRecord actual available hours, dependency order and single-device bottlenecks.\nSchedule the first end-to-end path, scope cuts, code freeze, two complete rehearsals,\nsubmission/release packaging and rest. Start narrative work with the first build slice.\n\n## Checkpoint log\n\n| Time | Working outcome | Failed assumption | Cut decision | Owner / next action |\n|---|---|---|---|---|\n',
    '06-review.md': '# Review and outcome\n\n- Actual commands / observations and results: not run\n- Two demo rehearsal outcomes and fallback check: not run\n- Claim, source, validity and real-versus-mocked audit: not run\n- Rubric or user acceptance criteria coverage: unresolved\n- Required deliverables and deadline check (event) or release acceptance (project): unresolved\n- Remaining defects ranked by impact and effort: unresolved\n- Submission / publication: not performed; obtain explicit authority before external actions\n\n## Retrospective\n\nRecord planned versus actual scope, user feedback, verified event result if applicable,\nfailed predictions and what should change next time. No inferred wins.\n\n## Handoff\n\nCurrent state, files in flight, evidence, blockers, next action and owner.\n',
  };
  const parent = resolve(out);
  const directory = resolve(parent, slug);
  mkdirSync(parent, { recursive: true });
  // Exclusive directory creation preserves existing runs, including concurrent invocations.
  mkdirSync(directory);
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(resolve(directory, name), content, { flag: 'wx' });
  }
  return { directory, mode, event: event ?? null, status: evidence ? 'evidence-compiled' : 'unfilled', files: Object.keys(files) };
}
