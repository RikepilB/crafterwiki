// Build-time access to the public corpus for Astro pages (runs in Node during `astro build`).
import { resolve } from 'node:path';
import { loadCorpus, publicCorpus, patterns, eventBrief, similar, isWinner, count, wilson } from '../../../cli/lib.mjs';

// Resolved from the working directory (web/) because Vite bundles this module away from its source path.
export const ROOT = resolve(process.cwd(), '..');
// Never the private overlay: the site is a publishing surface.
export const corpus = publicCorpus(loadCorpus(ROOT));
export const T = corpus.taxonomy;

const rawBase = import.meta.env.BASE_URL ?? '/';
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
export const href = (path) => `${base}${String(path).replace(/^\//, '')}`;

export const definition = (facet, id) => T[facet]?.find((v) => v.id === id)?.definition ?? '';
export const eventName = (h) => `${h.name} ${h.edition ?? ''}`.trim();
export const hackathon = (slug) => corpus.hackathons.find((h) => h.slug === slug);
export const weight = (it) => T.placement_status.find((s) => s.id === it.status)?.rank_weight ?? 0;

export const analyzed = corpus.items.filter((i) => i.analyzed);
export const winners = analyzed.filter((i) => isWinner(corpus, i));
export const entries = corpus.items.filter((i) => !i.analyzed);
export const used = (key) => new Set(corpus.items.flatMap((i) => i[key] ?? []));

export const sourceHref = (url) => (/^https?:\/\//.test(url) ? url : null);

export { patterns, eventBrief, similar, isWinner, count, wilson };
