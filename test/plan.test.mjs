import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createPlan } from '../cli/plan.mjs';
import { ROOT, loadCorpus, planEvidence } from '../cli/lib.mjs';

function temporary(t) {
  const dir = mkdtempSync(resolve(tmpdir(), 'crafterwiki-plan-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('independent project needs no event and keeps demo before build', (t) => {
  const r = createPlan({ slug: 'my-build', out: temporary(t) });
  assert.equal(r.mode, 'project');
  assert.equal(r.event, null);
  assert.equal(r.status, 'unfilled');
  assert.equal(r.files.length, 7);
  assert.match(readFileSync(resolve(r.directory, '01-brief.md'), 'utf8'), /Project gate/);
  assert.match(readFileSync(resolve(r.directory, '05-build-plan.md'), 'utf8'), /Do not complete architecture/);
});

test('event plan starts blocked even with a known event pointer', (t) => {
  const r = createPlan({ slug: 'weekend', mode: 'hackathon', event: 'nasa-space-apps-2026', out: temporary(t) });
  assert.match(readFileSync(resolve(r.directory, '01-brief.md'), 'utf8'), /BLOCKED until rules and challenge are verified/);
  assert.match(readFileSync(resolve(r.directory, 'README.md'), 'utf8'), /Reverify primary rules/);
});

test('existing work is never overwritten', (t) => {
  const out = temporary(t);
  const r = createPlan({ slug: 'existing', out });
  writeFileSync(resolve(r.directory, 'README.md'), 'user decisions');
  assert.throws(() => createPlan({ slug: 'existing', out }), /EEXIST/);
  assert.equal(readFileSync(resolve(r.directory, 'README.md'), 'utf8'), 'user decisions');
});

test('unsafe names and incompatible modes fail before writing', (t) => {
  const out = temporary(t);
  for (const slug of ['../escape', '/absolute', 'C:\\escape', 'a/b', '.', 'CON', 'nul', 'COM1', '', 'a'.repeat(81)]) {
    assert.throws(() => createPlan({ slug, out }), /portable kebab-case/);
  }
  assert.throws(() => createPlan({ slug: 'valid', out, mode: 'unknown' }), /mode must/);
  assert.throws(() => createPlan({ slug: 'valid', out, event: 'event' }), /requires/);
  assert.deepEqual(readdirSync(out), []);
});

test('every indexed event compiles a plan with its sources and an honest prior', (t) => {
  const corpus = loadCorpus(ROOT);
  const out = temporary(t);
  assert.ok(corpus.hackathons.length > 10);
  for (const h of corpus.hackathons) {
    const evidence = planEvidence(corpus, h.slug);
    const r = createPlan({ slug: h.slug, mode: 'hackathon', event: h.slug, out, evidence });
    assert.equal(r.status, 'evidence-compiled');
    const brief = readFileSync(resolve(r.directory, '01-brief.md'), 'utf8');
    const refs = readFileSync(resolve(r.directory, '02-references.md'), 'utf8');
    assert.match(brief, /BLOCKED until rules and challenge are verified/, h.slug);
    for (const s of h.sources ?? []) assert.ok(brief.includes(s.url), `${h.slug} brief lists ${s.url}`);
    assert.ok(refs.includes(`n = ${evidence.patterns.n} `), h.slug);
    assert.ok(!evidence.patterns.events.includes(h.slug), `${h.slug} prior excludes its own winners`);
    if (h.roster_coverage !== 'full') assert.match(refs, /NOT a base rate/, h.slug);
    for (const text of [brief, refs]) assert.doesNotMatch(text, /\bundefined\b|\[object Object\]/, h.slug);
  }
});

test('an event kind without indexed winners falls back to every kind, labelled', () => {
  const corpus = loadCorpus(ROOT);
  const e = planEvidence(corpus, 'wateraid-water-challenge-2026');
  assert.match(e.patterns.basis, /all event kinds/);
  assert.ok(e.patterns.n > 0);
  assert.ok(e.references.lenses.includes('human-oversight'));
  assert.equal(e.event.tracks.find((tr) => tr.name.startsWith('Track C')).criteria.find((c) => c.lens === 'technical-depth').weight, 30);
  for (const ref of e.references.items) assert.notEqual(ref.hackathon, 'wateraid-water-challenge-2026');
});

test('evidence for a different event is refused before writing', (t) => {
  const corpus = loadCorpus(ROOT);
  const out = temporary(t);
  const evidence = planEvidence(corpus, 'hack-the-north-2025');
  assert.throws(() => createPlan({ slug: 'mixed', mode: 'hackathon', event: 'nasa-space-apps-2026', out, evidence }), /must belong/);
  assert.deepEqual(readdirSync(out), []);
});

test('CLI returns JSON and rejects unknown events and private export', (t) => {
  const out = temporary(t);
  const run = (...args) => spawnSync(process.execPath, [resolve(ROOT, 'cli/crafterwiki.mjs'), 'plan', ...args, '--out', out, '--json'], { encoding: 'utf8' });
  const r = run('cli-run', '--mode', 'hackathon');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).status, 'unfilled');
  const compiled = run('cli-event', '--mode', 'hackathon', '--event', 'wateraid-water-challenge-2026');
  assert.equal(compiled.status, 0, compiled.stderr);
  assert.equal(JSON.parse(compiled.stdout).status, 'evidence-compiled');
  for (const args of [
    ['bad-event', '--mode', 'hackathon', '--event', 'missing-event'],
    ['private-run', '--private'],
    ['extra', 'argument'],
  ]) {
    const failure = run(...args);
    assert.equal(failure.status, 1);
    assert.match(failure.stderr, /unknown event|private overlays|usage:/);
  }
  assert.deepEqual(readdirSync(out).sort(), ['cli-event', 'cli-run']);
});
