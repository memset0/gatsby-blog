## Why

A code survey turned up real cruft in this aging codebase: two functional bugs (a `Promise[]`-not-`await`-ed pattern in the friends resolver, and an unguarded deep access in the callout plugin that crashes the whole build on malformed input), several blocks of long-dead commented code, debug `console.log` ghosts scattered across utils and templates, package metadata that still points at the `gatsby-starter-blog` scaffold, a typo, and a fully-orphaned `Bio` component left over from an older homepage design. Each item is small; addressed together they make the project meaningfully more "finished" without changing what the user sees.

## What Changes

**Bug fixes (functional):**
- `gatsby-node.js` author resolver: replace `return await source.authors.map(async ...)` (returns a Promise array) with `Promise.all(...)` so the resolved-value array is awaited. The current shape relies on downstream coercion and is order-fragile.
- `plugins/gatsby-remark-callout/index.js`: guard the deep `node.children[0].children[0].value` access so a malformed blockquote skips the callout transform rather than throwing — preserves the "fail-soft for content" philosophy of the rest of the markdown pipeline.

**Dead-code removal (pure deletion):**
- `gatsby-config.js`: remove the ~50-line commented-out RSS feed plugin block and the ~12-line commented-out umami plugin block. Both reference disabled features and are not "templates we plan to re-enable" — if RSS comes back, it'll get a fresh config.
- Strip the `// console.log(...)` debug residues from `src/utils/{nav,toc,scroll,umami}.js` and `src/templates/{post,post-list}.js`.
- Delete `src/components/Bio.js` (an orphan: no `import` of `Bio` exists anywhere; its `bio.md` GraphQL query is the only consumer, and the query itself is the only mention of `bio.md` in the codebase).

**Metadata fixes:**
- `package.json`: update `repository.url` and `homepage` from the gatsby-starter-blog scaffold URLs to the actual repo URL.
- `src/components/Comments.js`: fix the local variable name `Commments` (triple-m) → `Comments`. Affects no exports or imports (the file's default export was already `Commments` and consumed via default-export name — renaming changes nothing externally).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `markdown-extensions`: tightens the callout requirement with a new scenario establishing the fail-soft contract — malformed callout structure SHALL NOT crash the build.

## Impact

- **Files changed**: `gatsby-node.js`, `gatsby-config.js`, `package.json`, `plugins/gatsby-remark-callout/index.js`, `src/components/Comments.js`, `src/utils/{nav,toc,scroll,umami}.js`, `src/templates/{post,post-list}.js`. `src/components/Bio.js` is deleted.
- **Build/output**: the production HTML SHALL be byte-equivalent against the current `master` modulo chunk-hash drift. The `npm run build` exit code stays 0; pagination counts, asset paths, GraphQL schema all unchanged.
- **Author-resolver ordering**: in theory more reliable post-fix; in practice the old code happened to also work because the downstream consumer awaits each promise as it accesses it. Test: the `/friends/` page renders the same friend list in the same order.
- **Risk**: low. Net diff is heavily negative (many lines deleted, few added). The only behavior change is "callout plugin no longer crashes on weird input" — a strict improvement over the status quo (build failure).
- **Rollback**: revert the single commit.
