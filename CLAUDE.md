# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Gatsby dev server on port 8080 (`gatsby develop --port 8080` under `NODE_ENV=development`)
- `npm run build` — production build (`NODE_ENV=production gatsby build`); outputs to `public/`
- `npm run serve` — serve the production build (`gatsby serve`)
- `npm run clean` — wipe `.cache/` and `public/` (run after changing `gatsby-node.js`, plugin code, or the schema)
- `npm run format` — Prettier across `**/*.{js,jsx,ts,tsx,json,md}`
- GraphiQL is at `http://localhost:8080/___graphql` while dev is running — use it to verify schema/query changes.

There is no test suite.

## Content lives outside this repo

The blog source code and the blog **content** are split into separate repos:

- This repo holds the Gatsby site (templates, components, plugin glue).
- `./content/` is a separate git repo containing all markdown posts, friends list, covers, and assets. It is **not** committed here (see `.gitignore`: `/content`, `/content*`).
- CI checks out the content repo into `./content/` before building — see `.github/workflows/deploy.yml`.
- For local dev you must clone the content repo into `./content/` yourself. Without it, the build will fail in `gatsby-node.js` (it reads `./content/friends.yml` directly) and in `src/components/Bio.js` (it `StaticImage`-references `../../content/assets/tagcloud-bgwhite.png`).

If you ever need to scaffold without the real content, you need at minimum: `content/friends.yml` (can be `[]`), `content/cover/`, `content/assets/tagcloud-bgwhite.png` (a real PNG, not a stub), and at least one markdown file whose frontmatter declares the fields queried by GraphQL (`hide`, `cover`, `description`) — see "Schema gotcha" below.

## Architecture

### Page generation flow (`gatsby-node.js`)

1. **`onCreateNode`** runs for every `MarkdownRemark` node and decorates it with computed `fields`:
   - `slug` from file path
   - `createTime` / `updateTime` from frontmatter (accepts many aliases: `date`, `create`, `create-time`, `createTime`, `create-date`, `createDate`; same pattern for update)
   - `isDoc` — true if the post's category (from `src/data/categories.js`) has `doc: true`. Doc posts get a sidebar nav.
   - `isPublished` — true iff `(publish || publishedTitle) && createTime && !hide`
   - `isIndexed` — true iff `isPublished || indexed`. Indexed-but-unpublished posts appear in category listings but not the homepage.
   - `cover___NODE` — resolves to a File node either from `./content/cover/<frontmatter.cover>` or from a remote URL via `createRemoteFileNode`.
   - `navJson` — pre-rendered nav JSON (string), produced by `src/utils/nav.js` when frontmatter has `nav`.
   - `propsJson`, `category`, `authors`, `cssclasses`, `plainText` (for search).

2. **`createPages`** queries all posts sorted by `createTime` ASC and creates three kinds of pages:
   - **Home** (`/`) — paginated list of `isPublished` posts, using `gatsby-awesome-pagination`, 10 per page, template `src/templates/post-list.js`.
   - **Category pages** (`/oi/`, `/blog/...`, etc.) — one per leaf in `src/data/categories.js`, paginated. Shows `isIndexed` posts under that category prefix.
   - **Post pages** — one per non-hidden post, template `src/templates/post.js`. Previous/next links skip over unpublished posts. Doc posts also receive `navJson`.

3. **`createResolvers`** wires `Fields.authors` to records in `content/friends.yml` by name match, and exposes `Site.friends` for the friends page.

4. **`createSchemaCustomization`** defines `Frontmatter` and `Fields` types **without `@dontInfer`**, so additional frontmatter fields are still picked up via inference — but only if at least one document has them. See "Schema gotcha".

### Frontmatter contract

Frontmatter keys actually consumed by `gatsby-node.js` / templates:

- Publishing: `publish` (bool), `hide` (bool), `indexed` (bool), `publish-title` / `publishTitle` / `published-title` / `publishedTitle`
- Dates: `date` / `create` / `create-time` / `createTime` / `create-date` / `createDate` (any one becomes `createTime`); same set with `update-*` for `updateTime`
- Display: `title`, `description`, `cover` (local path under `content/cover/` or remote URL)
- Doc-mode extras: `nav` (parsed via `src/utils/nav.js`), `props` (key/value pairs surfaced as `propsJson`)
- Authors: `author` or `authors` (matched against `friends.yml`)
- Styling: `cssclasses`, `blog-cssclasses`

### Categories (`src/data/categories.js`)

A nested object that drives both URL structure and category page generation. Each leaf may set `doc: true` to render that subtree as a docs site (with sidebar nav from frontmatter `nav`). `src/utils/category.js#flatCategories` flattens this into `{slug, node}` entries used by `onCreateNode` to detect doc posts.

### Custom remark plugins (`plugins/`)

Three in-tree plugins loaded by `gatsby-config.js`:

- `gatsby-remark-autolink-headers` — header anchor IDs (icon disabled).
- `gatsby-remark-callout` — Obsidian-style `> [!type]` callout blocks.
- `gatsby-remark-custom` — composite plugin: disables links to local files, supports image-control syntax (`mdastImageControl`), and injects parser plugins for `==mark==` (`remarkMark`) and Obsidian-style spoilers (`remarkSpoiler`).

Plugin order in `gatsby-config.js` matters — `gatsby-remark-callout` runs after `gatsby-remark-images` so the transformed image block is already inside the callout structure.

### Source layout

- `src/templates/` — `post.js`, `post-list.js`. Page templates created by `createPages`.
- `src/pages/` — file-routed pages: `about.js`, `friends.js`, `404.js`. `about.js` queries markdown files matching `/about\.en\.md$/` and `/about\.data\.md$/`.
- `src/components/` — MUI-based React components. `Layout` is in a subfolder; everything else is flat.
- `src/data/` — `metadata.js` (site metadata exposed via `siteMetadata`), `categories.js`, `navigators.js` (top-nav definition with route-matching `rule` functions).
- `src/utils/` — `nav.js` (sidebar nav parser), `category.js`, `toc.js`, plus storage/scroll/umami helpers.
- `src/style/` — Less stylesheets (loaded via `gatsby-plugin-less`).

### Tech stack notes

- Gatsby 5 + React 18 + MUI 6 + Emotion. KaTeX, PrismJS for math/code. `flexsearch` for client-side search. Comments via `@giscus/react`. Optional Umami analytics (currently commented out in `gatsby-config.js`).
- Static-folder plugin (`gatsby-plugin-static-folders`) copies `./assets`, `./content/assets`, and `./src/images` to the build output verbatim.

## Schema gotcha

`createSchemaCustomization` in `gatsby-node.js` defines `Frontmatter` and `Fields` with only a handful of fields. Other fields (`hide`, `description`, `cover`, etc.) come from **schema inference over actual content**. If the `content/` directory is empty or doesn't include posts that exercise a given frontmatter key, queries against that key fail with `GRAPHQL.VALIDATION Cannot query field "X" on type ...`. Either add the field to `createTypes` or ensure at least one markdown file has the field set.

## Commit message convention

Conventional Commits, lowercase throughout. Format: `<type>(<scope>): <subject>` — scope is optional. Types in use: `feat`, `fix`, `chore`, `refactor`, `style`. Examples from history:

- `fix(style): correct list bullet appearance`
- `feat(footer): redesign with responsive layout`
- `chore(ci): remove unused steps`
- `refactor: extract MetadataItem into separate file`

Release commits are the bare version number, e.g. `1.4.0`.

## Deployment

`.github/workflows/deploy.yml` builds on pushes to `master` (and via `repository_dispatch` from the content repo), then pushes `./public/` to two downstream static-hosting repos. There's also a commented-out SSH-deploy path via `appleboy/ssh-action` for self-hosting. `deploy.sh` is the equivalent script for that path. The `siteUrl` is read from `src/data/metadata.js`.
