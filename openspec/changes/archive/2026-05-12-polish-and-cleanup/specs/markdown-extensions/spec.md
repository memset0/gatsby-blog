## MODIFIED Requirements

### Requirement: Obsidian-Style Callouts
A blockquote whose first line starts with `[!type]` SHALL render as a callout block of that type. A trailing `-` (e.g. `[!note]-`) SHALL render the callout as collapsed by default; without the dash, it SHALL render expanded. When the line after `[!type]` is empty, the callout title SHALL default to the type name, capitalized.

If a callout-shaped blockquote has a malformed internal structure that the converter cannot interpret (e.g. unexpected child node shapes from upstream remark plugins, or partial markdown that didn't fully tokenize), the plugin SHALL leave the blockquote unchanged rather than crashing the build. The remaining markdown content SHALL render normally.

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

#### Scenario: Malformed callout does not crash the build
- **WHEN** the source contains a blockquote that begins with `[!` but has a malformed internal structure (for example, an empty children list or an unexpected child node type produced by an upstream remark transform)
- **THEN** the build completes successfully, the offending blockquote renders as a plain blockquote (no callout transformation applied), and the remainder of the document renders normally
