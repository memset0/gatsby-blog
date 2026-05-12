## 1. Bug fixes

- [x] 1.1 In `gatsby-node.js` author resolver (around line 442), replace `return await source.authors.map(async name => { ... })` with `return Promise.all(source.authors.map(async name => { ... }))`. Confirm the inner function is unchanged.
- [x] 1.2 In `plugins/gatsby-remark-callout/index.js`, guard the `visit(...)` callback so the initial deep access (`node.children[0].children[0].value`) is wrapped in optional-chaining; if any link is missing or the leading value doesn't start with `[!`, return early without attempting to transform. The existing try/catch around `transformToCallout` stays as a second line of defense.

## 2. Dead-code removal

- [x] 2.1 In `gatsby-config.js`, delete the commented-out RSS feed plugin block (the lines starting with `// { resolve: 'gatsby-plugin-feed', ...` through its closing `// },`). The block spans roughly 50 lines.
- [x] 2.2 In `gatsby-config.js`, delete the commented-out umami plugin block (the lines starting with `// { resolve: 'gatsby-plugin-umami', ...` through its closing `// },`). About 12 lines.
- [x] 2.3 In `src/utils/{nav,toc,scroll,umami}.js` and `src/templates/{post,post-list}.js`, delete every `// console.log(...)` line (commented-out debug residues only — leave any uncommented `console.log` alone). Grep first to enumerate, edit second.
- [x] 2.4 Delete `src/components/Bio.js` (an orphan: no `import` of `Bio` exists; verified by repo-wide grep). Do NOT delete `content/bio.md` — that lives in the separate content repo.

## 3. Metadata fixes

- [x] 3.1 In `package.json`, replace the gatsby-starter-blog `repository.url` and `homepage` with the real repo URL (`https://github.com/memset0/gatsby-blog`). The `bugs.url` already points to the right repo via the issues page convention — verify and adjust if needed.
- [x] 3.2 In `src/components/Comments.js`, rename the local component variable from `Commments` (triple-m) to `Comments`. Update the `export default` to match. No callers need to change (they import via default).

## 4. Verification

- [x] 4.1 `npm run clean && npm run build` succeeds.
- [x] 4.2 Diff `public/` byte-for-byte against the pre-change build (or compare a representative sample of pages — `/`, `/posts/index.html`, `/about/index.html`, `/friends/index.html`, and one post page). Only chunk-hash drift or Gatsby generator meta-tag changes are acceptable.
- [x] 4.3 Start `npm run dev`. `curl /`, `/posts/`, `/posts/2/`, `/about/`, `/friends/`, `/oi/` all return HTTP 200.
- [x] 4.4 Manually verify the friends page renders the same friends in the same order — the author-resolver fix must not reorder or drop entries.

## 5. Wrap up

- [x] 5.1 Stage every file touched plus the change directory.
- [x] 5.2 Commit with `refactor: dead-code removal, bug fixes, and metadata cleanup` (Conventional Commits per CLAUDE.md). Net line count should be negative.
