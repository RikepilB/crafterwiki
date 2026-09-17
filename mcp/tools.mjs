// MCP request handling for CrafterWIKI: JSON-RPC 2.0 messages in, responses out. Transport-free so it
// can be unit-tested; server.mjs wires it to stdio. Tools wrap the same functions as the CLI.
import { search, similar, patterns, eventBrief, deal, show } from '../cli/lib.mjs';

export const PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
export const SERVER_VERSION = '0.2.0';

const INSTRUCTIONS = `CrafterWIKI: hackathon winners and submissions analyzed by winning mechanism and judging lens.
Placement honesty: only grand-winner, podium, track-winner, runner-up and finalist are wins. Say "submitted"
for submitted-only, "featured" for featured, "ranked Nth in a public vote" for public-vote-ranked and
"reported (unverified)" for reported-winner. Cite record slugs. Mechanisms are mostly curator-inference;
check each claim's basis. Saturation counts are base rates only when base_rate_valid is true.`;

const ids = (description) => ({ type: 'string', description: `${description}; comma-separated taxonomy ids` });
const FACETS = {
  domain: ids('Domains (list_facets domains)'),
  mechanism: ids('Winning mechanisms (list_facets mechanisms)'),
  lens: ids('Judging lenses (list_facets judging_lenses)'),
  ai: ids('AI patterns (list_facets ai_patterns)'),
  tech: { type: 'string', description: 'Stack tags, comma-separated, e.g. lora,supabase' },
};
const limit = (max, dflt) => ({ type: 'integer', minimum: 1, maximum: max, description: `Default ${dflt}` });
const slim = (item) => {
  if (!item) return item;
  const { text, ...rest } = item;
  return rest;
};
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

export function createServer(corpus) {
  const tools = [
    {
      name: 'search_projects',
      description: 'Full-text and facet search across analyzed hackathon projects and roster entries, ranked by text match and placement.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' }, ...FACETS,
          status: { type: 'string', description: 'Placement status ids, comma-separated' },
          event: { type: 'string', description: 'Hackathon slug' },
          event_kind: { type: 'string', description: 'Event kind id (list_facets event_kinds)' },
          winners_only: { type: 'boolean' }, analyzed_only: { type: 'boolean' }, limit: limit(100, 20),
        },
      },
      run: (a) => search(corpus, {
        ...a, eventKind: a.event_kind, winnersOnly: a.winners_only, analyzedOnly: a.analyzed_only, limit: a.limit ?? 20,
      }).map(slim),
    },
    {
      name: 'similar_situations',
      description: 'Projects that share a situation with yours (domains, winning mechanisms, judging lenses, AI patterns, stack), even across different problems. Give "to" (a record slug) or at least one facet. Each result lists the shared facets.',
      inputSchema: {
        type: 'object',
        properties: { to: { type: 'string', description: 'Record slug to compare against' }, ...FACETS, include_entries: { type: 'boolean' }, limit: limit(50, 5) },
      },
      run: (a) => similar(corpus, { ...a, includeEntries: a.include_entries, limit: a.limit ?? 5 }).map(slim),
    },
    {
      name: 'event_brief',
      description: 'Recon brief for one hackathon: rubric mapped to judging lenses, judge profile, prizes, tracks, saturation (with base_rate_valid), known results and priors from the same event kind.',
      inputSchema: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] },
      run: (a) => eventBrief(corpus, a.slug),
    },
    {
      name: 'patterns',
      description: 'Frequencies of winning mechanisms, judging lenses, domains, AI patterns and build styles among confirmed winners, optionally stratified by event or event kind. Always report sample.analyzed_records.',
      inputSchema: {
        type: 'object',
        properties: { event: { type: 'string' }, event_kind: { type: 'string' }, include_reported: { type: 'boolean' }, all: { type: 'boolean', description: 'Every analyzed record, not only winners' } },
      },
      run: (a) => patterns(corpus, { event: a.event, eventKind: a.event_kind, includeReported: a.include_reported, all: a.all }),
    },
    {
      name: 'deal',
      description: 'One random analyzed winner for inspiration, optionally filtered. Pass seed for a repeatable draw.',
      inputSchema: { type: 'object', properties: { ...FACETS, event_kind: { type: 'string' }, seed: { type: 'integer' } } },
      run: (a) => slim(deal(corpus, { ...a, eventKind: a.event_kind })) ?? { message: 'Nothing matches those filters.' },
    },
    {
      name: 'get_record',
      description: 'Full record for a project, hackathon or roster entry slug, including sources and basis-labelled claims.',
      inputSchema: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] },
      run: (a) => {
        const r = show(corpus, a.slug);
        if (!r) throw new Error(`No record with slug "${a.slug}"`);
        return slim(r);
      },
    },
    {
      name: 'list_hackathons',
      description: 'Every indexed hackathon with kind, format, dates, results status and roster coverage.',
      inputSchema: { type: 'object', properties: {} },
      run: () => corpus.hackathons.map((h) => ({
        slug: h.slug, name: `${h.name} ${h.edition}`.trim(), year: h.year, kind: h.kind, format: h.format,
        dates: [h.start_date, h.end_date], results_status: h.results_status, roster_coverage: h.roster_coverage,
      })),
    },
    {
      name: 'list_facets',
      description: 'Allowed taxonomy values with definitions (domains, mechanisms, judging_lenses, ai_patterns, placement_status, event_kinds, ...).',
      inputSchema: { type: 'object', properties: { name: { type: 'string' } } },
      run: (a) => {
        const t = corpus.taxonomy;
        const names = Object.keys(t).filter((k) => Array.isArray(t[k]));
        if (a.name && !names.includes(a.name)) throw new Error(`Unknown facet "${a.name}"; one of: ${names.join(', ')}`);
        return Object.fromEntries((a.name ? [a.name] : names).map((n) => [n, t[n]]));
      },
    },
  ];
  const byName = new Map(tools.map((t) => [t.name, t]));

  // Returns the response object, or null for notifications (which never get a reply).
  return function handle(msg) {
    if (!msg || Array.isArray(msg) || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
      return rpcError(msg?.id ?? null, -32600, 'Invalid request');
    }
    const notification = !('id' in msg);
    const reply = (result) => (notification ? null : { jsonrpc: '2.0', id: msg.id, result });
    switch (msg.method) {
      case 'initialize': {
        const asked = msg.params?.protocolVersion;
        return reply({
          protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'crafterwiki', version: SERVER_VERSION },
          instructions: INSTRUCTIONS,
        });
      }
      case 'ping':
        return reply({});
      case 'tools/list':
        return reply({ tools: tools.map(({ run, ...t }) => t) });
      case 'tools/call': {
        const tool = byName.get(msg.params?.name);
        if (!tool) return notification ? null : rpcError(msg.id, -32602, `Unknown tool: ${msg.params?.name}`);
        try {
          const data = tool.run(msg.params?.arguments ?? {});
          return reply({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });
        } catch (e) {
          return reply({ content: [{ type: 'text', text: e.message }], isError: true });
        }
      }
      default:
        if (notification) return null;
        return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
    }
  };
}
