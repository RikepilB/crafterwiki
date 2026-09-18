import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const audit = read('../docs/hall-of-hacks-audit.json');
const projects = read('../web/src/data/hall-of-hacks.json');
const sorted = values => [...new Set(values)].sort();

test('Every audited public listing and detail page is represented once in the collection', () => {
  const slugs = sorted(projects.map(p => p.slug));
  assert.equal(projects.length, slugs.length);
  assert.deepEqual(audit.feed.slugs, slugs);
  assert.deepEqual(sorted(audit.projects.map(p => p.slug)), slugs);
  assert.equal(audit.projects.length, slugs.length);
  for (const [type, count] of [['event',29],['category',9]]) {
    const listings = audit.listings.filter(r => r.type === type);
    assert.equal(listings.length,count);
    assert.equal(new Set(listings.map(r=>r.url)).size,count);
    assert.deepEqual(sorted(listings.flatMap(r=>r.slugs)),slugs);
    for (const r of listings) assert.equal(r.count, new Set(r.slugs).size);
  }
  assert.ok(audit.recommendationSlugs.every(s=>slugs.includes(s)));
  assert.equal(audit.feed.exhausted,false);
  assert.equal(audit.feed.terminalState,'cycling-duplicates');
  assert.ok(audit.feed.renderedCards > audit.feed.uniqueProjects);
});

test('All observed media and project links survive import, including non-YouTube videos', () => {
  for (const p of projects) {
    const observed = audit.projects.find(item=>item.slug===p.slug);
    assert.deepEqual(sorted(Object.values(p.links)), observed.links.slice().sort());
  }
  assert.equal(projects.filter(p=>p.links.video).length,51);
  assert.equal(projects.filter(p=>new URL(p.links.video).hostname==='vimeo.com').length,4);
  assert.equal(projects.find(p=>p.slug==='jailcall').links.project_page,'https://agentphone.ai/callmyagent');
  for (const key of ['video','repo','devpost']) assert.deepEqual(audit.missing[key],projects.filter(p=>!p.links[key]).map(p=>p.slug));
  assert.equal(audit.awards,'reported-unverified');
});
