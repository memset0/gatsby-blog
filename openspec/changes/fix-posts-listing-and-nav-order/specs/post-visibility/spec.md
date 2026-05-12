## MODIFIED Requirements

### Requirement: Article List Root Lists Published Posts Only
The article list root at `/posts/` SHALL list only posts that satisfy publish eligibility, sorted by ascending `createTime`, paginated 10 per page. The set of posts shown is filtered by `isPublished`, **not** by source-slug path — posts from every category (e.g. `/blog/`, `/oi/`, `/course/`, …) are eligible to appear, regardless of where their markdown file lives on disk. The site root `/` is reserved for a standalone landing page (see `external-homepage`) and does NOT list posts.

#### Scenario: Indexed-only post excluded from article list
- **WHEN** post A is published and post B is indexed-only
- **THEN** post A appears on `/posts/` and post B does not

#### Scenario: Site root does not list posts
- **WHEN** the user navigates to `/`
- **THEN** they see the standalone homepage (not a list of articles); the article list is available at `/posts/`

#### Scenario: Posts from any category appear in the article list
- **WHEN** the published posts live under various category slugs (e.g. `/blog/foo/`, `/oi/algorithm/bar/`, `/course/baz/`)
- **THEN** all of them appear in `/posts/`'s pagination — the listing is NOT restricted to posts whose source slug starts with `/posts/` (no posts have such a slug; `/posts/` is the listing URL, not a category prefix)
