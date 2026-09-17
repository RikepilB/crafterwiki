import test from 'node:test';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadCorpus,publicCorpus } from '../cli/lib.mjs';
import { mergeReferences } from '../web/src/lib/references.mjs';
import { media } from '../web/src/lib/media.js';
const hall=JSON.parse(readFileSync(new URL('../web/src/data/hall-of-hacks.json',import.meta.url)));
const images=JSON.parse(readFileSync(new URL('../web/src/data/hall-media.json',import.meta.url)));
const corpus=publicCorpus(loadCorpus(fileURLToPath(new URL('..',import.meta.url))));
const merged=mergeReferences(corpus,hall,media,images);
test('Unified references retain all records while merging matching submission URLs',()=>{
 assert.equal(merged.length,173);assert.equal(merged.filter(p=>!p.roster).length,85);
 assert.equal(merged.filter(p=>p.roster).length,88);
 const sk=merged.filter(p=>p.name==='S-KBD67');assert.equal(sk.length,1);
 assert.equal(sk[0].status,'finalist');assert.equal(sk[0].url,'/projects/s-kbd67/');
 assert.ok(sk[0].hall);assert.ok(sk[0].variants.length);assert.ok(sk[0].links.video);
 for(const item of corpus.items)assert.ok(merged.some(p=>p.slug===item.slug));
 for(const item of hall)assert.ok(merged.some(p=>p.hall?.sourceUrl===item.sourceUrl));
});
test('Imported awards remain unverified and shared events use the same filter key',()=>{
 assert.ok(merged.filter(p=>p.origin==='hall').every(p=>p.status==='reported-winner'&&!p.analyzed));
 const archemy=merged.find(p=>p.name==='ARchemy');const sk=merged.find(p=>p.name==='S-KBD67');
 assert.equal(archemy.eventId,sk.eventId);
 assert.equal(corpus.items.length,124);
});
