## MODIFIED Requirements

### Requirement: Old About URL Hidden From Nav But Reachable
The previously-promoted `/about/` page SHALL no longer appear in the top navigation. The page file (`src/pages/about.js`) SHALL remain so that the URL still returns 200 for any external deep links. This preserves backward compatibility while removing the page from the user-facing chrome (since the new site root is itself an about-me destination).

The "首页" navigation entry that points to `/` SHALL occupy the **last position** in the top navigation list — the same final position previously held by "关于博主". Subject-area entries (所有文章 / 算法竞赛 / 课程笔记 / 友情链接) come first; the personal/home entry comes last.

#### Scenario: /about/ still resolves
- **WHEN** an external link points to `/about/` and is followed
- **THEN** the page renders normally (no 404)

#### Scenario: /about/ not in nav
- **WHEN** a reader views any blog page's top nav
- **THEN** "关于博主" / "About" is not listed

#### Scenario: 首页 entry is at the bottom
- **WHEN** a reader views any blog page's top nav
- **THEN** the entries appear in the order: 所有文章 (`/posts/`), 算法竞赛 (`/oi/`), 课程笔记 (`/course/`), 友情链接 (`/friends/`), 首页 (`/`) — with 首页 in the last position
