// Browser access to the public corpus. Query functions come straight from cli/query.mjs.
export { search, similar, deal } from '../../../cli/query.mjs';

const raw = import.meta.env.BASE_URL ?? '/';
export const BASE = raw.endsWith('/') ? raw : `${raw}/`;

let pending;
export function corpus() {
  pending ??= fetch(`${BASE}data/corpus.json`).then((r) => {
    if (!r.ok) throw new Error(`corpus.json ${r.status}`);
    return r.json();
  });
  return pending;
}
