## 1. Local homepage setup

- [x] 1.1 Clone `memset0/memset0.github.io` into `./homepage/` (this directory is now `.gitignore`'d).
- [x] 1.2 Verify the homepage repo contents: `index.html` + `assets/` + `src/*.jsx`. Confirm it expects to be served at the relative paths it ships.

## 2. Gatsby wiring

- [x] 2.1 Add `./homepage` to the `folders` list of `gatsby-plugin-static-folders` in `gatsby-config.js`.
- [x] 2.2 In `gatsby-node.js`, change the homepage `paginate()` call's `pathPrefix` from `/` to `/posts`, and update the `prefixRegex` and the `pathPrefix` inside `context` to match.
- [x] 2.3 Confirm no `src/pages/index.js` exists and no other `createPage` call targets `/`.

## 3. Navigation update

- [x] 3.1 In `src/data/navigators.js`, retarget "所有文章" to `/posts/` (and broaden its `rule` to match `/posts/...`).
- [x] 3.2 Rename "关于博主" → "首页" with target `/` (and change its icon to a Home-ish icon).
- [x] 3.3 Confirm `/about/` is no longer reachable from the top nav, but `src/pages/about.js` is untouched.

## 4. Fetch hook + CI

- [x] 4.1 Add `fetch-homepage` script to `package.json` that does `if [ -d homepage/.git ]; then git pull --ff-only; else git clone …; fi`.
- [x] 4.2 Wire it as `predev` and `prebuild`.
- [x] 4.3 Add a `Checkout homepage` step to `.github/workflows/deploy.yml` (uses the existing PAT_TOKEN, target path `homepage`).

## 5. Docs

- [x] 5.1 Update `CLAUDE.md`'s external-repos section to describe both `./content/` and `./homepage/`, including the deliberate decoupling between the two navs.

## 6. Verification

- [x] 6.1 `npm run clean && npm run build` completes without errors.
- [x] 6.2 `public/index.html` is byte-identical to `homepage/index.html` (md5 match).
- [x] 6.3 `public/posts/index.html`, `public/posts/2/`, … `public/posts/7/` exist (7 pages for the current post count).
- [x] 6.4 `public/assets/avatar.png` and `public/src/app.jsx` exist; `public/CNAME` still in place (from `./assets/CNAME`, no collision).
- [x] 6.5 `public/about/index.html` still exists (page kept).
- [x] 6.6 Dev server boots; `curl /`, `/posts/`, `/posts/2/`, `/about/`, `/friends/`, `/oi/`, `/assets/avatar.png`, `/src/app.jsx`, `/CNAME` all return 200.

## 7. Wrap up

- [ ] 7.1 Stage the modified files (`gatsby-config.js`, `gatsby-node.js`, `src/data/navigators.js`, `package.json`, `.github/workflows/deploy.yml`, `.gitignore`, `CLAUDE.md`) plus the change directory `openspec/changes/add-external-homepage/`.
- [ ] 7.2 Commit with `feat: serve external homepage at /, move article list to /posts/` (Conventional Commits per CLAUDE.md).
