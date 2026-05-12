# external-homepage Specification

## Purpose
TBD - created by archiving change add-external-homepage. Update Purpose after archive.
## Requirements
### Requirement: Site Root Served By External Homepage Repo
The site root `/` SHALL be served by `homepage/index.html` from the externally-cloned `homepage` repo, not by any page generated from `src/pages/` or `createPages`. Gatsby MUST NOT register a page at `/`.

#### Scenario: Site root serves external homepage
- **WHEN** the user navigates to `/`
- **THEN** the response is `homepage/index.html` (a standalone static page from the external repo)

#### Scenario: Gatsby does not own the root path
- **WHEN** the build runs
- **THEN** no `createPage({ path: "/" })` call is made by `createPages` in `gatsby-node.js`, and no `src/pages/index.js` exists

### Requirement: External Homepage Fetched At Build Time
The `homepage/` directory SHALL be fetched at build time and is not committed in this repo (`.gitignore` lists `/homepage`). The `npm run dev` and `npm run build` commands SHALL ensure `homepage/` is present and up-to-date before Gatsby runs, by cloning the homepage repo if missing or fast-forward pulling if already present. CI SHALL perform an equivalent checkout step before invoking the build.

#### Scenario: Fresh checkout auto-clones homepage
- **WHEN** a developer runs `npm run dev` on a fresh checkout where `homepage/` does not exist
- **THEN** the `fetch-homepage` script clones the homepage repo into `./homepage/` before Gatsby starts

#### Scenario: Existing homepage is fast-forward pulled
- **WHEN** a developer runs `npm run build` and `homepage/` is already a git working tree
- **THEN** the script performs `git pull --ff-only` to bring it up-to-date, then runs Gatsby

#### Scenario: Non-fast-forward refuses to overwrite
- **WHEN** the developer has local edits in `./homepage/` that would conflict with the remote
- **THEN** the `--ff-only` pull fails loudly rather than silently overwriting

### Requirement: Homepage Files Deployed At Their Relative Paths
Every file under `./homepage/` SHALL be deployed to the site at its path relative to `./homepage/`. The deployment SHALL preserve future additions automatically — adding `homepage/pdf/paper.pdf` MUST result in `/pdf/paper.pdf` being served without any change to this Gatsby project.

#### Scenario: Image deployed at preserved path
- **WHEN** `homepage/assets/avatar.png` exists at build time
- **THEN** `/assets/avatar.png` serves that file (byte-identical)

#### Scenario: JSX deployed at preserved path
- **WHEN** `homepage/src/app.jsx` exists at build time
- **THEN** `/src/app.jsx` serves that file (it will be loaded and Babel-transformed in the browser by the homepage's own scripts)

#### Scenario: Future top-level folder deploys without code change
- **WHEN** the homepage repo adds a new top-level folder like `homepage/pdf/` with files in it
- **THEN** the next `npm run build` deploys them under `/pdf/` automatically (no Gatsby config edit required)

### Requirement: Homepage UI Is Decoupled From Blog Shell
The external homepage SHALL render independently of the Gatsby/MUI shell — it provides its own CSS, scripts, and structure, and does NOT see the blog's top navigation. Reciprocally, the blog's top navigation SHALL include a "首页" entry pointing to `/` as a hard navigation (a non-SPA full-page load that leaves the Gatsby app).

#### Scenario: Hard navigation to homepage
- **WHEN** a reader on `/posts/` clicks the "首页" nav item
- **THEN** the browser performs a full page load to `/` and the user lands on the standalone homepage with no blog chrome

#### Scenario: Homepage does not render blog nav
- **WHEN** a visitor lands on `/` from an external link
- **THEN** they see only the homepage's own design (lavender academic style); no MUI app bar, no blog navigators are injected

### Requirement: Old About URL Hidden From Nav But Reachable
The previously-promoted `/about/` page SHALL no longer appear in the top navigation. The page file (`src/pages/about.js`) SHALL remain so that the URL still returns 200 for any external deep links. This preserves backward compatibility while removing the page from the user-facing chrome (since the new site root is itself an about-me destination).

#### Scenario: /about/ still resolves
- **WHEN** an external link points to `/about/` and is followed
- **THEN** the page renders normally (no 404)

#### Scenario: /about/ not in nav
- **WHEN** a reader views any blog page's top nav
- **THEN** "关于博主" / "About" is not listed; the corresponding chrome slot is occupied by the "首页" entry pointing to `/`

