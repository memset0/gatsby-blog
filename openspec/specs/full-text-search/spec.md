# Full-Text Search Specification

## Purpose

Defines the in-browser search experience: which posts are searchable, what fields participate in the index, and what the search UI shows the user. Search runs entirely client-side against an index pre-built at compile time — there is no server roundtrip.

## Requirements

### Requirement: Search Index Covers Published Posts Only
The site SHALL build its search index from posts whose `fields.isPublished` is `true`. Indexed-only and hidden posts MUST NOT appear in search results, even though indexed-only posts are listed on category pages.

#### Scenario: Indexed-only post is not searchable
- **WHEN** post A is published and post B is indexed-only
- **THEN** searching for a phrase that appears in both posts returns only post A

#### Scenario: Hidden post is not searchable
- **WHEN** a post has `hide: true`
- **THEN** the post does not appear in search results regardless of its other frontmatter

### Requirement: Search Operates Over Title And Body Text
The search index SHALL include, for each searchable post, at least its `publishedTitle` and `plainText` (the raw markdown source as a single string). A query SHALL match against both fields, and a match in either field is sufficient to surface the post.

#### Scenario: Title-only match
- **WHEN** the user searches for a word that appears in a post's title but not its body
- **THEN** that post appears in results

#### Scenario: Body-only match
- **WHEN** the user searches for a phrase that appears only in a post's body
- **THEN** that post appears in results

### Requirement: Result Item Links To Post
Each search result SHALL display the post's `publishedTitle` and SHALL navigate to the post's slug when the user activates it.

#### Scenario: Result navigation
- **WHEN** the user clicks a result whose post slug is `/oi/foo/`
- **THEN** the browser navigates to `/oi/foo/`

### Requirement: Search UI Loads Index Lazily
The full search index MAY be sizable, so the UI SHALL show a loading state until the index is ready, and accept queries only after loading completes. The user MUST be able to open the search dialog before the index is ready without errors.

#### Scenario: Open dialog while index loads
- **WHEN** the user opens the search dialog before the index finishes loading
- **THEN** the dialog displays a loading indicator and accepts typing, but no results are returned until the index is ready
