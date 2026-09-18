// Public items for client-side search, similar and deal (same query.mjs semantics as the CLI).
import { corpus } from '../../lib/data.mjs';
import { browserCorpus } from '../../lib/browser-corpus.mjs';

export function GET() {
  const body = browserCorpus(corpus);
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
}
