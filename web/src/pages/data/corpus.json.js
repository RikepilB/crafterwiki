// Public items for client-side search, similar and deal (same query.mjs semantics as the CLI).
import { corpus } from '../../lib/data.mjs';

export function GET() {
  const body = { taxonomy: { placement_status: corpus.taxonomy.placement_status }, items: corpus.items };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
}
