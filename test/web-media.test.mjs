import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { loadCorpus } from '../cli/lib.mjs';
import { media } from '../web/src/lib/media.js';
import { cardHTML } from '../web/src/lib/labels.mjs';

test('every displayed video poster has an exact public corpus video source', () => {
  const corpus = loadCorpus();
  for (const [slug, asset] of Object.entries(media)) {
    const project = corpus.projects.find((p) => p.slug === slug);
    assert.equal(asset.video, project?.links?.video, slug);
    const url = new URL(asset.video);
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
    assert.equal(asset.poster, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  }
});

test('local previews exist with responsive sizes and preserve source dimensions', () => {
  for (const [slug, asset] of Object.entries(media)) {
    assert.ok(asset.variants.length >= 2, slug);
    assert.equal(asset.localPoster, asset.variants.at(-1).src);
    assert.equal(asset.posterSrcset, asset.variants.map(({ src, width }) => `${src} ${width}w`).join(', '));
    assert.equal(asset.width, asset.variants.at(-1).width);
    assert.equal(asset.height, asset.variants.at(-1).height);
    for (const variant of asset.variants) {
      assert.match(variant.src, /^\/media\/posters\/[a-z0-9-]+-(320|480|960)\.webp$/);
      assert.ok(variant.width <= asset.sourceWidth, `No upscaling: ${slug}`);
      assert.ok(variant.height <= asset.sourceHeight, `No upscaling: ${slug}`);
      assert.equal(variant.width / variant.height, asset.sourceWidth / asset.sourceHeight);
      const path = new URL(`../web/public${variant.src}`, import.meta.url);
      assert.equal(statSync(path).size, variant.bytes, slug);
      const bytes = readFileSync(path);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
  }
});

test('reference cards preserve original resource links and reject executable links', () => {
  const corpus = loadCorpus();
  const item = corpus.items.find((p) => p.slug === 'connected-earth-museum');
  const html = cardHTML({ ...item, links: { ...item.links, bad: 'javascript:alert(1)' } }, '/');
  assert.ok(html.includes(item.links.demo));
  assert.ok(html.includes(item.links.video));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('/projects/connected-earth-museum/'));
});
