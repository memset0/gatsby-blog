# Author Attribution Specification

## Purpose

Defines how a post's declared authors are cross-referenced against the site's friends list (`content/friends.yml`) so that posts can display rich author info (avatar, bio, link) without duplicating that data inside each post. Also covers what happens when an author is not in the friends list.

## Requirements

### Requirement: Friends List Schema
The friends list at `content/friends.yml` SHALL be a YAML sequence where each entry MUST have a `name` and MAY have any of `link`, `bio`, `avatar` (local File reference), `avatarUrl` (remote image URL), and `hide` (boolean). At least one of `avatar` or `avatarUrl` SHALL be provided for entries that should display an avatar.

#### Scenario: Friend with avatar URL
- **WHEN** `friends.yml` contains `{ name: alice, link: https://a.example, avatarUrl: https://img/a.png }`
- **THEN** the build downloads `https://img/a.png` and attaches it as alice's `avatar` File node

### Requirement: Friends Page Source
The `/friends/` page SHALL be rendered from the friends list, excluding entries where `hide: true`. Order in the page SHALL match order in `friends.yml`.

#### Scenario: Hidden friend excluded
- **WHEN** `friends.yml` lists `[alice, {name: bob, hide: true}, carol]`
- **THEN** `/friends/` shows `alice` then `carol`, and does not show `bob`

### Requirement: Post Authors Linked To Friends By Name
A post's resolved authors (see frontmatter spec) SHALL be linked to friend records by case-insensitive `name` match. A matched author SHALL display the friend's avatar, bio, and link. An unmatched author SHALL display the bare name with no avatar or link.

#### Scenario: Matched author
- **WHEN** a post lists `author: Alice` and `friends.yml` has an entry with `name: alice`
- **THEN** the post page renders that author using the alice friend record (avatar, bio, link)

#### Scenario: Unmatched author
- **WHEN** a post lists `author: Eve` and no friends entry has `name` equal to `Eve` (case-insensitive)
- **THEN** the post page renders an author entry with just the name `Eve` and no avatar or link

### Requirement: Author Order Preserved
The order in which authors are listed on a post page SHALL match the order they appear in the post's frontmatter (after flattening `author` and `authors`).

#### Scenario: Order across author and authors
- **WHEN** a post has `author: alice` and `authors: [carol, bob]`
- **THEN** the rendered author list is `alice, carol, bob` in that order
