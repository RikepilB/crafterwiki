#!/usr/bin/env node
// CrafterWIKI CLI. Every command accepts --json for agent use.
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { createPlan } from './plan.mjs';
import {
  ROOT, loadCorpus, validate, search, similar, patterns, eventBrief, deal, show, build,
} from './lib.mjs';

const HELP = `crafterwiki — winning-hackathon wiki + demo-first planning data

Usage: crafterwiki <command> [options]

Commands
  validate                         Check data/ against schema/taxonomy.json (exit 1 on errors)
  search [text]                    Full-text + facet search across projects and roster entries
  similar                          "Similar situation" lookup by facets or --to <slug>
  patterns                         Mechanism/lens/domain frequencies + per-event saturation
  event <hackathon-slug>           Recon brief: rubric, judges, prizes, saturation, priors
  deal                             Random analyzed winner ("no idea? deal me one")
  show <slug>                      Full record (project, hackathon, or event/entry slug)
  list [hackathons|projects]       List slugs
  facets [name]                    Allowed taxonomy values (placement_status, domains, mechanisms, ...)
  build [--out dist]               Emit static read API under <out>/api/v0
  plan <slug> --mode <mode>        Create a builder workspace (project or hackathon)
                                  --event <slug> optional; --out <parent> defaults to builder-runs/

Filters (search, similar, deal, patterns)
  --domain a,b  --mechanism a,b  --lens a,b  --ai a,b  --tech a,b
  --status s    --event <slug>   --winners   --include-entries   --include-reported
  --event-kind <kind>  --all (patterns over every analyzed record)  --limit n  --seed n

Global
  --json        Machine-readable output
  --root <dir>  Corpus root (default: this repo)
  --private     Also load the gitignored private/ overlay (local planning only; build refuses it)
`;

const options = {
  json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' }, root: { type: 'string' },
  domain: { type: 'string' }, mechanism: { type: 'string' }, lens: { type: 'string' },
  ai: { type: 'string' }, tech: { type: 'string' }, status: { type: 'string' }, event: { type: 'string' },
  'event-kind': { type: 'string' }, winners: { type: 'boolean' }, 'include-entries': { type: 'boolean' },
  'include-reported': { type: 'boolean' }, all: { type: 'boolean' }, limit: { type: 'string' },
  seed: { type: 'string' }, to: { type: 'string' }, out: { type: 'string' }, private: { type: 'boolean' },
  mode: { type: 'string' },
};

function label(it) {
  let s = it.status;
  if (it.rank) s += ` #${it.rank}`;
  if (it.votes) s += `, ${it.votes} votes`;
  return s;
}

function card(it) {
  const lines = [`${it.name}  [${label(it)}]  ${it.event}`, `  ${it.tagline}`];
  if (it.domains.length) lines.push(`  domains:    ${it.domains.join(', ')}`);
  if (it.mechanisms.length) lines.push(`  mechanisms: ${it.mechanisms.join(', ')}`);
  if (it.shared) lines.push(`  shared:     ${Object.entries(it.shared).map(([k, v]) => `${k}=${v.join('|')}`).join('  ')}`);
  lines.push(`  slug: ${it.slug}${it.score !== undefined ? `   score: ${it.score}` : ''}${it.analyzed ? '' : '   (roster entry, not analyzed)'}`);
  return lines.join('\n');
}

function table(title, rows) {
  if (!rows.length) return `${title}\n  (none)`;
  const max = rows[0][1];
  return [title, ...rows.map(([k, n]) => `  ${String(k).padEnd(28)} ${String(n).padStart(3)} ${'#'.repeat(Math.max(1, Math.round((n / max) * 20)))}`)].join('\n');
}

function main(argv) {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true, strict: true });
  } catch (e) {
    console.error(`${e.message}\n\n${HELP}`);
    return 2;
  }
  const { values: o, positionals } = parsed;
  const [command, ...rest] = positionals;
  if (o.help || !command) {
    console.log(HELP);
    return command || o.help ? 0 : 2;
  }
  const corpus = loadCorpus(o.root ? resolve(o.root) : ROOT, { includePrivate: Boolean(o.private) });
  const out = (data, human) => console.log(o.json ? JSON.stringify(data, null, 2) : human(data));
  const filters = {
    domain: o.domain, mechanism: o.mechanism, lens: o.lens, ai: o.ai, tech: o.tech, status: o.status,
    event: o.event, eventKind: o['event-kind'], winnersOnly: o.winners, limit: o.limit, seed: o.seed, to: o.to,
    includeEntries: o['include-entries'], includeReported: o['include-reported'],
  };

  switch (command) {
    case 'plan': {
      if (rest.length !== 1) throw new Error('usage: crafterwiki plan <slug> --mode project|hackathon');
      if (o.private) throw new Error('plan does not export private overlays');
      if (o.event && !corpus.hackathons.some((h) => h.slug === o.event)) throw new Error(`unknown event "${o.event}"`);
      const r = createPlan({ slug: rest[0], mode: o.mode, event: o.event, out: o.out ?? resolve(ROOT, 'builder-runs') });
      out(r, (d) => `Created ${d.mode} workspace at ${d.directory}\nStatus: ${d.status}; complete README.md and the numbered stages.`);
      return 0;
    }
    case 'validate': {
      const r = validate(corpus);
      out({ ...r, counts: { hackathons: corpus.hackathons.length, projects: corpus.projects.length, items: corpus.items.length } }, (d) => [
        ...d.errors.map((e) => `ERROR  ${e}`), ...d.warnings.map((w) => `WARN   ${w}`),
        `${d.errors.length} error(s), ${d.warnings.length} warning(s) — ${d.counts.hackathons} hackathons, ${d.counts.projects} analyzed projects, ${d.counts.items} searchable items`,
      ].join('\n'));
      return r.errors.length ? 1 : 0;
    }
    case 'search': {
      const r = search(corpus, { ...filters, query: rest.join(' ') });
      out(r, (d) => (d.length ? d.map(card).join('\n\n') : 'No matches.'));
      return 0;
    }
    case 'similar': {
      const r = similar(corpus, filters);
      out(r, (d) => (d.length ? d.map(card).join('\n\n') : 'No similar records.'));
      return 0;
    }
    case 'patterns': {
      const r = patterns(corpus, { event: o.event, eventKind: o['event-kind'], all: o.all, includeReported: o['include-reported'] });
      out(r, (d) => [
        `Sample: ${d.sample.analyzed_records} records (${d.sample.basis})`,
        table('Winning mechanisms', d.mechanisms), table('Judging lenses', d.judging_lenses),
        table('Domains', d.domains), table('AI patterns', d.ai_patterns), table('Build styles', d.build_styles),
        'Saturation by event (base rates only where roster_coverage = full)',
        ...Object.entries(d.saturation).map(([k, v]) => `  ${k}: ${v.indexed}${v.of_teams ? `/${v.of_teams}` : ''} indexed, roster ${v.roster_coverage}${v.base_rate_valid ? '' : ' (NOT a base rate)'}; tracks ${v.tracks.map(([t, n]) => `${t}=${n}`).join(', ') || '-'}; top domains ${v.top_domains.map(([t, n]) => `${t}=${n}`).join(', ')}`),
      ].join('\n\n'));
      return 0;
    }
    case 'event': {
      if (!rest[0]) throw new Error('usage: crafterwiki event <hackathon-slug>');
      const r = eventBrief(corpus, rest[0]);
      out(r, (d) => [
        `${d.name}  (${d.kind}, ${d.format})  ${d.dates.filter(Boolean).join(' → ') || 'dates unknown'}  ${d.location}`,
        `Results: ${d.results_status}${d.theme ? `   Theme: ${d.theme}` : ''}`,
        d.tracks.length ? `Tracks: ${d.tracks.map((t) => t.name).join(' | ')}` : 'Tracks: none listed',
        d.required_tech.length ? `Required tech: ${d.required_tech.join(', ')}` : null,
        `Judging criteria: ${d.judging.criteria.map((c) => c.label).join(', ') || 'not published'}`,
        d.judging.judge_profile ? `Judges${d.judging.judges ? ` (${d.judging.judges})` : ''}: ${d.judging.judge_profile}` : null,
        d.judging.notes ? `Judging notes: ${d.judging.notes}` : null,
        d.prizes.length ? `Prizes:\n${d.prizes.map((p) => `  - ${p.name}${p.reward ? `: ${p.reward}` : ''}${p.criteria?.length ? ` [${p.criteria.join(', ')}]` : ''}`).join('\n')}` : null,
        `Saturation: ${d.saturation.indexed}${d.saturation.of_teams ? `/${d.saturation.of_teams}` : ''} indexed, roster ${d.saturation.roster_coverage}${d.saturation.base_rate_valid ? '' : ' (NOT a base rate)'}; tracks ${d.saturation.tracks.map(([t, n]) => `${t}=${n}`).join(', ') || '-'}; domains ${d.saturation.domains.map(([t, n]) => `${t}=${n}`).join(', ') || '-'}`,
        d.known_results.length ? `Known results:\n${d.known_results.map((k) => `  - ${k.name} [${k.status}${k.rank ? ` #${k.rank}` : ''}] ${k.mechanisms.join(', ')}`).join('\n')}` : 'Known results: none',
        `Prior from same event kind (${d.prior_from_same_event_kind.events.join(', ') || 'none'}):\n  mechanisms ${d.prior_from_same_event_kind.mechanisms.map(([t, n]) => `${t}=${n}`).join(', ') || '-'}\n  lenses ${d.prior_from_same_event_kind.lenses.map(([t, n]) => `${t}=${n}`).join(', ') || '-'}`,
        d.organizer_takeaways.length ? `Organizer takeaways:\n${d.organizer_takeaways.map((t) => `  - ${t}`).join('\n')}` : null,
        d.curator_notes ? `Curator notes: ${d.curator_notes}` : null,
        `Sources: ${d.sources.join(' ')}`,
      ].filter(Boolean).join('\n'));
      return 0;
    }
    case 'deal': {
      const r = deal(corpus, filters);
      out(r, (d) => (d ? card(d) : 'Nothing matches those filters.'));
      return r ? 0 : 1;
    }
    case 'show': {
      if (!rest[0]) throw new Error('usage: crafterwiki show <slug>');
      const r = show(corpus, rest[0]);
      if (!r) {
        console.error(`No record with slug "${rest[0]}".`);
        return 1;
      }
      console.log(JSON.stringify(r, null, 2));
      return 0;
    }
    case 'list': {
      const what = rest[0] ?? 'hackathons';
      const rows = what === 'projects'
        ? corpus.projects.map((p) => ({ slug: p.slug, hackathon: p.hackathon, status: p.placement?.status }))
        : corpus.hackathons.map((h) => ({ slug: h.slug, year: h.year, kind: h.kind, results: h.results_status }));
      out(rows, (d) => d.map((r) => Object.values(r).join('  ')).join('\n'));
      return 0;
    }
    case 'facets': {
      const t = corpus.taxonomy;
      const names = Object.keys(t).filter((k) => Array.isArray(t[k]));
      const pick = rest[0] ? [rest[0]] : names;
      const unknown = pick.filter((n) => !names.includes(n));
      if (unknown.length) throw new Error(`unknown facet "${unknown[0]}"; one of: ${names.join(', ')}`);
      const data = Object.fromEntries(pick.map((n) => [n, t[n]]));
      out(data, (d) => Object.entries(d).map(([n, vals]) => `${n}\n${vals.map((v) => `  ${v.id.padEnd(28)} ${v.definition}`).join('\n')}`).join('\n\n'));
      return 0;
    }
    case 'build': {
      const dir = resolve(o.out ?? resolve(ROOT, 'dist'));
      const { errors } = validate(corpus);
      if (errors.length) {
        console.error(`Refusing to build: ${errors.length} validation error(s). Run crafterwiki validate.`);
        return 1;
      }
      const m = build(corpus, dir);
      out(m, (d) => `Built static API v0 at ${dir}\n  ${JSON.stringify(d.counts)}`);
      return 0;
    }
    default:
      console.error(`Unknown command "${command}".\n\n${HELP}`);
      return 2;
  }
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (e) {
  console.error(`error: ${e.message}`);
  process.exitCode = 1;
}
