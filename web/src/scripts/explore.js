import { corpus, search, BASE } from './data.js';
import { cardHTML } from '../lib/labels.mjs';

const FIELDS = ['q', 'domain', 'mechanism', 'lens', 'kind'];
const TOGGLES = ['winners', 'entries'];

export async function initExplore() {
  const form = document.querySelector('#explore');
  const out = document.querySelector('#results');
  const countEl = document.querySelector('#count');
  if (!form || !out) return;
  const c = await corpus();

  const params = new URLSearchParams(location.search);
  for (const k of FIELDS) if (params.has(k)) form.elements.namedItem(k).value = params.get(k);
  for (const k of TOGGLES) form.elements.namedItem(k).checked = params.get(k) === '1';

  const run = () => {
    const f = new FormData(form);
    const pick = (k) => f.get(k) || undefined;
    const results = search(c, {
      query: f.get('q') ?? '', domain: pick('domain'), mechanism: pick('mechanism'), lens: pick('lens'),
      eventKind: pick('kind'), winnersOnly: f.get('winners') === 'on', analyzedOnly: f.get('entries') !== 'on', limit: 1000,
    });
    out.innerHTML = results.length
      ? results.map((it) => cardHTML(it, BASE)).join('')
      : '<p class="muted">No matches. Remove a filter or include roster entries.</p>';
    countEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;

    const qs = new URLSearchParams();
    for (const k of FIELDS) if (f.get(k)) qs.set(k, f.get(k));
    for (const k of TOGGLES) if (f.get(k) === 'on') qs.set(k, '1');
    history.replaceState(null, '', qs.toString() ? `?${qs}` : location.pathname);
  };

  form.addEventListener('input', run);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });
  if ([...params.keys()].length) run();
}
