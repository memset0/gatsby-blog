# build-toolchain Specification

## Purpose
TBD - created by archiving change update-dependencies. Update Purpose after archive.
## Requirements
### Requirement: Node Runtime Floor
The project SHALL require Node.js 20.19.0 or higher at build time. Older versions MUST NOT be supported. This floor is set by Gatsby 5's own runtime requirements and by the OpenSpec CLI used in the developer workflow.

#### Scenario: Build on supported Node
- **WHEN** a developer runs `npm install` followed by `npm run build` on Node 20.19.0 or newer
- **THEN** the build completes without engine warnings about Node version

#### Scenario: Build on unsupported Node
- **WHEN** a developer attempts to install on Node older than 20.19.0
- **THEN** `npm install` surfaces an `EBADENGINE` warning naming the offending package(s)

### Requirement: Gatsby Major Pin
The `gatsby` direct dependency SHALL stay on the 5.x major line. All `gatsby-plugin-*`, `gatsby-remark-*`, `gatsby-source-*`, and `gatsby-transformer-*` packages SHALL be on majors compatible with Gatsby 5.x. Moving to Gatsby 6 (when it exists) is an explicit, separate change.

#### Scenario: Direct dep within Gatsby 5
- **WHEN** `package.json` is inspected
- **THEN** every `gatsby*` entry in `dependencies` resolves under SemVer to a 5.x (or 5.x-compatible plugin major) version

### Requirement: React Major Pin
The `react` and `react-dom` direct dependencies SHALL stay on the 18.x major line. React 19 adoption is explicitly out of scope; it requires re-validating SSR, hydration, and `gatsby-plugin-image` integration, and belongs in a dedicated change.

#### Scenario: React 18 still in use
- **WHEN** `package.json` is inspected
- **THEN** `react` and `react-dom` both resolve to a `^18.x` version

### Requirement: MUI Major Pin
The `@mui/material`, `@mui/icons-material`, and `@mui/lab` direct dependencies SHALL stay on the v6 major line. MUI 7+ introduces breaking changes to Grid, slot props, and CSS variables that require a coordinated audit of every MUI component used in `src/components/` and `src/templates/`.

#### Scenario: MUI v6 still in use
- **WHEN** `package.json` is inspected
- **THEN** `@mui/material` and `@mui/icons-material` resolve to `^6.x`, and `@mui/lab` resolves to a v6 pre-release

### Requirement: Pinned Compatibility Exceptions
Where a dependency cannot be updated within its current major without breaking upstream contracts, that pin SHALL be recorded explicitly with no caret (exact version). Currently this applies to `mdast-util-to-string`, which MUST stay pinned at `2.0.0` because the v3+ API is incompatible with the remark-plugin generation in use.

#### Scenario: mdast-util-to-string remains pinned
- **WHEN** `package.json` is inspected
- **THEN** `mdast-util-to-string` is exactly `"2.0.0"` (no caret, no tilde)

### Requirement: Direct Dependencies Reflect Minimum-Acceptable Versions
When the project upgrades a dependency, `package.json` SHALL record the new floor explicitly (via `npm install <pkg>@<version>`), not just bump the lockfile. This ensures `npm ci` in CI and on contributors' machines reproduces the intended minimum.

#### Scenario: Floor recorded in package.json after upgrade
- **WHEN** a dependency is upgraded as part of a maintenance change
- **THEN** the new version range appears in `package.json` `dependencies` (or `devDependencies`), not only in `package-lock.json`

### Requirement: Pre-release Dependencies Pinned To Specific Tags
A direct dependency on a pre-release version (e.g. `1.2.3-beta.4`) SHALL be recorded with a caret range against the exact tag installed at upgrade time (e.g. `^1.2.3-beta.4`), and re-pinned explicitly when bumped. The blog SHALL NOT assume that `^X.Y.Z-tag.N` will resolve to a newer pre-release of the same major; SemVer treats pre-release suffixes restrictively and a caret range on a pre-release does not automatically pick up later pre-release tags. Currently this applies to `@mui/lab` (no v6 stable release exists; the line is pre-release only).

#### Scenario: Upgrading @mui/lab requires an explicit version
- **WHEN** a maintainer wants to move `@mui/lab` from one v6 beta to a newer v6 beta
- **THEN** they MUST install the specific target version (e.g. `npm install @mui/lab@6.0.1-beta.40`), not rely on `npm update` picking up a newer pre-release

### Requirement: Maintenance Changes Use Non-Forced Audit Fixes Only
Maintenance/upgrade changes SHALL run `npm audit fix` only **without** `--force`. Crossing a major-version boundary as a side effect of an audit fix is not permitted in a maintenance change — it requires its own change proposal so that breaking-change consequences can be analyzed up front. Remaining advisories after a non-forced audit fix SHALL be documented (in the change's tasks artifact) with a one-sentence justification per item, noting whether they sit in code paths reachable at site-build time, dev-server time, or never.

#### Scenario: Maintenance change preserves all majors
- **WHEN** a maintenance change runs `npm audit fix`
- **THEN** no entry in `package.json` `dependencies` or `devDependencies` crosses a major-version boundary as a result

#### Scenario: Residual advisories documented
- **WHEN** a maintenance change completes with a non-zero `npm audit` count
- **THEN** the change's tasks artifact contains a list of the remaining advisories with one-sentence justifications

