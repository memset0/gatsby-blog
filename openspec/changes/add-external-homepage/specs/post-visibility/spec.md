## MODIFIED Requirements

### Requirement: Article List Root Lists Published Posts Only
The article list root at `/posts/` SHALL list only posts that satisfy publish eligibility, sorted by ascending `createTime`, paginated 10 per page. The site root `/` is reserved for a standalone landing page (see `external-homepage`) and does NOT list posts.

#### Scenario: Indexed-only post excluded from article list
- **WHEN** post A is published and post B is indexed-only
- **THEN** post A appears on `/posts/` and post B does not

#### Scenario: Site root does not list posts
- **WHEN** the user navigates to `/`
- **THEN** they see the standalone homepage (not a list of articles); the article list is available at `/posts/`
