## Why

The `add-external-homepage` change introduced two regressions:

1. **`/posts/` lists no articles.** The `paginate()` call in `gatsby-node.js` had its `pathPrefix` changed from `/` to `/posts` (correct — that's the URL where listing pages get generated) **and** its `prefixRegex` changed from `^/` to `^/posts/` (incorrect — that's a regex over source-post slugs, which start with `/blog/`, `/oi/`, etc., never `/posts/`). The GraphQL filter `slug: { regex: $prefixRegex }` therefore matches zero posts. Two conflated roles of a single name.

2. **The top-nav order is wrong.** The previous nav put "关于博主" last (after 友情链接). I retargeted that slot to "首页" / `/` but also moved it to the first position. The author wants "首页" to occupy the same last position that "关于博主" had — subject-area links first, personal link last.

Both are implementation bugs against the intent of the prior change. The specs encoded the intent correctly but loosely enough that I missed the implication on first read; this change tightens both spec requirements so the same mistake can't recur and fixes the code.

## What Changes

- `gatsby-node.js`: revert the `prefixRegex` in the article-list-root `paginate()` call from `^/posts/` back to `^/`, while keeping `pathPrefix: "/posts"`. The same fix updates the context's `pathPrefix` string too — it must remain `/posts/` (URL space), but `prefixRegex` must be `^/` (slug space).
- `src/data/navigators.js`: move the "首页" entry to the last position in the array (after "友情链接"), restoring the prior layout.
- `openspec/specs/post-visibility/spec.md`: tighten the "Article List Root Lists Published Posts Only" requirement with a scenario that makes the cross-category aggregation explicit (so a future reader understands the article list draws from ALL post slugs, not just slugs under `/posts/`).
- `openspec/specs/external-homepage/spec.md`: tighten the "Old About URL Hidden From Nav But Reachable" requirement so "the corresponding chrome slot" is replaced by explicit "last position in the navigation list".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `post-visibility`: clarify that the `/posts/` list aggregates posts across categories — the spec previously left the aggregation surface implicit, which let the implementation drift.
- `external-homepage`: make the navigation position of the "首页" entry explicit (last), removing the prior "corresponding chrome slot" ambiguity.

## Impact

- **Files changed**: `gatsby-node.js` (1 line of `prefixRegex` + 1 line of context `pathPrefix`), `src/data/navigators.js` (move one block to the end).
- **Build/output**: `public/posts/index.html` and its pagination pages will once again contain the rendered article list; their HTML byte size will jump from "empty list page" back to the normal "10 cards per page" volume. Other pages unaffected.
- **Nav UX**: the 5 nav entries display in the original order from before `add-external-homepage`, with "首页" replacing "关于博主" at the bottom.
- **Risk**: trivial. Both fixes are one-line. The build will verify locally before push.
- **Rollback**: revert the single commit.
