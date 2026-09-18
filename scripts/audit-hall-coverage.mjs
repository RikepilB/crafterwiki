// Reconcile approved, local browser captures. Never fetch pages or publish raw captures.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const directory = process.argv[2];
if (!directory) throw new Error('Usage: node scripts/audit-hall-coverage.mjs <local-capture-directory>');
const read = async name => JSON.parse(await readFile(resolve(directory, name), 'utf8'));
const [feed, routes, classic, categories, details] = await Promise.all(
  ['feed-full.json', 'routes.json', 'classic.json', 'categories.json', 'details.json'].map(read));
const projects = JSON.parse(await readFile('web/src/data/hall-of-hacks.json', 'utf8'));
const slug = value => {
  const u = new URL(value);
  if (u.origin !== 'https://hallofhackss.com' || !/^\/project\/[a-z0-9-]+$/.test(u.pathname)) throw new Error('Unexpected project URL');
  return u.pathname.split('/').pop();
};
const unique = values => [...new Set(values)].sort();
const feedSlugs = unique(feed.projects.map(p => slug(p.url)));
const same = (a, b) => JSON.stringify(unique(a)) === JSON.stringify(unique(b));
if (!same(feedSlugs, projects.map(p => p.slug))) throw new Error('Feed and imported collection differ');
if (!same(classic.names, projects.map(p => p.name))) throw new Error('Classic and imported collection differ');
if (details.length !== feedSlugs.length || !same(details.map(d => slug(d.url)), feedSlugs)) throw new Error('Missing or duplicate detail captures');
const listings = routes.map(r => {
  const u = new URL(r.url);
  if (u.origin !== 'https://hallofhackss.com' || u.pathname !== '/feed') throw new Error('Unexpected listing URL');
  const type = u.searchParams.has('event') ? 'event' : 'category';
  const slugs = unique(r.urls.map(slug));
  const expected = type === 'category' ? Number(categories.links.find(c => c.url === r.url)?.text.match(/(\d+) winners/)?.[1]) : slugs.length;
  if (!expected || slugs.length !== expected) throw new Error(`Incomplete listing: ${r.url}`);
  return { url:r.url, type, count:slugs.length, slugs };
});
if (listings.filter(r => r.type === 'event').length !== 29 || listings.filter(r => r.type === 'category').length !== 9 || new Set(listings.map(r => r.url)).size !== 38) throw new Error('Missing or duplicate discovery routes');
for (const type of ['event', 'category']) if (!same(listings.filter(r => r.type === type).flatMap(r => r.slugs), feedSlugs)) throw new Error(`Incomplete ${type} union`);
const observed = details.map(d => {
  const links = unique(d.links.map(l => l.url).filter(url => !url.startsWith('https://hallofhackss.com/')));
  for (const value of links) if (new URL(value).protocol !== 'https:') throw new Error('Unsafe outbound URL');
  const p = projects.find(p => p.sourceUrl === d.url);
  if (!same(Object.values(p.links), links)) throw new Error(`Missing or stale imported links: ${p.slug}`);
  return { slug:p.slug, links };
}).sort((a,b) => a.slug.localeCompare(b.slug));
const recommendations = unique(details.flatMap(d => d.links.filter(l => l.url.startsWith('https://hallofhackss.com/project/')).map(l => slug(l.url))));
if (recommendations.some(s => !feedSlugs.includes(s))) throw new Error('Unimported recommendation');
const receipt = {
  checkedAt:'2026-09-17', source:'https://hallofhackss.com/feed',
  scope:'All projects exposed by the audited public feed, 29 event filters, nine category filters, Classic listing and 51 detail-page recommendation lists at this visit; not a historical or hidden-record guarantee.',
  feed:{ batches:feed.batches, renderedCards:feed.projects.length, uniqueProjects:feedSlugs.length, terminalState:'cycling-duplicates', exhausted:false, slugs:feedSlugs },
  classic:{url:'https://hallofhackss.com/classic', count:classic.names.length},
  categoryDirectory:'https://hallofhackss.com/categories', listings, projects:observed,
  recommendationSlugs:recommendations, inaccessibleProjectPages:[],
  missing:{video:projects.filter(p=>!p.links.video).map(p=>p.slug),repo:projects.filter(p=>!p.links.repo).map(p=>p.slug),devpost:projects.filter(p=>!p.links.devpost).map(p=>p.slug)},
  videoInspection:'Links only; no video content analyzed. Source pages may autoplay embedded players.',
  awards:'reported-unverified',
};
await writeFile('docs/hall-of-hacks-audit.json', JSON.stringify(receipt,null,2)+'\n');
console.log(`Reconciled ${feedSlugs.length} projects, ${listings.length} listings and ${observed.length} detail pages; feed cycles, no terminal exhaustion claimed.`);
