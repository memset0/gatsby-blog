# Post Visibility Specification

## Purpose

Defines the visibility model that decides whether a markdown post appears on the homepage, in category listings, on its own URL, or nowhere. The blog uses a three-state model (published / indexed-only / hidden) computed from frontmatter, so a single source file can be in any of those states without renaming, moving, or deleting it.
## Requirements
### Requirement: Publish Eligibility
A post SHALL be treated as **published** if and only if all of the following hold against its frontmatter:

- a publish trigger is present — either `publish: true` or any of the publish-title aliases (`publish-title`, `publishTitle`, `published-title`, `publishedTitle`) is set; AND
- a creation date is present in any of `date`, `create`, `create-time`, `createTime`, `create-date`, `createDate`; AND
- `hide` is absent or falsy.

#### Scenario: Frontmatter with publish flag and date
- **WHEN** a post declares `publish: true` and `date: 2024-01-01`
- **THEN** the post is published, appears on the homepage list, in any category listing it belongs to, and at its own URL

#### Scenario: Publish-title alias treated as publish trigger
- **WHEN** a post declares `publishTitle: "Public name"` and `createTime: 2024-01-01` but no `publish` key
- **THEN** the post is published, and its `publishedTitle` field is set to `"Public name"`

#### Scenario: Missing creation date suppresses publication
- **WHEN** a post declares `publish: true` but has no date in any accepted alias
- **THEN** the post is not published and not indexed, even if a publish trigger is present

#### Scenario: Hide overrides publish
- **WHEN** a post declares `publish: true`, `date: 2024-01-01`, and `hide: true`
- **THEN** the post is not published and no page is generated at its URL

### Requirement: Indexed-Only Posts
A post that is not published SHALL still be treated as **indexed** if its frontmatter sets `indexed: true`. Indexed posts appear in category listings but not on the homepage. Indexed posts also expose a `publishedTitle` field, defaulting to `title` when no publish-title alias is set.

#### Scenario: Indexed without publish flag
- **WHEN** a post declares `indexed: true` and `date: 2024-01-01` but no `publish` key
- **THEN** the post does not appear on the homepage, but does appear in listings of any category it belongs to

#### Scenario: Indexed implied by publish
- **WHEN** a post is published
- **THEN** it is also indexed; setting `indexed: true` is redundant in that case

### Requirement: Hidden Posts Generate No Page
A post whose frontmatter has `hide: true` SHALL not produce a rendered page at its slug. This is independent of `publish` or `indexed` — `hide` always wins.

#### Scenario: Hide blocks page generation
- **WHEN** a post has `hide: true`
- **THEN** navigating to its slug returns 404

### Requirement: Category Pages List Indexed Posts
A category listing page SHALL include every post whose slug is under that category's URI and whose visibility is at least `indexed` (published OR indexed-only).

#### Scenario: Indexed post appears under its category
- **WHEN** an indexed-only post lives under `/oi/algorithm/`
- **THEN** that post appears in the `/oi/` listing and in the `/oi/algorithm/` listing

### Requirement: Previous/Next Navigation Skips Unpublished Posts
On a published post's page, the previous/next post links SHALL refer to the nearest published posts by `createTime`, skipping over any indexed-only or hidden posts.

#### Scenario: Skip over indexed-only neighbor
- **WHEN** the post timeline by date is `[A:published, B:indexed-only, C:published]`
- **THEN** A's "next" link points to C, and C's "previous" link points to A

#### Scenario: No prev/next on indexed-only post page
- **WHEN** an indexed-only post's page is rendered (allowed because `hide` is false)
- **THEN** the page does not compute or render prev/next links, since prev/next is only populated for published posts

### Requirement: Article List Root Lists Published Posts Only
The article list root at `/posts/` SHALL list only posts that satisfy publish eligibility, sorted by ascending `createTime`, paginated 10 per page. The site root `/` is reserved for a standalone landing page (see `external-homepage`) and does NOT list posts.

#### Scenario: Indexed-only post excluded from article list
- **WHEN** post A is published and post B is indexed-only
- **THEN** post A appears on `/posts/` and post B does not

#### Scenario: Site root does not list posts
- **WHEN** the user navigates to `/`
- **THEN** they see the standalone homepage (not a list of articles); the article list is available at `/posts/`

