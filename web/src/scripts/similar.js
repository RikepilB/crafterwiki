import { corpus, similar, BASE } from './data.js';
import { cardHTML } from '../lib/labels.mjs';

const FACETS = ['domain', 'mechanism', 'lens', 'ai'];

export async function initSimilar() {
  const form = document.querySelector('#similar');
  const out = document.querySelector('#similar-results');
  const status = document.querySelector('#similar-status');
  if (!form || !out) return;
  const c = await corpus();

  const params = new URLSearchParams(location.search);
  form.elements.namedItem('to').value = params.get('to') ?? '';
  for (const key of FACETS) {
    const wanted = (params.get(key) ?? '').split(',').filter(Boolean);
    for (const box of form.querySelectorAll(`input[name="${key}"]`)) box.checked = wanted.includes(box.value);
  }
  form.elements.namedItem('entries').checked = params.get('entries') === '1';

  const run = () => {
    const f = new FormData(form);
    const opts = { to: f.get('to') || undefined, includeEntries: f.get('entries') === 'on', limit: 12 };
    const qs = new URLSearchParams();
    if (opts.to) qs.set('to', opts.to);
    for (const key of FACETS) {
      const v = f.getAll(key).join(',');
      if (v && !opts.to) {
        opts[key] = v;
        qs.set(key, v);
      }
    }
    if (opts.includeEntries) qs.set('entries', '1');
    history.replaceState(null, '', qs.toString() ? `?${qs}` : location.pathname);
    try {
      const results = similar(c, opts);
      out.innerHTML = results.map((it) => cardHTML(it, BASE)).join('');
      status.textContent = results.length
        ? `${results.length} similar situation${results.length === 1 ? '' : 's'}, ranked by weighted facet overlap (domains and mechanisms count most), then placement.`
        : 'Nothing in the corpus overlaps that profile yet.';
    } catch {
      out.innerHTML = '';
      status.textContent = 'Pick a project, or tick at least one facet.';
    }
  };

  form.addEventListener('change', run);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });
  run();
}
