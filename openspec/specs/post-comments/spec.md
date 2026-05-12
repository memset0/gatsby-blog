# Post Comments Specification

## Purpose

Defines how each post page hosts a discussion thread via Giscus (GitHub Discussions–backed comments), and how comments are partitioned per-post by slug. Comments live in a separate, dedicated GitHub repository rather than the blog's source repo.

## Requirements

### Requirement: Each Post Page Has Its Own Comment Thread
A post page SHALL embed a Giscus comments widget configured so that each post's thread is identified by the post's slug. Two posts with different slugs MUST have independent threads.

#### Scenario: Distinct threads per post
- **WHEN** post A has slug `/blog/foo/` and post B has slug `/blog/bar/`
- **THEN** comments left on A's page do not appear on B's page, and vice versa

### Requirement: Slug Term Has No Trailing Slash
The slug passed to Giscus as the discussion term SHALL be the post's slug with any trailing `/` stripped. This ensures the term is stable regardless of whether the slug is rendered with or without a trailing slash elsewhere.

#### Scenario: Trailing slash stripped
- **WHEN** the post slug is `/blog/foo/`
- **THEN** the Giscus widget is mounted with `term="/blog/foo"`

### Requirement: Comments Are Backed By An External Repository
Comments SHALL be stored as discussions in a dedicated GitHub repository (not the blog source repo). The mapping between blog post and discussion SHALL use Giscus's `specific` mapping with `strict: 1`, so a thread is created on first comment and discovered by exact term match thereafter.

#### Scenario: First comment creates a discussion
- **WHEN** a reader posts the first comment on a post whose slug has no existing discussion
- **THEN** Giscus creates a new discussion in the configured comments repo with the slug as its term

#### Scenario: Subsequent comments attach to the same discussion
- **WHEN** another reader posts a second comment on the same post
- **THEN** Giscus locates the existing discussion by term and appends the comment to it

### Requirement: About Page Has Its Own Comment Thread
The `/about` page SHALL embed a comments widget on the same Giscus configuration as posts, keyed by the literal term `/about`.

#### Scenario: About page comments
- **WHEN** the user is on `/about/` and posts a comment
- **THEN** the comment is stored under the `/about` thread
