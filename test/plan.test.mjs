import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createPlan } from '../cli/plan.mjs';
import { ROOT } from '../cli/lib.mjs';

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

test('CLI returns JSON and rejects unknown events and private export', (t) => {
  const out = temporary(t);
  const run = (...args) => spawnSync(process.execPath, [resolve(ROOT, 'cli/crafterwiki.mjs'), 'plan', ...args, '--out', out, '--json'], { encoding: 'utf8' });
  const r = run('cli-run', '--mode', 'hackathon');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).status, 'unfilled');
  for (const args of [
    ['bad-event', '--mode', 'hackathon', '--event', 'missing-event'],
    ['private-run', '--private'],
    ['extra', 'argument'],
  ]) {
    const failure = run(...args);
    assert.equal(failure.status, 1);
    assert.match(failure.stderr, /unknown event|private overlays|usage:/);
  }
  assert.deepEqual(readdirSync(out), ['cli-run']);
});
