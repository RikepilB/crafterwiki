// The project explorer's records, built once for the page and for its on-demand roster fragment.
import { corpus } from './data.mjs';
import { media } from './media.js';
import { mergeReferences } from './references.mjs';
import editorial from '../data/hall-of-hacks.json';
import editorialMedia from '../data/hall-media.json';

export const records = mergeReferences(corpus, editorial, media, editorialMedia);
// Explorer order is the merged order; roster cards fetched later slot back into it by this index.
export const orderOf = new Map(records.map((p, i) => [p, i]));
