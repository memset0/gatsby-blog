## REMOVED Requirements

### Requirement: Homepage Lists Published Posts Only
**Reason**: The site root `/` no longer lists posts — it is taken over by an external standalone homepage (see `external-homepage`). This requirement is replaced by `Article List Root Lists Published Posts Only` below, which talks about `/posts/` instead of `/`.
**Migration**: Behavior is preserved on the same set of post nodes; the URL that hosts the list changes from `/` to `/posts/`. Inbound links to `/` no longer reach the article list. Pagination at `/page/N/` no longer exists — equivalent pages are now at `/posts/N/`.

## ADDED Requirements

### Requirement: Article List Root Lists Published Posts Only
The article list root at `/posts/` SHALL list only posts that satisfy publish eligibility, sorted by ascending `createTime`, paginated 10 per page. The site root `/` is reserved for a standalone landing page (see `external-homepage`) and does NOT list posts.

#### Scenario: Indexed-only post excluded from article list
- **WHEN** post A is published and post B is indexed-only
- **THEN** post A appears on `/posts/` and post B does not

#### Scenario: Site root does not list posts
- **WHEN** the user navigates to `/`
- **THEN** they see the standalone homepage (not a list of articles); the article list is available at `/posts/`
