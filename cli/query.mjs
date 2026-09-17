// Pure corpus logic: validation and queries over an already-loaded corpus.
// No Node built-ins here, so the CLI, the MCP server, the static build and the web client in the
// browser all run exactly the same semantics.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'for', 'with', 'on', 'de', 'la', 'el', 'y', 'en', 'que', 'is', 'it']);

export function slugify(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function tokenize(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOP.has(t));
}

function eventLabel(h) {
  return h ? `${h.name} ${h.edition}`.trim() : 'unknown event';
}

// Flattens analyzed projects and lightweight roster entries into one searchable shape.
export function buildItems(hackathons, projects) {
  const byEvent = new Map(hackathons.map((h) => [h.slug, h]));
  const items = projects.map((p) => {
    const h = byEvent.get(p.hackathon);
    const a = p.analysis ?? {};
    return {
      kind: 'project', slug: p.slug, name: p.name, hackathon: p.hackathon, event: eventLabel(h),
      year: h?.year ?? null, event_kind: h?.kind ?? null,
      tagline: p.tagline ?? '', status: p.placement?.status ?? 'unknown',
      rank: p.placement?.rank ?? null, votes: p.placement?.votes ?? null,
      awards: p.placement?.awards ?? [], track: p.placement?.track ?? null,
      domains: p.domains ?? [], mechanisms: a.mechanisms ?? [], lenses: a.judging_lens ?? [],
      ai: p.tech?.ai_patterns ?? [], stack: p.tech?.stack ?? [], build_style: p.build_style ?? null,
      confidence: a.confidence ?? null, analyzed: true,
      text: [p.name, p.tagline, p.problem, p.solution, p.demo_moment,
        ...(a.why_it_stood_out ?? []).map((w) => w.claim), ...(a.lessons ?? [])].filter(Boolean).join(' '),
    };
  });
  for (const h of hackathons) {
    for (const e of h.entries ?? []) {
      if (e.project) continue;
      items.push({
        kind: 'entry', slug: `${h.slug}/${slugify(e.name)}`, name: e.name, hackathon: h.slug, event: eventLabel(h),
        year: h.year ?? null, event_kind: h.kind ?? null,
        tagline: e.tagline ?? '', status: e.placement?.status ?? 'unknown',
        rank: e.placement?.rank ?? null, votes: e.placement?.votes ?? null,
        awards: [], track: e.track ?? null, domains: e.domains ?? [], mechanisms: [], lenses: [],
        ai: [], stack: [], build_style: null, confidence: null, analyzed: false,
        text: [e.name, e.tagline, e.note].filter(Boolean).join(' '),
      });
    }
  }
  return items;
}

function statusMeta(corpus, id) {
  return corpus.taxonomy.placement_status.find((s) => s.id === id) ?? { rank_weight: 0, counts_as_winner: false };
}

export function isWinner(corpus, item, { includeReported = false } = {}) {
  if (includeReported && item.status === 'reported-winner') return true;
  return statusMeta(corpus, item.status).counts_as_winner;
}

export function validate(corpus) {
  const errors = [];
  const warnings = [];
  const t = corpus.taxonomy;
  const ids = (k) => new Set((t[k] ?? []).map((v) => v.id));
  const V = {
    status: ids('placement_status'), basis: ids('analysis_basis'), domains: ids('domains'),
    mechanisms: ids('mechanisms'), lenses: ids('judging_lenses'), ai: ids('ai_patterns'),
    build: ids('build_styles'), format: ids('event_formats'), kind: ids('event_kinds'),
    results: ids('results_status'), source: ids('source_kinds'), coverage: ids('roster_coverage'),
  };
  const err = (file, msg) => errors.push(`${file}: ${msg}`);
  const warn = (file, msg) => warnings.push(`${file}: ${msg}`);
  const checkEnum = (file, field, value, set) => {
    if (!set.has(value)) err(file, `${field} "${value}" is not in schema/taxonomy.json`);
  };
  const checkEnumList = (file, field, values, set) => {
    if (values === undefined) return;
    if (!Array.isArray(values)) return err(file, `${field} must be an array`);
    for (const v of values) checkEnum(file, field, v, set);
  };
  const checkSources = (file, sources) => {
    if (!Array.isArray(sources) || sources.length === 0) return err(file, 'at least one source is required');
    sources.forEach((s, i) => {
      if (!/^(https?:\/\/|private:|data\/)/.test(s.url ?? '')) err(file, `sources[${i}].url must be http(s), private: or a data/ path`);
      checkEnum(file, `sources[${i}].kind`, s.kind, V.source);
      if (!DATE.test(s.retrieved_at ?? '')) err(file, `sources[${i}].retrieved_at must be YYYY-MM-DD`);
    });
  };

  const hackBySlug = new Map();
  for (const h of corpus.hackathons) {
    const f = h._file;
    for (const req of ['slug', 'name', 'year', 'kind', 'format', 'results_status', 'roster_coverage']) {
      if (h[req] === undefined || h[req] === null || h[req] === '') err(f, `missing ${req}`);
    }
    if (!SLUG.test(h.slug ?? '')) err(f, `slug "${h.slug}" must be kebab-case`);
    if (hackBySlug.has(h.slug)) err(f, `duplicate hackathon slug ${h.slug}`);
    hackBySlug.set(h.slug, h);
    if (!f.endsWith(`/${h.slug}.json`)) err(f, 'file name must match slug');
    checkEnum(f, 'kind', h.kind, V.kind);
    checkEnum(f, 'format', h.format, V.format);
    checkEnum(f, 'results_status', h.results_status, V.results);
    checkEnum(f, 'roster_coverage', h.roster_coverage, V.coverage);
    for (const d of ['start_date', 'end_date']) {
      if (h[d] != null && !DATE.test(h[d])) err(f, `${d} must be YYYY-MM-DD`);
    }
    for (const c of h.judging?.criteria ?? []) checkEnum(f, 'judging.criteria.lens', c.lens, V.lenses);
    for (const p of h.prizes ?? []) checkEnumList(f, `prizes["${p.name}"].criteria`, p.criteria, V.lenses);
    const trackIds = new Set((h.tracks ?? []).map((tr) => tr.id));
    (h.entries ?? []).forEach((e, i) => {
      if (!e.name) err(f, `entries[${i}] missing name`);
      if (e.project) return;
      checkEnum(f, `entries[${i}].placement.status`, e.placement?.status, V.status);
      if (e.placement?.status === 'reported-winner') err(f, `entries[${i}] reported-winner must be promoted to a project record with verification`);
      checkEnumList(f, `entries[${i}].domains`, e.domains, V.domains);
      if (e.track && !trackIds.has(e.track)) err(f, `entries[${i}].track "${e.track}" is not in tracks`);
    });
    (h.organizer_takeaways ?? []).forEach((o, i) => {
      if (o.source !== undefined && !h.sources?.[o.source]) err(f, `organizer_takeaways[${i}].source index out of range`);
    });
    checkSources(f, h.sources);
    if (h.results_status === 'upcoming' && (h.entries ?? []).length) warn(f, 'upcoming event already has entries');
    if (h.roster_coverage === 'full' && h.teams && (h.entries ?? []).length !== h.teams) {
      warn(f, `roster_coverage full but ${(h.entries ?? []).length} entries for ${h.teams} teams`);
    }
  }

  const projSlugs = new Set();
  for (const p of corpus.projects) {
    const f = p._file;
    for (const req of ['slug', 'name', 'hackathon', 'tagline', 'placement', 'domains', 'analysis']) {
      if (p[req] === undefined || p[req] === null) err(f, `missing ${req}`);
    }
    if (!SLUG.test(p.slug ?? '')) err(f, `slug "${p.slug}" must be kebab-case`);
    if (projSlugs.has(p.slug)) err(f, `duplicate project slug ${p.slug}`);
    projSlugs.add(p.slug);
    if (!f.endsWith(`/${p.hackathon}/${p.slug}.json`)) err(f, 'path must be data/projects/<hackathon>/<slug>.json');
    const h = hackBySlug.get(p.hackathon);
    if (!h) err(f, `hackathon "${p.hackathon}" does not exist`);
    else if (!(h.entries ?? []).some((e) => e.project === p.slug)) warn(f, `not referenced from ${h.slug} entries`);
    checkEnum(f, 'placement.status', p.placement?.status, V.status);
    if (p.placement?.status === 'reported-winner' && !p.placement?.verification) {
      err(f, 'reported-winner requires placement.verification');
    }
    if (p.placement?.track && h && !(h.tracks ?? []).some((tr) => tr.id === p.placement.track)) {
      err(f, `placement.track "${p.placement.track}" is not in ${h.slug} tracks`);
    }
    checkEnumList(f, 'domains', p.domains, V.domains);
    if (p.build_style != null) checkEnum(f, 'build_style', p.build_style, V.build);
    checkEnumList(f, 'tech.ai_patterns', p.tech?.ai_patterns, V.ai);
    const a = p.analysis ?? {};
    checkEnumList(f, 'analysis.mechanisms', a.mechanisms, V.mechanisms);
    checkEnumList(f, 'analysis.judging_lens', a.judging_lens, V.lenses);
    if (!['high', 'medium', 'low'].includes(a.confidence)) err(f, 'analysis.confidence must be high|medium|low');
    (a.why_it_stood_out ?? []).forEach((w, i) => {
      checkEnum(f, `why_it_stood_out[${i}].basis`, w.basis, V.basis);
      if (w.basis !== 'curator-inference' && w.source === undefined) {
        err(f, `why_it_stood_out[${i}] (${w.basis}) needs a source index`);
      }
      if (w.source !== undefined && !p.sources?.[w.source]) err(f, `why_it_stood_out[${i}].source index out of range`);
    });
    checkSources(f, p.sources);
    // Private interviews can identify people even when anonymized; publishing needs consent.
    if ((p.sources ?? []).some((s) => String(s.url).startsWith('private:')) && !p.publish_gate) {
      err(f, 'records citing private: sources need a publish_gate');
    }
    if (p._private && !p.publish_gate) err(f, 'private/ overlay records need a publish_gate');
  }
  for (const h of corpus.hackathons) {
    for (const e of h.entries ?? []) {
      if (e.project && !projSlugs.has(e.project)) err(h._file, `entry "${e.name}" references missing project ${e.project}`);
    }
  }
  return { errors, warnings };
}

// Records that must never reach a publishing surface (static API, web): consent-gated records and
// anything loaded from the gitignored private/ overlay.
export function publicCorpus(corpus) {
  const withheld = new Set(corpus.projects.filter((p) => p.publish_gate || p._private).map((p) => p.slug));
  return {
    ...corpus,
    projects: corpus.projects.filter((p) => !withheld.has(p.slug)),
    items: corpus.items.filter((i) => !withheld.has(i.slug)),
    withheld: withheld.size,
  };
}

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : String(v).split(',').map((s) => s.trim()).filter(Boolean));
const intersects = (a, b) => b.some((x) => a.includes(x));

export function search(corpus, opts = {}) {
  const { query = '', status, event, winnersOnly = false, analyzedOnly = false, limit = 20 } = opts;
  const filters = {
    domains: asList(opts.domain), mechanisms: asList(opts.mechanism), lenses: asList(opts.lens),
    stack: asList(opts.tech), ai: asList(opts.ai),
  };
  const terms = tokenize(query);
  const out = [];
  for (const it of corpus.items) {
    if (status && !asList(status).includes(it.status)) continue;
    if (event && it.hackathon !== event) continue;
    if (opts.eventKind && it.event_kind !== opts.eventKind) continue;
    if (winnersOnly && !isWinner(corpus, it)) continue;
    if (analyzedOnly && !it.analyzed) continue;
    if (Object.entries(filters).some(([k, want]) => want.length && !intersects(it[k], want))) continue;
    let score = statusMeta(corpus, it.status).rank_weight / 10;
    if (terms.length) {
      const hay = tokenize(`${it.text ?? `${it.name} ${it.tagline}`} ${it.stack.join(' ')} ${it.domains.join(' ')}`);
      const hits = terms.filter((term) => hay.some((h) => h.startsWith(term))).length;
      if (!hits) continue;
      score += (hits / terms.length) * 10;
    }
    out.push({ ...it, score: Number(score.toFixed(3)) });
  }
  return out.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, Number(limit));
}

export const SIMILARITY_WEIGHTS = { domains: 3, mechanisms: 3, lenses: 2, ai: 1.5, stack: 1 };

function jaccard(a, b) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a);
  const inter = [...new Set(b)].filter((x) => A.has(x)).length;
  return inter / new Set([...a, ...b]).size;
}

// "Similar situation" lookup: weighted facet overlap, nudged by placement strength.
export function similar(corpus, opts = {}) {
  let profile = {
    domains: asList(opts.domain), mechanisms: asList(opts.mechanism), lenses: asList(opts.lens),
    ai: asList(opts.ai), stack: asList(opts.tech),
  };
  let exclude = null;
  if (opts.to) {
    const base = corpus.items.find((i) => i.slug === opts.to);
    if (!base) throw new Error(`unknown slug "${opts.to}"`);
    profile = { domains: base.domains, mechanisms: base.mechanisms, lenses: base.lenses, ai: base.ai, stack: base.stack };
    exclude = base.slug;
  }
  const active = Object.entries(profile).filter(([, v]) => v.length);
  if (!active.length) throw new Error('similar needs --to <slug> or at least one of --domain/--mechanism/--lens/--ai/--tech');
  const totalWeight = active.reduce((s, [k]) => s + SIMILARITY_WEIGHTS[k], 0);
  const out = [];
  for (const it of corpus.items) {
    if (it.slug === exclude) continue;
    if (!opts.includeEntries && !it.analyzed) continue;
    let score = 0;
    const shared = {};
    for (const [k, want] of active) {
      const j = jaccard(it[k], want);
      if (j > 0) shared[k] = it[k].filter((x) => want.includes(x));
      score += SIMILARITY_WEIGHTS[k] * j;
    }
    if (score === 0) continue;
    score = score / totalWeight + statusMeta(corpus, it.status).rank_weight / 100;
    out.push({ ...it, score: Number(score.toFixed(3)), shared });
  }
  return out.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, Number(opts.limit ?? 5));
}

export function count(values) {
  const m = new Map();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

export function patterns(corpus, opts = {}) {
  const pool = corpus.items.filter((i) => i.analyzed
    && (!opts.event || i.hackathon === opts.event)
    && (!opts.eventKind || i.event_kind === opts.eventKind)
    && (opts.all || isWinner(corpus, i, { includeReported: opts.includeReported })));
  const roster = corpus.items.filter((i) => (!opts.event || i.hackathon === opts.event)
    && (!opts.eventKind || i.event_kind === opts.eventKind));
  const byEvent = {};
  for (const i of roster) {
    byEvent[i.hackathon] ??= { entries: 0, tracks: [], domains: [] };
    byEvent[i.hackathon].entries += 1;
    if (i.track) byEvent[i.hackathon].tracks.push(i.track);
    byEvent[i.hackathon].domains.push(...i.domains);
  }
  const events = new Map(corpus.hackathons.map((h) => [h.slug, h]));
  // Counts from partial rosters describe what we indexed, not what the event produced.
  const saturation = Object.fromEntries(Object.entries(byEvent).map(([k, v]) => [k, {
    indexed: v.entries, of_teams: events.get(k)?.teams ?? null,
    roster_coverage: events.get(k)?.roster_coverage ?? 'none',
    base_rate_valid: events.get(k)?.roster_coverage === 'full',
    tracks: count(v.tracks), top_domains: count(v.domains).slice(0, 5),
  }]));
  return {
    sample: { analyzed_records: pool.length, basis: opts.all ? 'all analyzed' : opts.includeReported ? 'winners + reported winners' : 'confirmed winners/finalists' },
    mechanisms: count(pool.flatMap((i) => i.mechanisms)),
    judging_lenses: count(pool.flatMap((i) => i.lenses)),
    domains: count(pool.flatMap((i) => i.domains)),
    ai_patterns: count(pool.flatMap((i) => i.ai)),
    build_styles: count(pool.map((i) => i.build_style).filter(Boolean)),
    saturation,
  };
}

export function eventBrief(corpus, slug) {
  const h = corpus.hackathons.find((x) => x.slug === slug);
  if (!h) throw new Error(`unknown hackathon "${slug}"`);
  const items = corpus.items.filter((i) => i.hackathon === slug);
  const priors = corpus.items.filter((i) => i.analyzed && i.event_kind === h.kind && i.hackathon !== slug && isWinner(corpus, i));
  return {
    slug: h.slug, name: `${h.name} ${h.edition}`, kind: h.kind, format: h.format,
    dates: [h.start_date, h.end_date], location: [h.city, ...(h.countries ?? [])].filter(Boolean).join(', '),
    results_status: h.results_status, theme: h.theme ?? null, tracks: h.tracks ?? [],
    required_tech: h.required_tech ?? [], submission_requirements: h.submission_requirements ?? [],
    judging: {
      criteria: h.judging?.criteria ?? [], judge_profile: h.judging?.judge_profile_summary ?? null,
      judges: (h.judging?.judges ?? []).length, notes: h.judging?.notes ?? null,
    },
    prizes: h.prizes ?? [],
    saturation: {
      indexed: items.length, of_teams: h.teams ?? null, roster_coverage: h.roster_coverage ?? 'none',
      base_rate_valid: h.roster_coverage === 'full',
      tracks: count(items.map((i) => i.track).filter(Boolean)), domains: count(items.flatMap((i) => i.domains)).slice(0, 8),
    },
    known_results: items.filter((i) => i.status !== 'submitted-only').map((i) => ({ slug: i.slug, name: i.name, status: i.status, rank: i.rank, votes: i.votes, awards: i.awards, mechanisms: i.mechanisms })),
    prior_from_same_event_kind: {
      events: [...new Set(priors.map((i) => i.hackathon))],
      mechanisms: count(priors.flatMap((i) => i.mechanisms)).slice(0, 8),
      lenses: count(priors.flatMap((i) => i.lenses)),
    },
    organizer_takeaways: (h.organizer_takeaways ?? []).map((o) => o.claim),
    curator_notes: h.curator_notes ?? null,
    sources: (h.sources ?? []).map((s) => s.url),
  };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// "No idea? Deal me one": a random analyzed winner, optionally filtered.
export function deal(corpus, opts = {}) {
  const pool = search(corpus, { ...opts, winnersOnly: !opts.includeReported, analyzedOnly: true, limit: 10_000 })
    .filter((i) => !opts.includeReported || isWinner(corpus, i, { includeReported: true }));
  if (!pool.length) return null;
  const rand = opts.seed !== undefined && opts.seed !== null && opts.seed !== '' ? mulberry32(Number(opts.seed)) : Math.random;
  return pool[Math.floor(rand() * pool.length)];
}

export function show(corpus, slug) {
  const project = corpus.projects.find((p) => p.slug === slug);
  if (project) {
    const { _file, _private, ...rest } = project;
    return { kind: 'project', file: _file, ...rest };
  }
  const hackathon = corpus.hackathons.find((h) => h.slug === slug);
  if (hackathon) {
    const { _file, ...rest } = hackathon;
    return { kind: 'hackathon', file: _file, ...rest };
  }
  const entry = corpus.items.find((i) => i.slug === slug);
  if (entry) return entry;
  return null;
}
