## Context

The blog has been in maintenance mode for some time, accumulating commented-out features ("we might want this back someday") and debugging artifacts. This change is the result of an audit pass: the items here are the highest-signal, lowest-risk subset of what was found. Items requiring new abstractions (extracting magic numbers into a `constants` file, renaming `selectFromMatter`, restructuring `findNavJson`) were deliberately deferred — they're real but introduce new files/concepts, which doesn't fit the "small refactor, no new abstractions" scope.

## Goals / Non-Goals

**Goals:**

- Net-negative line count: delete more than we add.
- No new files, no new exports, no new concepts.
- Two functional bug fixes that close subtle latent issues (resolver ordering, build-fragility on malformed callout).
- Spec tightening only where there's a real new invariant to capture (callout fail-soft).

**Non-Goals:**

- Adding tests. There's no test infrastructure today; introducing it is a separate, larger change.
- Restructuring `gatsby-node.js` or splitting it into modules. That's a real refactor with real risk; this is the cleanup pass that precedes it.
- Changing rendered HTML, URLs, or any user-visible UX. Build output must be byte-equivalent (modulo chunk-hash drift) against current `master`.
- Removing the `/about/` page (still hidden-but-reachable per the earlier `add-external-homepage` change).

## Decisions

**1. Use `Promise.all` for the author resolver.**

The current code is `return await source.authors.map(async name => { ... })`. `Array.prototype.map` returns synchronously; the callback returns a Promise for each entry; the outer `await` awaits an array (which is already resolved as an array — there's nothing to await). So the function returns an array of Promises. It happens to work because Gatsby's GraphQL layer awaits each authors-array element on access, but that's incidental and fragile.

Fix: `return Promise.all(source.authors.map(async name => { ... }))` — explicitly awaits all the inner promises in parallel, returns an array of resolved values, preserves order.

Alternatives considered: a `for...of` loop with manual awaiting (sequential, slower for N friends with `createRemoteFileNode` round-trips) — rejected for performance. `await Promise.all(...)` plus a redundant outer `await` — same as above but verbose.

**2. Callout plugin guards: skip silently rather than throw.**

The plugin's `visit()` already wraps `transformToCallout` in try/catch (and re-throws on failure). The guard goes one level earlier: before calling `transformToCallout`, verify the structure is what we expect (`node.children?.[0]?.children?.[0]?.value` is a string starting with `[!`). If the precheck fails, return early without converting — leaves the blockquote as-is, which is the safest default.

Alternatives considered: throw a `MarkdownFormatError` with a helpful message (rejected — would still crash the build, which is what we're avoiding). Log a warning (rejected — adds runtime overhead and noise for a rare case that's silently skipped today via existing try/catch in callers).

**3. Delete `Bio.js` outright; do not "deprecate" or "stub".**

Grep confirms zero `import` references. The `bio.md` content file lives in the separate content repo and is unaffected by this deletion. If the author wants a bio component back later, the file is one `git show` away in the history. Stubbing would just leave a different orphan.

**4. Don't touch the timeline data in `about.data.md`.**

That data is in the external content repo, not this one. Deleting it (or hiding it) would be a content-repo change, separate concern.

**5. Limit `console.log` cleanup to commented-out (`// console.log(...)`) lines.**

Live `console.log` calls (uncommented) are intentional. Only the leftover-debugging-comment shape gets removed. The `umami.js` util has a few that are commented-out per the umami-disabled state — removing them is consistent with also removing the umami plugin config from `gatsby-config.js`.

## Risks / Trade-offs

- **[Promise.all change subtly alters error propagation in the resolver]** → The current code's error semantics are "GraphQL might surface a rejected Promise at access time". After the fix: a rejection short-circuits the whole `authors` resolver, which surfaces to the GraphQL layer the same way. End-user behavior should be identical; both paths show one or more rejected friend lookups as nulls/errors.
- **[Bio.js deletion misses a dynamic import]** → Verified no `lazy(() => import(...))` or string-templated requires in `src/`. Safe.
- **[Removing commented umami config exposes the websiteId]** → The websiteId is already in git history (and the repo is public). Removing the inline comment doesn't change the public exposure surface.
- **[Callout fail-soft hides authoring mistakes]** → A malformed `> [!type]` block now renders as a plain blockquote instead of erroring. Acceptable: the build keeps going and the author sees the un-converted block in their preview, which is itself the "this is malformed" signal.

## Migration Plan

1. Apply the edits one cluster at a time (bugs → dead code → metadata).
2. After each cluster: `npm run build`, then diff `public/` against a pre-change build for unexpected churn. Acceptable diffs: chunk-hash differences, the `Gatsby x.y.z` generator meta-tag drift, anything attributable to the chunk-rebuild. Unacceptable diffs: missing posts, mangled HTML structure, asset-path changes.
3. After everything: start `npm run dev`, curl `/`, `/posts/`, `/posts/2/`, `/about/`, `/friends/`, `/oi/`. All should return HTTP 200.
4. Commit.

**Rollback**: `git revert`. No data, no migrations, no infra.

## Open Questions

None — every item is independently bounded and verifiable.
