import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  ROOT, loadCorpus, validate, search, similar, patterns, eventBrief, deal, build, isWinner, buildItems, publicCorpus, wilson,
} from '../cli/lib.mjs';

const corpus = loadCorpus();

function inTempDir(prefix, fn) {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// A copy of a real record under a new slug, so fixtures stay schema-valid as the corpus evolves.
function fixture(base, slug, patch = {}) {
  const src = structuredClone(base.projects.find((p) => p.slug === 'centinela'));
  return { ...src, slug, _file: `data/projects/${src.hackathon}/${slug}.json`, ...patch };
}

test('seed corpus validates with zero errors', () => {
  const { errors } = validate(corpus);
  assert.deepEqual(errors, []);
});

test('validator rejects values outside the taxonomy', () => {
  const broken = structuredClone(corpus);
  broken.projects[0].analysis.mechanisms = ['vibes'];
  const { errors } = validate(broken);
  assert.ok(errors.some((e) => e.includes('"vibes"')), errors.join('\n'));
});

test('non-curator claims must cite a source', () => {
  const broken = structuredClone(corpus);
  const p = broken.projects.find((x) => x.slug === 'centinela');
  delete p.analysis.why_it_stood_out[0].source;
  assert.ok(validate(broken).errors.some((e) => e.includes('needs a source index')));
});

test('submitted-only roster entries never count as winners', () => {
  const winners = search(corpus, { winnersOnly: true, limit: 1000 });
  assert.ok(winners.length > 0);
  assert.ok(winners.every((w) => w.status !== 'submitted-only' && w.status !== 'reported-winner'));
});

test('search ranks the confirmed procurement winner first', () => {
  const r = search(corpus, { query: 'procurement' });
  assert.equal(r[0].slug, 'centinela');
  assert.ok(r.some((i) => i.kind === 'entry'), 'roster entries should also match');
});

test('similar-to FurMe surfaces other physical, demo-first projects', () => {
  const r = similar(corpus, { to: 'furme', limit: 5 });
  assert.ok(r.length >= 3);
  assert.ok(r.every((i) => i.slug !== 'furme'));
  assert.ok(r.filter((i) => i.mechanisms.includes('physical-artifact')).length >= 3);
});

test('similar requires a profile', () => {
  assert.throws(() => similar(corpus, {}), /needs --to/);
});

test('patterns count confirmed winners only by default', () => {
  const p = patterns(corpus);
  const reported = corpus.items.filter((i) => i.status === 'reported-winner').length;
  const confirmed = corpus.items.filter((i) => i.analyzed && isWinner(corpus, i)).length;
  assert.equal(p.sample.analyzed_records, confirmed);
  assert.equal(patterns(corpus, { includeReported: true }).sample.analyzed_records, confirmed + reported);
  assert.ok(Object.keys(p.saturation).includes('platanus-hack-26-bogota'));
});

test('event brief exposes rubric and saturation', () => {
  const b = eventBrief(corpus, 'hack-the-north-2025');
  assert.deepEqual(b.judging.criteria.map((c) => c.lens), ['wow-factor', 'technical-depth', 'originality', 'design-ux']);
  const bogota = eventBrief(corpus, 'platanus-hack-26-bogota');
  assert.equal(bogota.saturation.indexed, 24);
  assert.equal(bogota.saturation.base_rate_valid, true);
  assert.equal(b.saturation.base_rate_valid, false, 'HTN 2025 is a partial roster, not a base rate');
});

test('partial rosters are never reported as base rates', () => {
  const { saturation } = patterns(corpus);
  for (const [slug, s] of Object.entries(saturation)) {
    const h = corpus.hackathons.find((x) => x.slug === slug);
    assert.equal(s.base_rate_valid, h.roster_coverage === 'full', slug);
  }
});

test('records citing private sources need a publish gate', () => {
  const broken = structuredClone(corpus);
  const p = fixture(broken, 'synthetic-private');
  p.sources = [...p.sources, { url: 'private:interview-z', kind: 'interview', retrieved_at: '2026-09-14' }];
  broken.projects.push(p);
  assert.ok(validate(broken).errors.some((e) => e.includes('publish_gate')));
  p.publish_gate = 'consent pending';
  assert.ok(!validate(broken).errors.some((e) => e.includes('synthetic-private')));
});

test('gated records and private overlays never reach the static build', () => {
  const c = structuredClone(corpus);
  c.projects.push(fixture(c, 'synthetic-gated', { publish_gate: 'consent pending' }));
  c.items = buildItems(c.hackathons, c.projects);
  inTempDir('crafterwiki-gate-', (dir) => {
    const m = build(c, dir);
    assert.equal(m.withheld, 1);
    const index = JSON.parse(readFileSync(join(dir, 'api', 'v0', 'index.json'), 'utf8'));
    assert.ok(!index.items.some((i) => i.slug === 'synthetic-gated'));
    assert.ok(!existsSync(join(dir, 'api', 'v0', 'projects', 'synthetic-gated.json')));
    assert.throws(() => build({ ...corpus, private: true }, dir), /private/);
  });
});

test('private overlay replaces public records locally and stays unpublishable',
  { skip: !existsSync(join(ROOT, 'private', 'data', 'projects')) && 'no private/ overlay on this machine' }, () => {
    const c = loadCorpus(ROOT, { includePrivate: true });
    const overlay = c.projects.filter((p) => p._private);
    assert.ok(overlay.length > 0 && c.private);
    assert.deepEqual(validate(c).errors, []);
    for (const p of overlay) assert.ok(p.publish_gate, p.slug);
    const pub = publicCorpus(c);
    assert.ok(overlay.every((p) => !pub.projects.includes(p)));
  });

test('deal is deterministic with a seed and respects filters', () => {
  const a = deal(corpus, { seed: 7 });
  const b = deal(corpus, { seed: 7 });
  assert.equal(a.slug, b.slug);
  const hw = deal(corpus, { seed: 3, mechanism: 'physical-artifact' });
  assert.ok(hw.mechanisms.includes('physical-artifact'));
});

test('build emits a static API', () => {
  inTempDir('crafterwiki-', (dir) => {
    const m = build(corpus, dir);
    const pub = publicCorpus(corpus);
    assert.equal(m.counts.projects, pub.projects.length);
    const index = JSON.parse(readFileSync(join(dir, 'api', 'v0', 'index.json'), 'utf8'));
    assert.equal(index.items.length, pub.items.length);
    assert.ok(!('text' in index.items[0]));
  });
});

test('wilson gives honest 95% bounds for small samples', () => {
  const round = ({ p, lo, hi }) => [p, lo, hi].map((x) => Math.round(x * 1000) / 1000);
  // 4 of 6: the worked example on /patterns/.
  assert.deepEqual(round(wilson(4, 6)), [0.667, 0.3, 0.903]);
  // Bounds stay inside [0, 1] at the extremes, where the normal approximation would not.
  assert.deepEqual(round(wilson(0, 6)), [0, 0, 0.39]);
  assert.deepEqual(round(wilson(6, 6)), [1, 0.61, 1]);
  // Larger samples tighten the range around the same share.
  const small = wilson(2, 4);
  const large = wilson(50, 100);
  assert.ok(large.hi - large.lo < small.hi - small.lo);
  // No sample, no claim.
  assert.deepEqual(wilson(0, 0), { p: 0, lo: 0, hi: 0 });
});

test('query module stays browser-safe (no Node built-ins)', () => {
  const src = readFileSync(join(ROOT, 'cli', 'query.mjs'), 'utf8');
  assert.ok(!/from ['"]node:/.test(src) && !/require\(/.test(src));
});
