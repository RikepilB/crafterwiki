# ADR-010: Local responsive video poster previews

## Context

The reference library links to 11 public YouTube demos. Their hqdefault JPEG previews
are 480 × 360 pixels. Repeated remote poster requests add an external dependency to
the page, and smaller cards do not need the full source dimensions.

## Decision

Run `node scripts/optimize-posters.mjs` to refresh 320- and 480-pixel WebP previews
using the existing Sharp installation in `web/node_modules`. No new package is installed.
The script reads only `publicCorpus(loadCorpus(..., { includePrivate: false }))` and
derives poster URLs from exact public YouTube video links. Only HTTPS requests to
`i.ytimg.com` are allowed, redirects are rejected, and originals are processed in memory.
Sources with adequate resolution may produce a 960-pixel variant; current sources do
not, and no source is enlarged.

`media.js` preserves the original `video` and `poster` URLs and adds `localPoster`,
`posterSrcset`, display/source dimensions, byte counts and variant metadata. Templates
must apply their deployment base path to local URLs. Below-fold images should use
native lazy loading, asynchronous decoding and explicit dimensions. An image visible
in the initial viewport may load eagerly. Optimization alone does not implement these
template behaviors.

## Attribution and scope

These are derived previews of the original YouTube uploads, linked to their exact
source videos. They are not original CrafterWIKI artwork or licensed corpus content.
The presence of a public thumbnail does not establish a redistribution license; no
license grant is claimed. Preserve source attribution and keep this narrow use to
project-reference previews. Neither the script nor this decision asserts video content
was watched or analyzed. Remove or replace a preview if its rights holder requests it.

## Verification and size evidence

On 2026-09-17, all 11 originals were 480 × 360. Total bytes:

| Representation | Bytes | Change from original |
| --- | ---: | ---: |
| Original JPEGs | 133,068 | — |
| 480-pixel WebPs | 110,232 | 17.2% smaller |
| 320-pixel WebPs | 58,032 | 56.4% smaller |
| All 22 files stored | 168,264 | Two responsive options per image |

Browsers select one candidate per image according to layout and pixel density; totals
for all stored variants are not the page transfer estimate. Tests preserve exact
corpus source URLs and check local files, WebP signatures, sizes and no-upscale metadata.

## Status

Accepted for local implementation; deployment and template consumption are separate.

## Date

2026-09-17
