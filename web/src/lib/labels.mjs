// Display helpers shared by Astro pages (build time) and client scripts (browser). No Node built-ins.

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
export function cardHTML(it, base) {
  const url = it.analyzed ? `${base}projects/${it.slug}/` : `${base}hackathons/${it.hackathon}/#roster`;
  const awards = (it.awards ?? []).length ? `<span class="badge accent">${esc(it.awards.join(' · '))}</span>` : '';
  const chips = it.mechanisms.length
    ? `<ul class="chips">${it.mechanisms.slice(0, 4).map((m) => `<li><a class="chip" href="${base}mechanisms/${m}/">${esc(humanize(m))}</a></li>`).join('')}</ul>`
    : `<p class="meta">${it.analyzed ? 'No mechanisms tagged' : `Roster entry · not analyzed${it.track ? ` · ${esc(humanize(it.track))}` : ''}`}</p>`;
  const shared = it.shared
    ? `<p class="meta shared">Shared: ${Object.entries(it.shared).map(([k, v]) => `<b>${esc(k)}</b> ${esc(v.map(humanize).join(', '))}`).join(' · ')}</p>`
    : '';
  return `<article class="card">
  <div class="card-top"><span class="badge ${statusClass(it.status)}">${esc(statusLabel(it))}</span>${awards}</div>
  <h3><a href="${url}">${esc(it.name)}</a></h3>
  <p class="meta">${esc(it.event)}</p>
  <p>${esc(it.tagline)}</p>
  ${chips}${shared}
</article>`;
}
