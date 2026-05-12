## Context

The blog runs on Gatsby 5.14.1 with React 18.3.1, MUI v6.4.3, and ~30 other direct dependencies, all installed several months ago. `npm install` emits a long list of deprecation warnings (`@babel/plugin-proposal-*`, `urix`, `core-js@2`, etc.) and `npm audit` flags 92 vulnerabilities across the transitive tree. Most of those vulnerabilities are already fixed in the latest minor releases of our direct deps — we just haven't picked them up.

This is a maintenance change with no intended product impact. The site has no test suite, so verification is "does dev/build still produce the same site". The dev server has been observed working with the cloned content repo (254 markdown posts), so we have a known-good baseline to compare against.

## Goals / Non-Goals

**Goals:**

- Pick up every available minor/patch upgrade across `dependencies` and `devDependencies`.
- Reduce `npm audit` count by applying non-breaking transitive fixes.
- Fail loud and early on any incompatibility — `npm run build` must succeed after the upgrade, and the rendered site must be visually equivalent at the URLs we can reach via `curl` (homepage, `/about/`, `/friends/`, a couple of post pages).
- Document what was skipped and why, so the next person revisiting deps knows where the cliff is.

**Non-Goals:**

- Crossing any major boundary (React 19, MUI 7+, cross-env 10, mdast-util-to-string 4, flexsearch 0.8). Each of those is a separate change with its own design.
- Eliminating *every* vulnerability — some come from transitive deps with no upstream fix yet (`xml2js`, `socket.io-adapter`) and require either a workaround or accepting risk.
- Adding tests. The lack of tests is a known issue but out of scope here.
- Lockfile-only changes (e.g. `npm update`) — we want the `package.json` to reflect the new floor so the next contributor's `npm install` reproduces the same versions.

## Decisions

**1. Stay within current majors for every direct dep.**

Rationale: The user asked for "稍微更新" (slight update) under mutual compatibility. The interlocking pieces are Gatsby ↔ React ↔ MUI ↔ Emotion. Crossing React 18 → 19 forces a re-check across all three of the others; crossing MUI 6 → 7 forces an audit of every `<Grid>` usage. We don't want to spend that risk budget in this change.

Alternatives considered: (a) "minimal — only audit fixes": leaves us further behind every month. (b) "aggressive — all latest": forces React 19 / MUI 9 cascade with no test coverage to validate. We pick the middle.

**2. Pin `mdast-util-to-string` at exact `2.0.0`.**

Rationale: `package.json` already pins this to `"2.0.0"` (no caret). v4 has an incompatible API. This pin should remain — if a remark plugin in `plugins/` imports it, the v2 surface is what they expect.

**3. Use `npm install <pkg>@<version>` per dependency (not `npm update`) to bump `package.json` floors.**

Rationale: `npm update` only bumps lockfile within existing semver ranges, leaving `package.json` floors stale. We want the new versions to be the *minimum* the next contributor sees, so we explicitly set them with `npm install`.

**4. Run `npm audit fix` last, not first.**

Rationale: Many of the audit findings will resolve on their own once the direct deps move forward (their transitive deps update too). Running audit fix first might patch transitive trees that the subsequent direct-dep bump then overwrites — wasted churn. After the direct bumps land, audit-fix only addresses what truly remains.

**5. Verification: run `npm run clean && npm run build` to completion, then start `npm run dev` and curl key URLs.**

Rationale: No tests exist. The build is the most rigorous static check we have (it exercises GraphQL, image processing, every plugin's transform). A clean dev start adds incremental-rebuild coverage.

## Risks / Trade-offs

- **[Gatsby plugin minor bump silently breaks a transform]** → Mitigation: run `npm run build` end-to-end after the upgrades; spot-check rendered HTML for a callout, math block, code block, and image. Any regression fails the change.
- **[`@mui/lab` is on a `6.0.0-beta` track]** → The "Wanted" version reads `6.0.0-dev.20240529-082515-213b5e33ab`, which is a pre-release tag (not a stable). Mitigation: if it pulls in incompatibilities, pin to the previous stable beta in `package.json` and document.
- **[`npm audit fix` introduces a transitive bump that conflicts with a direct dep]** → Mitigation: review the audit-fix diff before staging; revert lockfile if it touches anything unexpected.
- **[Remaining un-fixable advisories]** → Accept and note them in the tasks artifact. They're transitive in build-time tooling (`xml2js` via Gatsby's manifest plugin), not in shipped code.

## Migration Plan

1. Snapshot current `package.json` and `package-lock.json` (the existing commit is the snapshot).
2. Bump direct deps in batches by ecosystem (gatsby-*, mui, emotion, fonts, misc).
3. After each batch: `npm install`, then `npm run clean && npm run build`. If the build fails, narrow down which package caused it, pin that one back, and continue.
4. After all batches: `npm audit fix` (no `--force`), then re-run the build.
5. Start `npm run dev`, curl `/`, `/about/`, `/friends/`, and one post URL. Confirm HTTP 200.
6. Commit `package.json` + `package-lock.json` (plus any source fixes that turned out to be needed).

**Rollback**: `git revert <commit>` — there is no data migration to undo.

## Open Questions

- Does `@mui/lab` 6.0.0-dev.* introduce any runtime-visible changes from 6.0.0-beta.26? If so, may need to stay on `^6.0.0-beta.26`.
- Are any of the `npm audit` findings in code paths that actually run at build/runtime? (Most look like dev-only tooling.) Worth a quick scan before deciding what to ignore.
