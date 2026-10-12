import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCorpus, validate, HARNESS_PHASES } from '../cli/lib.mjs';

const corpus = loadCorpus();
const wateraid = () => corpus.hackathons.find((h) => h.slug === 'wateraid-water-challenge-2026');

// Validate a copy of the corpus with one event swapped for a patched clone.
function withEvent(patch) {
  const broken = structuredClone(corpus);
  const i = broken.hackathons.findIndex((h) => h.slug === 'wateraid-water-challenge-2026');
  patch(broken.hackathons[i]);
  return validate(broken).errors.filter((e) => e.includes('wateraid-water-challenge-2026'));
}

test('event guides exist for the upcoming WaterAid and NASA Space Apps events', () => {
  const guided = corpus.hackathons.filter((h) => h.guide).map((h) => h.slug).sort();
  assert.deepEqual(guided, ['nasa-space-apps-2026', 'wateraid-water-challenge-2026']);
  for (const h of corpus.hackathons.filter((x) => x.guide)) assert.ok(HARNESS_PHASES.includes(h.guide.harness_stop), h.slug);
});

test('every WaterAid track weights the six shared criteria to 100', () => {
  const h = wateraid();
  assert.equal(h.tracks.length, 3);
  for (const tr of h.tracks) {
    assert.equal(tr.criteria.length, 6, tr.id);
    assert.equal(tr.criteria.reduce((sum, c) => sum + c.weight, 0), 100, tr.id);
  }
  assert.equal(h.challenges.length, 10);
});

test('track weights that do not sum to 100 are rejected', () => {
  const errors = withEvent((h) => { h.tracks[0].criteria[0].weight += 5; });
  assert.ok(errors.some((e) => e.includes('weights must sum to 100')));
});

test('a challenge must point at a declared track', () => {
  const errors = withEvent((h) => { h.challenges[0].track = 'z'; });
  assert.ok(errors.some((e) => e.includes('challenge A1 track "z"')));
});

test('a guide can only hold the harness at a real phase', () => {
  const errors = withEvent((h) => { h.guide.harness_stop = 'coding'; });
  assert.ok(errors.some((e) => e.includes('guide.harness_stop "coding"')));
});

test('public event data leaves team identities out', () => {
  const text = JSON.stringify(wateraid());
  // The organizer names teams "Team <Word>"; the record keeps only the team count.
  assert.ok(!/\bTeam (?!Brief\b)[A-Z][a-z]+\b/.test(text));
});
