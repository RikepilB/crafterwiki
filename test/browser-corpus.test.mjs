import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCorpus, search, similar, deal } from '../cli/lib.mjs';
import { browserCorpus } from '../web/src/lib/browser-corpus.mjs';

const corpus = loadCorpus();
const compact = browserCorpus(corpus);
const ranking = (items) => items.map(({ slug, score }) => ({ slug, score }));

test('compact browser index preserves search rankings and combined filters', () => {
  for (const query of ['', 'climate', 'Earth art', 'LoRa', 'agent', 'human', 'procurement', 'nostalgia', 'water', 'nonexistentword']) {
    for (const filter of [{}, { winnersOnly: true }, { eventKind: 'agency-open-data' }, { status: 'finalist' }]) {
      const options = { query, ...filter, limit: 1000 };
      assert.deepEqual(ranking(search(compact, options)), ranking(search(corpus, options)));
    }
  }
});

test('compact browser index preserves similar/deal and original resource links', () => {
  for (const item of corpus.items.filter((i) => i.analyzed)) {
    assert.deepEqual(ranking(similar(compact, { to: item.slug, limit: 12 })), ranking(similar(corpus, { to: item.slug, limit: 12 })));
    assert.deepEqual(compact.items.find((i) => i.slug === item.slug).links, item.links);
  }
  for (let seed = 0; seed < 10; seed++) assert.equal(deal(compact, { seed })?.slug, deal(corpus, { seed })?.slug);
});

test('browser index is smaller without dropping records', () => {
  const before = JSON.stringify({ taxonomy: { placement_status: corpus.taxonomy.placement_status }, items: corpus.items });
  assert.equal(compact.items.length, corpus.items.length);
  assert.ok(Buffer.byteLength(JSON.stringify(compact)) < Buffer.byteLength(before));
});
