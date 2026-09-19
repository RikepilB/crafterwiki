import { corpus, similar, BASE } from './data.js';
import { cardHTML, humanize, esc } from '../lib/labels.mjs';
import { createTour } from './tour.js';

const FACETS = ['domain', 'mechanism', 'lens', 'ai'];
// Labels for the facets similar() reports as shared; the site's language layer translates them.
const SHARED_LABEL = { domains: 'Domain', mechanisms: 'Mechanism', lenses: 'Judging lens', ai: 'AI', stack: 'Stack' };
const EXAMPLE = 'mechanism=visible-engineering-depth&lens=technical-depth';

// "Why it matches": the exact facets a result shares with the profile, plus its overlap score.
function why(it) {
  const rows = Object.entries(it.shared ?? {}).flatMap(([facet, values]) =>
    values.map((v) => `<li><span class="sim-facet">${esc(SHARED_LABEL[facet] ?? humanize(facet))}</span> <span>${esc(humanize(v))}</span></li>`));
  const overlap = Math.min(100, Math.round((it.score ?? 0) * 100));
  return `<div class="sim-why"><p class="sim-why-title"><span>Why it matches</span> <span class="sim-overlap"><span>Overlap</span> <b>${overlap}%</b></span></p><ul>${rows.join('')}</ul></div>`;
}

export async function initSimilar() {
  const form = document.querySelector('#similar');
  const out = document.querySelector('#similar-results');
  const status = document.querySelector('#similar-status');
  if (!form || !out) return;

  const tour = createTour({
    id: 'similar',
    steps: [
      { target: '.presets', title: 'Start from an example', body: 'These are common hackathon situations. Pick one to see how matching works.' },
      { target: 'select[name="to"]', title: 'Or start from a project', body: 'Choose a project you like, and CrafterWIKI uses its profile to find others like it.' },
      { target: '#similar .group', title: 'Describe your situation', body: 'Tick the judging criteria you expect and the strategies you are betting on. Hover or tap an option for its definition.' },
      { target: '#step-3', title: 'Read why they match', body: 'Results are ranked by overlap with your situation, and each one lists exactly what it shares.' },
    ],
  });
  document.querySelector('#start-tour')?.addEventListener('click', () => tour.start());

  const c = await corpus();

  const apply = (params) => {
    form.elements.namedItem('to').value = params.get('to') ?? '';
    for (const key of FACETS) {
      const wanted = (params.get(key) ?? '').split(',').filter(Boolean);
      for (const box of form.querySelectorAll(`input[name="${key}"]`)) box.checked = wanted.includes(box.value);
    }
    form.elements.namedItem('entries').checked = params.get('entries') === '1';
  };

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
      out.innerHTML = results.map((it) => `<div class="sim-match">${cardHTML(it, BASE)}${why(it)}</div>`).join('');
      status.textContent = results.length
        ? `${results.length} similar situation${results.length === 1 ? '' : 's'}, ranked by weighted facet overlap (domains and mechanisms count most), then placement.`
        : 'Nothing in the corpus overlaps that profile yet.';
    } catch {
      out.innerHTML = '';
      status.textContent = 'Pick an example or a project, or tick a few options above.';
    }
  };

  // Jump to the results and briefly highlight them, so an example visibly "does something".
  const showResults = () => {
    document.querySelector('#step-3')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    out.classList.remove('sim-flash');
    void out.offsetWidth;
    out.classList.add('sim-flash');
  };
  const useQuery = (query) => { apply(new URLSearchParams(query)); run(); showResults(); };

  // Example links still work without JavaScript (they reload with the query); with it, no reload.
  for (const link of document.querySelectorAll('.presets a')) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      useQuery(link.getAttribute('href').replace(/^\?/, ''));
    });
  }
  document.querySelector('#try-example')?.addEventListener('click', () => useQuery(EXAMPLE));

  apply(new URLSearchParams(location.search));
  form.addEventListener('change', run);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });
  run();

  // Open the tour by itself only on a first visit that did not arrive with a shared query.
  if (!location.search && !tour.seen()) setTimeout(() => tour.start(), 600);
}
