import { corpus, search, BASE } from './data.js';
import { cardHTML } from '../lib/labels.mjs';

const FIELDS = ['q', 'domain', 'mechanism', 'lens', 'kind', 'status', 'year', 'event'];
const TOGGLES = ['winners', 'entries'];

export async function initExplore() {
  const form = document.querySelector('#explore');
  const out = document.querySelector('#results');
  const countEl = document.querySelector('#count');
  if (!form || !out) return;
  const more = document.querySelector('#more-results');
  let c;
  out.setAttribute('aria-busy', 'true');
  try { c = await corpus(); }
  catch { countEl.textContent = 'Filters could not load. Showing initial references; refresh to retry.'; return; }
  finally { out.setAttribute('aria-busy', 'false'); }
  let results = [];
  let shown = 0;
  let timer;
  const render = (append = false) => {
    const start = append ? shown : 0;
    shown = Math.min(start + 12, results.length);
    const html = results.slice(start, shown).map((it) => cardHTML(it, BASE)).join('');
    if (append) out.insertAdjacentHTML('beforeend', html);
    else out.innerHTML = html || '<p class="muted">No matches. Remove a filter or include roster entries.</p>';
    more.hidden = shown >= results.length;
    countEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'} · showing ${shown}`;
  };

  const params = new URLSearchParams(location.search);
  for (const k of FIELDS) if (params.has(k)) form.elements.namedItem(k).value = params.get(k);
  for (const k of TOGGLES) form.elements.namedItem(k).checked = params.get(k) === '1';

  const run = () => {
    timer = undefined;
    const f = new FormData(form);
    const pick = (k) => f.get(k) || undefined;
    results = search(c, {
      query: f.get('q') ?? '', domain: pick('domain'), mechanism: pick('mechanism'), lens: pick('lens'),
      eventKind: pick('kind'), status: pick('status'), event: pick('event'), winnersOnly: f.get('winners') === 'on', analyzedOnly: f.get('entries') !== 'on', limit: 1000,
    }).filter((it) => !pick('year') || String(it.year) === pick('year'));
    render();

    const qs = new URLSearchParams();
    for (const k of FIELDS) if (f.get(k)) qs.set(k, f.get(k));
    for (const k of TOGGLES) if (f.get(k) === 'on') qs.set(k, '1');
    history.replaceState(null, '', qs.toString() ? `?${qs}` : location.pathname);
  };

  form.addEventListener('input', (event) => {
    clearTimeout(timer);
    if (event.target.name === 'q') timer = setTimeout(run, 180);
    else run();
  });
  form.addEventListener('reset', () => { clearTimeout(timer); setTimeout(run, 0); });
  more.addEventListener('click', () => { if (timer) { clearTimeout(timer); run(); } else render(true); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timer);
    run();
  });
  run();
}
