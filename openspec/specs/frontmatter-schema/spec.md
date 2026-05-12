# Frontmatter Schema Specification

## Purpose

Defines the YAML frontmatter contract for markdown posts: which keys the site reads, which aliases are accepted, and how their values flow into the rendered site. Keys not listed here are ignored by the build (though Gatsby may still infer them into the GraphQL schema).

## Requirements

### Requirement: Title And Description Fields
A post SHALL declare its display title via the `title` frontmatter key. A post MAY declare a `description` used as the page's meta description; when absent, the post's auto-generated excerpt is used instead.

#### Scenario: Default description fallback
- **WHEN** a post has `title: Foo` and no `description`
- **THEN** the rendered `<meta name="description">` is filled from the post's excerpt

### Requirement: Date Field Aliases
The build SHALL accept any of `date`, `create`, `create-time`, `createTime`, `create-date`, `createDate` as the creation date and any of `update`, `update-time`, `updateTime`, `update-date`, `updateDate` as the update date. The last matching key in that fixed precedence order wins. When the update date is absent, it defaults to the creation date.

#### Scenario: Date alias precedence
- **WHEN** a post has both `date: 2024-01-01` and `createTime: 2024-02-01`
- **THEN** the post's `createTime` resolves to one of those values deterministically based on the documented alias order, and the same value is used everywhere creation date is referenced

#### Scenario: Update defaults to create
- **WHEN** a post has `date: 2024-01-01` and no update alias
- **THEN** `updateTime` equals `createTime`

### Requirement: Cover Image Resolution
A post MAY declare `cover` as either a path relative to `content/cover/` or an absolute `http://` / `https://` URL. The build SHALL resolve the value to a `File` node that templates can pass to `getImage`. Posts without a cover render without a cover image.

#### Scenario: Local cover path
- **WHEN** `cover: foo.png` and `content/cover/foo.png` exists
- **THEN** the post page renders with `content/cover/foo.png` as the cover

#### Scenario: Remote cover URL
- **WHEN** `cover: https://example.com/x.png`
- **THEN** the build downloads the remote image and uses it as the cover

### Requirement: Author And Authors Fields
A post MAY declare `author` (string) or `authors` (array of strings). The build SHALL flatten both into a single ordered list and preserve original order. Each entry MUST be a string under 100 characters; longer or non-string entries are silently dropped.

#### Scenario: Combined author and authors
- **WHEN** a post has `author: alice` and `authors: [bob, carol]`
- **THEN** the resolved author list is `[alice, bob, carol]`

### Requirement: Props Field Surfaces As propsJson
A post MAY declare a `props` mapping. Each key/value pair SHALL be converted to a `{key, value}` object and the array exposed as the `propsJson` field for templates to consume (typically used by the about page to render a timeline).

#### Scenario: props serialized for templates
- **WHEN** a post has `props: { timeline: [...] }`
- **THEN** that post's `fields.propsJson` is a JSON string `[{"key":"timeline","value":[...]}]`

### Requirement: CSS Classes Field
A post MAY declare `cssclasses` and/or `blog-cssclasses` as arrays of strings. The build SHALL concatenate them (in that order) into the post's `fields.cssclasses` for the renderer to apply to the article container.

#### Scenario: Combined cssclasses
- **WHEN** a post has `cssclasses: [a]` and `blog-cssclasses: [b]`
- **THEN** the rendered article container receives classes `a` and `b`

### Requirement: Excerpt Delimiter
A post MAY contain the literal HTML comment `<!-- more -->` to mark where its excerpt ends. The build SHALL treat the content before that marker as the post's excerpt.

#### Scenario: Excerpt cutoff
- **WHEN** a post body contains `Intro paragraph.\n\n<!-- more -->\n\nRest of post.`
- **THEN** the post's excerpt is `Intro paragraph.`
