import { corpus, deal, BASE } from './data.js';
import { cardHTML } from '../lib/labels.mjs';

export async function initDeal() {
  const form = document.querySelector('#deal');
  const out = document.querySelector('#deal-result');
  const link = document.querySelector('#deal-link');
  if (!form || !out) return;
  const c = await corpus();

  const params = new URLSearchParams(location.search);
  for (const k of ['mechanism', 'kind']) if (params.get(k)) form.elements.namedItem(k).value = params.get(k);

  const show = (seed) => {
    const f = new FormData(form);
    const opts = { seed, mechanism: f.get('mechanism') || undefined, eventKind: f.get('kind') || undefined };
    const it = deal(c, opts);
    out.innerHTML = it ? cardHTML(it, BASE) : '<p class="muted">No confirmed winner matches those filters yet.</p>';
    const qs = new URLSearchParams({ seed: String(seed) });
    if (opts.mechanism) qs.set('mechanism', opts.mechanism);
    if (opts.eventKind) qs.set('kind', opts.eventKind);
    history.replaceState(null, '', `?${qs}`);
    link.hidden = !it;
    link.href = location.href;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    show(Math.floor(Math.random() * 2 ** 31));
  });
  if (params.get('seed')) show(Number(params.get('seed')));
}
