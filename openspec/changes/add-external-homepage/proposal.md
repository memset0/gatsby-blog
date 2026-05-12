## Why

The author has built a standalone personal landing page (academic-homepage style, with its own typography and palette) and wants it served at the site root `/`. The existing Gatsby blog content remains valuable but the article-list-as-homepage UX no longer fits — the new page is the about-me destination, and articles should live one level deeper. The two UIs are intentionally not unified ("两个独立的导航") because the landing page is designed as a portfolio surface, not a blog chrome.

## What Changes

- The site root `/` SHALL serve `homepage/index.html` from an externally-cloned `memset0/memset0.github.io` repo. Gatsby MUST NOT register any page at `/`.
- The article list (currently at `/`, `/2/`, ... `/N/`) MOVES to `/posts/`, `/posts/2/`, ... `/posts/N/`. Per-post URLs (`/oi/...`, `/blog/...`, etc.) are unchanged.
- The old `/about/` page is hidden from the top navigation. The page file SHALL remain in place — the URL is still reachable for any deep links, but is no longer surfaced from the blog chrome.
- The top navigation gains a "首页" entry pointing to `/` (hard navigation to the external homepage). "所有文章" is retargeted to `/posts/`. "关于博主" is removed.
- The build system gains a `predev` / `prebuild` hook that auto-clones-or-pulls the homepage repo into `./homepage/`. CI gets an extra checkout step for the same repo.
- The homepage repo's static assets (`homepage/index.html`, `homepage/assets/*`, `homepage/src/*.jsx`, and any future files like `homepage/pdf/*`) SHALL be deployed verbatim under their relative paths at the site root.

**Not changing:**
- Per-post URLs, the categories tree, doc-mode, friends page, frontmatter contract, comments — all preserved.
- The old `/about/` URL keeps 200ing for backward compatibility with any external deep links.

## Capabilities

### New Capabilities

- `external-homepage`: The integration contract between this Gatsby site and the external homepage repo — where the homepage repo is fetched from, when it is fetched, what part of the site it owns, and the deliberate decoupling from the blog's UI shell.

### Modified Capabilities

- `content-organization`: The site root no longer hosts the article list; it is reserved for the external homepage. The `gatsby-plugin-static-folders` configuration extends to include `./homepage`.
- `post-visibility`: The "homepage lists published posts" requirement is restated for the new URL — the article list lives at `/posts/`, not `/`.

## Impact

- **Files changed**: `gatsby-config.js`, `gatsby-node.js`, `src/data/navigators.js`, `package.json`, `.github/workflows/deploy.yml`, `.gitignore`, `CLAUDE.md`. No source file deletions (the `src/pages/about.js` page is intentionally kept; it just falls off the nav).
- **Operational dependency**: this Gatsby repo can no longer be built without also having access to `memset0/memset0.github.io`. CI already has the PAT to read the content repo and reuses it for the homepage. Local dev needs the developer to have SSH access to the private homepage repo.
- **Inbound links**: external sites that linked to `https://mem.ac/` will now land on the new homepage. If anyone external linked to `/page/2/` or similar, those URLs 404 (user confirmed only `/` was ever externally referenced).
- **Risk**: low. No data migrations, no schema changes. Rollback is a single `git revert`.
