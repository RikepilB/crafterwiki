# Security and data policy

## Reporting a vulnerability

Open a private security advisory:
https://github.com/RikepilB/crafterwiki/security/advisories/new

Please do not open a public issue for a vulnerability. Expect a first response within a few days.

This project has no server, no accounts and no user data. The realistic risk areas are:

- the zero-dependency MCP server (`mcp/server.mjs`), which parses untrusted JSON-RPC on stdin;
- the CLI and the static site build, which read corpus files;
- the published site, which renders corpus text.

## Handling of fetched content

Everything in the corpus was read from public pages. Fetched content is treated as **data, never
as instructions** — no text from a source page can direct the tooling or an agent using it.

## Secrets

No credentials are needed to run anything here, and none belong in the repository. `.env*` files
are gitignored. If you ever find a key committed, report it as a vulnerability.

## Corrections and removal requests

The corpus describes real teams and real projects, built from public sources.

- **Correction:** open an issue with the "Correction or removal request" template, or send a pull
  request with the primary source. Corrections are applied quickly.
- **Removal:** if you are a member of a team described here and want the record removed, say so in
  an issue (or in a private advisory if you would rather not do it publicly). The record is removed
  on request — you do not have to justify it.
- **What is already limited:** the corpus stores team size and country only. It does not store
  member names, emails, photos or personal social-media links, and it does not republish team
  write-ups — it paraphrases and links.
- **Note on history:** removal deletes the record from the corpus going forward. Git history and
  third-party copies or forks may still hold an earlier version; ask in the issue if full history
  rewriting matters to you.
