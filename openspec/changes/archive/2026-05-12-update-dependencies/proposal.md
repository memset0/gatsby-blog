## Why

The project's dependencies are several months behind their latest minor/patch releases, and `npm audit` reports 92 vulnerabilities (19 low, 38 moderate, 33 high, 2 critical) — most surfaced by transitive packages that newer minor releases of the direct deps already pull in fixed. Updating to the latest non-major versions cleans up the security surface and the deprecation warnings without risking compatibility, since the major versions of our load-bearing dependencies (Gatsby 5, React 18, MUI 6) all stay the same.

## What Changes

- Bump every direct dependency to its latest version **within its current major** (the `Wanted` column from `npm outdated`). Notable ones:
  - `gatsby` and all `gatsby-plugin-*` / `gatsby-remark-*` / `gatsby-source-*` / `gatsby-transformer-*`: 5.14.x → 5.16.x
  - `@mui/material`, `@mui/icons-material`, `@mui/lab`: 6.4.x → 6.5.x (stay on MUI v6)
  - `@emotion/styled`, `@fontsource/*`, `hast-util-to-html`, `lodash`, `prettier`, `prismjs`, `yaml`: patch/minor bumps
- Run `npm audit fix` (without `--force`) to pull in non-breaking transitive security fixes.
- Fix any issues that surface from the upgrades — deprecation warnings, build failures, or runtime regressions in `npm run dev` and `npm run build`.
- **Explicitly out of scope** (deferred to a future change):
  - React 18 → 19 (Gatsby 5 still officially supports React 18; React 19 may break SSR and gatsby-plugin-image)
  - MUI 6 → 7/8/9 (breaking API changes across slot props, Grid v2)
  - `cross-env` 7 → 10 (drops older Node support; not needed for our case)
  - `mdast-util-to-string` 2 → 4 (pinned at exact `2.0.0` for a reason — used by remark plugins that expect the v2 API)
  - `flexsearch` 0.7 → 0.8 (pre-1.0 minor with potentially incompatible index format; would force re-validating search behavior)

No public behavior or user-visible UI changes are intended. The two existing entry points — `npm run dev` (Gatsby develop on port 8080) and `npm run build` (production build) — MUST continue to work and produce output equivalent to the current `master`.

## Capabilities

### New Capabilities

- `build-toolchain`: Formalizes the previously-implicit minimum versions of the build toolchain (Node runtime, Gatsby major, React major, MUI major). Establishing these as explicit floors lets future dependency changes reason against a documented baseline instead of "whatever was installed last time."

### Modified Capabilities

None against the existing user-facing specs (`post-visibility`, `content-organization`, `frontmatter-schema`, `author-attribution`, `markdown-extensions`, `full-text-search`, `post-comments`). The upgrade is intended to preserve all of their behavior unchanged.

## Impact

- **Files changed**: `package.json`, `package-lock.json`. Possibly small source fixes if a minor bump exposes a new deprecation warning that breaks the build (e.g. a remark plugin API surface tweak).
- **Build pipeline**: GitHub Actions workflow `.github/workflows/deploy.yml` already uses `npm ci`, so it'll pick up the new lockfile automatically. No workflow edits needed.
- **Content repo**: unaffected (`./content/` is a separate repo of markdown files).
- **Risk**: low. Largest single bump is Gatsby 5.14.1 → 5.16.1 (still within Gatsby v5, same Node 20 baseline). MUI minor bump is well-tested.
- **Rollback**: revert the single commit. No data migrations, no schema changes.
