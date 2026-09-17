#!/usr/bin/env node
// CrafterWIKI MCP server over stdio: newline-delimited JSON-RPC 2.0, zero dependencies.
// Serves the public corpus only — the private/ overlay is never loaded here.
import { createInterface } from 'node:readline';
import { loadCorpus, publicCorpus } from '../cli/lib.mjs';
import { createServer } from './tools.mjs';

const send = (obj) => process.stdout.write(`${JSON.stringify(obj)}\n`);
const handle = createServer(publicCorpus(loadCorpus()));

createInterface({ input: process.stdin, crlfDelay: Infinity }).on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  const res = handle(msg);
  if (res) send(res);
});
