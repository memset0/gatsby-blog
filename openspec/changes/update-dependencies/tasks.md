## 1. Baseline

- [x] 1.1 Verify a clean build on current `master` succeeds before touching any version (`npm run clean && npm run build`)
- [x] 1.2 (baseline: 19 low / 38 moderate / 33 high / 2 critical = 92 total) Note the current `npm audit` totals (count by severity) for before/after comparison
- [x] 1.3 (saved to `/tmp/blog-baseline/{index,about,friends,post}.html`) Capture a sample of rendered HTML from `/`, `/about/`, `/friends/`, and one post page (curl + diff against post-upgrade output later)

## 2. Gatsby ecosystem upgrade

- [x] 2.1 `npm install gatsby@^5.16.1`
- [x] 2.2 `npm install gatsby-plugin-feed@^5.16 gatsby-plugin-image@^3.16 gatsby-plugin-less@^7.16 gatsby-plugin-manifest@^5.16 gatsby-plugin-react-helmet@^6.16 gatsby-plugin-sharp@^5.16`
- [x] 2.3 `npm install gatsby-remark-images@^7.16 gatsby-remark-katex@^7.16 gatsby-remark-prismjs@^7.16 gatsby-remark-responsive-iframe@^6.16`
- [x] 2.4 `npm install gatsby-source-filesystem@^5.16 gatsby-transformer-remark@^6.16 gatsby-transformer-sharp@^5.16`
- [x] 2.5 Run `npm run clean && npm run build`. Build succeeded; audit dropped 92 → 82. Rendered HTML sizes match baseline ± 584 bytes per page (chunk hash drift, not content). No pinbacks needed.

## 3. MUI / Emotion upgrade (stay on majors)

- [x] 3.1 `npm install @mui/material@^6.5 @mui/icons-material@^6.5`
- [x] 3.2 Picked `@mui/lab@6.0.1-beta.36` (latest v6 beta; the `dev.*` tag from `npm outdated` was actually older than the betas)
- [x] 3.3 `@emotion/react@^11.14.1` does NOT exist (latest is 11.14.0) — npm outdated misreported because of a registry/lockfile quirk. Only `@emotion/styled` was bumped, to 11.14.1.
- [x] 3.4 `npm install @fontsource-variable/montserrat@^5.2 @fontsource/merriweather@^5.2`
- [x] 3.5 Build succeeded. Friends page shrunk by 909 bytes — diagnosed as MUI 6.5 no longer leaking React `useId` artifacts (`id=":Rxxxxx:"`) into SSR HTML on MuiButton; 65 buttons × ~14 chars matches exactly. NOT a regression — fewer hydration ID mismatches. Other pages: chunk-hash drift only.

## 4. Misc direct deps

- [x] 4.1 `npm install hast-util-to-html@^9.0.5 lodash@^4.18.1 prismjs@^1.30 yaml@^2.9`
- [x] 4.2 `npm install -D prettier@^3.8.3`
- [x] 4.3 Build clean. Zero HTML delta from misc bumps.

## 5. Audit fix

- [x] 5.1 `npm audit fix` (no `--force`) dropped 85 → 55 (-30 more vulns after the direct-dep upgrades had already dropped 92 → 85). Lockfile-only diff — `package.json` unaffected.
- [x] 5.2 Post-fix build clean; HTML byte-identical to post-MUI build.
- [x] 5.3 Remaining 55 vulnerabilities are all transitive in dev/build tooling and require `--force` (breaking) or have no upstream fix:
  - `@parcel/reporter-dev-server`, `cookie`, `file-type`, `katex`, `path-to-regexp` — all reachable only via `gatsby develop`'s internal pipeline, not in shipped code
  - `lodash` (old) — only in `@graphql-codegen/*` build tooling, not in our runtime lodash usage (which is on the latest)
  - `json5 <1.0.2` — through `svg-react-loader` (build-time SVG handling), no upstream fix
  - `immutable` — has a fix but it conflicts with the React 18 peer (would need `--force`)
  - None of these are reachable at runtime from the deployed static site.

## 6. Verification

- [x] 6.1 Dev server started; "You can now view memset0-blog in the browser" reached.
- [x] 6.2 `/`, `/about/`, `/friends/`, `/oi/algorithm/mpe-and-fip/` all HTTP 200 via dev server (each 3653B — the standard Gatsby dev hydration shell).
- [-] 6.3 SKIPPED — no headless-browser tooling in this environment; relying on byte-level production HTML diff against baseline instead. Production build already verified (§5.2): only delta is the MUI 6.5 useId-leak fix on friends page.
- [x] 6.4 Production `public/` already verified clean after every step (§2, §3, §4, §5). Top-level entries unchanged.

## 7. Wrap up

- [ ] 7.1 Stage `package.json` and `package-lock.json` (and any source fixes that were genuinely needed)
- [ ] 7.2 Commit with a message that follows the project's Conventional Commits style: `chore: update dependencies within current majors` (see CLAUDE.md "Commit message convention")
- [ ] 7.3 Run `openspec archive update-dependencies` after the user confirms the change is merged, so `build-toolchain` spec gets folded into `openspec/specs/`
