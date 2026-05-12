# Markdown Extensions Specification

## Purpose

Defines the non-standard markdown syntax this blog supports beyond GitHub-Flavored Markdown. Authors write posts in Obsidian; this spec captures which Obsidian-flavored extensions are honored at build time, plus a few blog-specific affordances (image sizing via alt text, disabling links that only work inside the author's editor).

## Requirements

### Requirement: Obsidian-Style Callouts
A blockquote whose first line starts with `[!type]` SHALL render as a callout block of that type. A trailing `-` (e.g. `[!note]-`) SHALL render the callout as collapsed by default; without the dash, it SHALL render expanded. When the line after `[!type]` is empty, the callout title SHALL default to the type name, capitalized.

#### Scenario: Expanded callout with explicit title
- **WHEN** the source contains
  ```
  > [!note] My Title
  > body text
  ```
- **THEN** the rendered output is an open `<details class="callout callout-type-note">` whose summary text is `My Title` and whose body contains `body text`

#### Scenario: Collapsed callout default title
- **WHEN** the source contains
  ```
  > [!warning]-
  > be careful
  ```
- **THEN** the rendered output is a closed `<details class="callout callout-type-warning">` whose summary text is `Warning`

### Requirement: Highlight Syntax
The inline marker `==text==` SHALL render as `<mark class="m-mark">text</mark>`. Whitespace between the markers and the content is allowed and trimmed. The marker MUST NOT span across line endings.

#### Scenario: Inline highlight
- **WHEN** the source contains `this is ==important== now`
- **THEN** the rendered HTML contains `<mark class="m-mark">important</mark>`

### Requirement: Spoiler Syntax
The inline marker `!!text!!` SHALL render as a spoiler element whose contents are hidden until the reader reveals them. The marker MUST NOT span across line endings.

#### Scenario: Inline spoiler
- **WHEN** the source contains `the ending: !!they all die!!`
- **THEN** the rendered HTML wraps `they all die` in a spoiler element

### Requirement: Image Size Control Via Alt Text
The image syntax `![alt|pattern](url)` SHALL split the alt text on `|` and use the right-hand `pattern` to set the image's width. The pattern grammar:

- `sm`, `md`, `lg`, `xl` map to widths `300px`, `450px`, `600px`, `768px` respectively
- A bare number maps to `<n>px`
- A token ending in `em` is used verbatim as the width
- Multiple tokens separated by `;` are concatenated as additional CSS declarations
- An alt text consisting only of a number SHALL be treated as the pattern (no alt) — i.e. `![300](url)` sets width to 300px and uses no alt

When `alt` is non-empty and does not end in a common image extension (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`), a sibling `<span class="image-alt">alt</span>` SHALL be emitted after the image as a caption.

#### Scenario: Named size token
- **WHEN** the source contains `![diagram|md](foo.png)`
- **THEN** the rendered HTML is `<img src="foo.png" alt="diagram" style="width: 450px; "><span class="image-alt">diagram</span>`

#### Scenario: Numeric size token only
- **WHEN** the source contains `![300](foo.png)`
- **THEN** the rendered HTML is `<img src="foo.png" alt="" style="width: 300px; ">` with no caption span

#### Scenario: Alt looks like a filename
- **WHEN** the source contains `![cover.png|sm](foo.png)`
- **THEN** the rendered HTML omits the caption span (because `cover.png` ends in `.png`)

### Requirement: Disable Editor-Only Links
Links whose URL begins with `file://`, `zotero://`, or `obsidian://` SHALL be rendered as inert `<span class="m-disabled-link">` containing the link's display text, with no `href`. This prevents posts authored in Obsidian/Zotero from emitting links that 404 in a browser.

#### Scenario: file:// link disabled
- **WHEN** the source contains `[my notes](file:///Users/x/notes.md)`
- **THEN** the rendered HTML is `<span class="m-disabled-link">my notes</span>` with no `<a>` tag

#### Scenario: External http link unchanged
- **WHEN** the source contains `[example](https://example.com)`
- **THEN** the rendered HTML is `<a href="https://example.com">example</a>`

### Requirement: Math And Code Blocks
Math expressions in `$...$` / `$$...$$` SHALL be rendered server-side via KaTeX. Fenced code blocks with a recognized language tag SHALL be syntax-highlighted via PrismJS.

#### Scenario: Inline math
- **WHEN** the source contains `the value is $x^2 + 1$`
- **THEN** the rendered HTML contains a KaTeX-rendered span for the expression

#### Scenario: Highlighted code block
- **WHEN** the source contains a fenced code block tagged `javascript`
- **THEN** the rendered HTML contains a Prism-classed `<pre>` block with token spans

### Requirement: Heading Anchors
Each `<h1>`–`<h6>` rendered from markdown SHALL have a stable `id` derived from its text, suitable for use as an in-page anchor link.

#### Scenario: Header gets an id
- **WHEN** the source contains `## My Section`
- **THEN** the rendered HTML emits `<h2 id="my-section">My Section</h2>` (or equivalent) so `#my-section` scrolls to it
