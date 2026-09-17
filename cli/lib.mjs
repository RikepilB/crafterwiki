// Filesystem side of CrafterWIKI: load the corpus (plus the optional private overlay) and emit the
// static API. Validation and query logic live in query.mjs so the browser and MCP server share them.
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildItems, patterns, publicCorpus } from './query.mjs';

export * from './query.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readJson(path, root) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    throw new Error(`${relative(root, path)}: ${e.message}`);
  }
}

function walkJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walkJson(p);
    return name.endsWith('.json') ? [p] : [];
  });
}

export function loadCorpus(root = ROOT, { includePrivate = false } = {}) {
  const rel = (p) => relative(root, p).replace(/\\/g, '/');
  const read = (dir, extra = {}) => walkJson(dir).map((p) => ({ ...readJson(p, root), _file: rel(p), ...extra }));
  const taxonomy = readJson(join(root, 'schema', 'taxonomy.json'), root);
  const hackathons = read(join(root, 'data', 'hackathons'));
  let projects = read(join(root, 'data', 'projects'));
  // The gitignored private/ overlay replaces public records by slug, for local planning only.
  const overlay = includePrivate ? read(join(root, 'private', 'data', 'projects'), { _private: true }) : [];
  if (overlay.length) {
    const replaced = new Set(overlay.map((p) => p.slug));
    projects = [...projects.filter((p) => !replaced.has(p.slug)), ...overlay];
  }
  return { taxonomy, hackathons, projects, items: buildItems(hackathons, projects), private: overlay.length > 0 };
}

export function build(corpus, outDir) {
  // The static API is a publishing surface: private overlays and gated records never leave the repo.
  if (corpus.private) throw new Error('refusing to build a public API from a corpus loaded with private/ overlays');
  const pub = publicCorpus(corpus);
  const api = join(outDir, 'api', 'v0');
  for (const d of [api, join(api, 'hackathons'), join(api, 'projects')]) mkdirSync(d, { recursive: true });
  const strip = ({ _file, _private, ...rest }) => rest;
  const write = (p, data) => writeFileSync(p, `${JSON.stringify(data)}\n`);
  const items = pub.items.map(({ text, ...rest }) => rest);
  write(join(api, 'index.json'), { generated_at: new Date().toISOString(), items });
  for (const h of pub.hackathons) write(join(api, 'hackathons', `${h.slug}.json`), strip(h));
  for (const p of pub.projects) write(join(api, 'projects', `${p.slug}.json`), strip(p));
  write(join(api, 'taxonomy.json'), pub.taxonomy);
  write(join(api, 'patterns.json'), patterns(pub));
  const manifest = {
    version: 'v0', generated_at: new Date().toISOString(),
    counts: { hackathons: pub.hackathons.length, projects: pub.projects.length, entries: pub.items.filter((i) => !i.analyzed).length },
    withheld: pub.withheld,
    endpoints: ['index.json', 'taxonomy.json', 'patterns.json', 'hackathons/{slug}.json', 'projects/{slug}.json'],
  };
  write(join(api, 'manifest.json'), manifest);
  return manifest;
}
