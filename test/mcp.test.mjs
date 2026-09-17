import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { ROOT, loadCorpus, publicCorpus } from '../cli/lib.mjs';
import { createServer, PROTOCOL_VERSIONS } from '../mcp/tools.mjs';

const handle = createServer(publicCorpus(loadCorpus()));
const call = (id, method, params) => handle({ jsonrpc: '2.0', id, method, params });
const toolJson = (res) => JSON.parse(res.result.content[0].text);

test('initialize negotiates a supported protocol version', () => {
  assert.equal(call(1, 'initialize', { protocolVersion: '2025-06-18' }).result.protocolVersion, '2025-06-18');
  assert.equal(call(2, 'initialize', { protocolVersion: '1999-01-01' }).result.protocolVersion, PROTOCOL_VERSIONS[0]);
  assert.equal(handle({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
});

test('tools/list exposes every query tool with an input schema', () => {
  const tools = call(3, 'tools/list').result.tools;
  const names = tools.map((t) => t.name);
  for (const n of ['search_projects', 'similar_situations', 'event_brief', 'patterns', 'deal', 'get_record', 'list_hackathons', 'list_facets']) {
    assert.ok(names.includes(n), n);
  }
  assert.ok(tools.every((t) => t.inputSchema?.type === 'object' && !('run' in t)));
});

test('tools answer with the library semantics', () => {
  const r = toolJson(call(4, 'tools/call', { name: 'search_projects', arguments: { query: 'procurement' } }));
  assert.equal(r[0].slug, 'centinela');
  assert.ok(!('text' in r[0]));
  const b = toolJson(call(5, 'tools/call', { name: 'event_brief', arguments: { slug: 'hack-the-north-2025' } }));
  assert.equal(b.slug, 'hack-the-north-2025');
  const s = toolJson(call(6, 'tools/call', { name: 'similar_situations', arguments: { to: 'furme', limit: 3 } }));
  assert.equal(s.length, 3);
  assert.ok(s.every((i) => i.shared));
});

test('tool failures are in-band; unknown methods are JSON-RPC errors', () => {
  const bad = call(7, 'tools/call', { name: 'get_record', arguments: { slug: 'does-not-exist' } });
  assert.equal(bad.result.isError, true);
  assert.equal(call(8, 'nope/method').error.code, -32601);
  assert.equal(call(9, 'tools/call', { name: 'nope' }).error.code, -32602);
  assert.equal(handle([]).error.code, -32600);
});

test('stdio transport answers newline-delimited JSON-RPC', async () => {
  const child = spawn(process.execPath, [join(ROOT, 'mcp', 'server.mjs')], { stdio: ['pipe', 'pipe', 'inherit'] });
  const lines = [];
  let timer;
  const done = new Promise((resolve, reject) => {
    let buf = '';
    child.stdout.on('data', (chunk) => {
      buf += chunk;
      for (let i = buf.indexOf('\n'); i >= 0; i = buf.indexOf('\n')) {
        lines.push(JSON.parse(buf.slice(0, i)));
        buf = buf.slice(i + 1);
        if (lines.length === 2) resolve();
      }
    });
    child.on('error', reject);
    timer = setTimeout(() => reject(new Error('MCP server did not answer within 10s')), 10_000);
  });
  const write = (m) => child.stdin.write(`${JSON.stringify(m)}\n`);
  write({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } } });
  write({ jsonrpc: '2.0', method: 'notifications/initialized' });
  write({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  try {
    await done;
  } finally {
    clearTimeout(timer);
    child.kill();
  }
  assert.deepEqual(lines.map((l) => l.id), [1, 2]);
  assert.ok(lines[1].result.tools.length >= 8);
});
