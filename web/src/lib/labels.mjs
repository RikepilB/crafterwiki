// Display helpers shared by Astro pages (build time) and client scripts (browser). No Node built-ins.
import { media } from './media.js';

export const STATUS = {
  'grand-winner': ['Grand winner', 'win'],
  podium: ['Podium', 'win'],
  'track-winner': ['Award winner', 'win'],
  'runner-up': ['Runner-up', 'win'],
  finalist: ['Finalist', 'win'],
  'public-vote-ranked': ['Public vote', 'vote'],
  featured: ['Featured', 'feat'],
  'reported-winner': ['Reported · unverified', 'warn'],
  'submitted-only': ['Submitted', 'neutral'],
  unknown: ['Unknown', 'neutral'],
};

export const statusClass = (id) => (STATUS[id] ?? [id, 'neutral'])[1];

export function statusLabel(item) {
  let s = (STATUS[item.status] ?? [item.status])[0];
  if (item.rank) s += ` #${item.rank}`;
  if (item.votes) s += ` · ${item.votes} votes`;
  return s;
}

export const humanize = (id) => String(id ?? '').replace(/-/g, ' ');

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${Number(day)} ${MONTHS[Number(m) - 1]} ${y}`;
}

export function fmtRange(a, b) {
  if (!a) return 'Dates unknown';
  if (!b || a === b) return fmtDate(a);
  const [ya, ma, da] = a.split('-');
  const [yb, mb, db] = b.split('-');
  if (ya === yb && ma === mb) return `${Number(da)}–${Number(db)} ${MONTHS[Number(mb) - 1]} ${yb}`;
  return `${fmtDate(a)} – ${fmtDate(b)}`;
}

// One card markup for server-rendered lists and client-side results, so both always match.
export function cardHTML(it, base, { eager = false } = {}) {
  const url = it.analyzed ? `${base}projects/${it.slug}/` : `${base}hackathons/${it.hackathon}/#roster`;
  const awards = (it.awards ?? []).length ? `<span class="badge accent">${esc(it.awards.join(' · '))}</span>` : '';
  const chips = it.mechanisms.length
    ? `<ul class="chips">${it.mechanisms.slice(0, 2).map((m) => `<li><a class="chip" href="${base}mechanisms/${m}/">${esc(humanize(m))}</a></li>`).join('')}</ul>`
    : `<p class="meta">${it.analyzed ? 'No mechanisms tagged' : `Roster entry · not analyzed${it.track ? ` · ${esc(humanize(it.track))}` : ''}`}</p>`;
  const shared = it.shared
    ? `<p class="meta shared">Shared: ${Object.entries(it.shared).map(([k, v]) => `<b>${esc(k)}</b> ${esc(v.map(humanize).join(', '))}`).join(' · ')}</p>`
    : '';
  const video = media[it.slug];
  const actions = Object.entries(it.links ?? {}).filter(([,v]) => typeof v === 'string' && /^https?:\/\//.test(v)).map(([k,v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(({video:'Video',demo:'Live demo',repo:'Code',devpost:'Submission',project_page:'Submission'})[k] ?? humanize(k))} ↗</a>`).join('');
  return `<article class="card ${video ? 'has-media' : ''}">
  ${video ? `<a class="card-media" href="${esc(video.video)}" target="_blank" rel="noopener" aria-label="Watch ${esc(it.name)} demo on YouTube"><img src="${esc(base + video.localPoster.slice(1))}" srcset="${esc(video.variants.map((v) => `${base}${v.src.slice(1)} ${v.width}w`).join(', '))}" sizes="(max-width: 680px) calc(100vw - 40px), 360px" alt="${esc(it.name)} — video preview" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="480" height="360" /><span>▶ Video</span></a>` : ''}
  <p class="meta">${esc(statusLabel(it))} · ${esc(it.year ?? '')}</p>
  <h3><a href="${url}">${esc(it.name)}</a></h3>
  <p>${esc(it.tagline)}</p>
  ${shared}
  <div class="reference-actions"><a href="${url}">Read reference →</a>${actions ? `<details class="card-links"><summary>Source links</summary><div>${actions}</div></details>` : ''}</div>
</article>`;
}
