## MODIFIED Requirements

### Requirement: Homepage UI Is Decoupled From Blog Shell
The external homepage SHALL render independently of the Gatsby/MUI shell — it provides its own CSS, scripts, and structure, and does NOT see the blog's top navigation. Reciprocally, the blog's top navigation SHALL include a "关于博主" entry pointing to `/` as a hard navigation (a non-SPA full-page load that leaves the Gatsby app).

#### Scenario: Hard navigation to homepage
- **WHEN** a reader on `/posts/` clicks the "关于博主" nav item
- **THEN** the browser performs a full page load to `/` and the user lands on the standalone homepage with no blog chrome

#### Scenario: Homepage does not render blog nav
- **WHEN** a visitor lands on `/` from an external link
- **THEN** they see only the homepage's own design (lavender academic style); no MUI app bar, no blog navigators are injected

### Requirement: Old About URL Hidden From Nav But Reachable
The previously-promoted `/about/` page SHALL no longer appear in the top navigation. The page file (`src/pages/about.js`) SHALL remain so that the URL still returns 200 for any external deep links. This preserves backward compatibility while removing the page from the user-facing chrome (since the new site root is itself an about-me destination).

The "关于博主" navigation entry that points to `/` SHALL occupy the **last position** in the top navigation list — the same final slot the about-page entry held before the homepage redesign. Subject-area entries (所有文章 / 算法竞赛 / 课程笔记 / 友情链接) come first; the personal/home entry comes last.

#### Scenario: /about/ still resolves
- **WHEN** an external link points to `/about/` and is followed
- **THEN** the page renders normally (no 404)

#### Scenario: No nav entry targets /about/
- **WHEN** a reader views any blog page's top nav
- **THEN** none of the rendered nav entries have `/about/` as their target URL; the "关于博主"-labelled entry that does exist points to `/`, not to `/about/`

#### Scenario: 关于博主 entry is at the bottom
- **WHEN** a reader views any blog page's top nav
- **THEN** the entries appear in the order: 所有文章 (`/posts/`), 算法竞赛 (`/oi/`), 课程笔记 (`/course/`), 友情链接 (`/friends/`), 关于博主 (`/`) — with 关于博主 in the last position
