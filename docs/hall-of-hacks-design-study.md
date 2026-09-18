# Hall of Hacks — style and organization lessons

Observed 2026-09-17 on [the feed](https://hallofhackss.com/feed), [Classic view](https://hallofhackss.com/classic), [categories](https://hallofhackss.com/categories) and public project pages. This is a design study requested alongside the coverage audit, not a new CrafterWIKI design contract.

Local evidence: `docs/handoff/2026-09-17-coverage-audit/feed-evidence/manifest.json` **[image 1]** (feed); `project-evidence/manifest.json` **[image 1]** (Fable page); `evidence/manifest.json` **[article 1]** (listing and link audit). Images and article passed voidscape inspect → preview → read. Screenshots remain local because they include source/player UI; video content was not analyzed.

| Observed structure | Useful lesson for CrafterWIKI |
| --- | --- |
| A quiet dark shell, large authentic previews and compact text below each image | Let real projects provide the visual interest. Keep consistent media proportions and a short, concrete explanation of what the project does. Preserve the approved cards and both themes. |
| Search in the header, topic chips above the feed, events in a separate sidebar | Topic and event are different browsing questions. Make each understandable without forcing people through a large mixed filter list. Our existing search/event controls and collapsed advanced filters already support this distinction. |
| Card hierarchy: image, title, brief explanation, event/category context | Give readers enough information to decide whether to open the project. Keep exhaustive evidence and implementation details on the deeper surface. |
| Classic view groups cards by event; category view gives named groups with counts | Alternative views should reorganize the same canonical records. Counts require clear scope and category overlap must be explicit. |
| Project page gives the media the largest area, then title, direct resource actions and explanatory text | Put the demonstration and source actions near the project identity. Keep code, submission and video links visible; support Vimeo and external project pages as well as YouTube/Devpost. |
| A compact Up next rail keeps discovery available beside a detail page | A future related-project section could use existing similarity facets and preserve a clear route back to the gallery. This is a follow-up idea, not implemented in this coverage PR. |
| A single Why it won paragraph explains the interesting mechanism | Explain the reusable design lesson in original EN/ES prose, while attributing secondary-source interpretation and keeping reported awards unverified. |
| Infinite scroll repeats cards; embedded players can autoplay | Retain CrafterWIKI's explicit 12-item pagination, deduplication, lazy images and external video links. These make the browsing boundary clear and avoid unsolicited playback. |

The transferable sequence is **discover → understand the demo → inspect sources → apply a lesson**. CrafterWIKI adds the builder brief to that sequence. Keep Explore/Build/Learn, EN/ES, dark/light themes and the approved responsive gallery. Do not copy Hall's creator profiles, account features, prose, logo or claims of verified wins.
