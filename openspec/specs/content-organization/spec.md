# Content Organization Specification

## Purpose

Defines how markdown files are mapped to URLs, grouped under a hierarchical category tree, and optionally promoted to "doc mode" (a docs-site presentation with a sidebar). The tree drives both URL structure and the set of generated category pages.

## Requirements

### Requirement: Slug Derived From File Path
The URL slug of a markdown post SHALL be derived from its filesystem path under `content/`, with `index.md` and the `.md` extension stripped. A `content/blog/foo/index.md` file SHALL receive the slug `/blog/foo/`.

#### Scenario: index.md file becomes folder slug
- **WHEN** the source file is `content/oi/algorithm/dp/index.md`
- **THEN** the post's slug is `/oi/algorithm/dp/`

#### Scenario: Non-index markdown keeps its basename
- **WHEN** the source file is `content/blog/foo.md`
- **THEN** the post's slug is `/blog/foo/`

### Requirement: Category Tree Drives URL Prefixes
Top-level keys in the category tree (`src/data/categories.js`) SHALL each define a URL prefix that becomes a category listing page. Children keys nest under their parent's prefix, recursively, producing a listing page at every depth.

#### Scenario: Nested category produces nested listing
- **WHEN** the tree contains `oi.children.algorithm`
- **THEN** the site generates listing pages at both `/oi/` and `/oi/algorithm/`

#### Scenario: Post belongs to all ancestor categories
- **WHEN** a post lives at `/oi/algorithm/dp/`
- **THEN** that post appears in both the `/oi/` and `/oi/algorithm/` listings

### Requirement: Doc Mode For Marked Categories
A category whose tree node sets `doc: true` SHALL be treated as a docs site. Every post whose slug starts with that category's URI SHALL have `isDoc` set, and its page SHALL receive `navJson` carrying a pre-computed sidebar navigation.

#### Scenario: course category renders as docs
- **WHEN** the tree has `course: { name: "课程笔记", doc: true }` and a post lives at `/course/foo/`
- **THEN** that post's page receives a sidebar nav from the nearest ancestor post with a `nav` frontmatter

#### Scenario: doc:true on a nested category
- **WHEN** the tree has `research.children.note.doc = true`
- **THEN** posts under `/research/note/` are doc posts, but posts under `/research/paper-reading/` are not

### Requirement: Sidebar Nav Sourced From Frontmatter
For doc-mode posts, the sidebar nav SHALL be assembled from the nearest ancestor markdown file whose frontmatter includes a `nav` array, by walking up the slug. The `nav` entries SHALL be resolved to `{slug, file, title}` triples, with `title` taken from each target file's `title` frontmatter (falling back to its basename).

#### Scenario: Nav inheritance across folders
- **WHEN** `/course/foo/index.md` has `nav: [intro.md, advanced/index.md]` and `/course/foo/intro.md` has no `nav`
- **THEN** `/course/foo/intro.md` inherits the sidebar from `/course/foo/index.md`

### Requirement: Static Folders Copied Verbatim
The build SHALL copy the contents of `./assets`, `./content/assets`, and `./src/images` into the output site root as-is, so URLs such as `/img.png` resolve regardless of which folder hosted the source file.

#### Scenario: Asset reachable by URL after build
- **WHEN** `content/assets/diagram.png` exists at build time
- **THEN** `https://<site>/diagram.png` serves that file
