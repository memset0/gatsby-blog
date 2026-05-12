## 1. Fix gatsby-node.js

- [x] 1.1 In `gatsby-node.js`, in the article-list-root `paginate()` call, change `prefixRegex: "^/posts/"` back to `prefixRegex: "^/"`. Keep `pathPrefix: "/posts"` (top-level) and `pathPrefix: "/posts/"` (context — used by the template for in-list link construction).
- [x] 1.2 Confirm no other `prefixRegex` in the file needs changing (category pages have their own `prefixRegex: "^${uri}/"` per category, which is correct).

## 2. Fix navigators.js

- [x] 2.1 In `src/data/navigators.js`, move the "首页" entry object (`to: "/"`) from index 0 to the last index, so the final order is: 所有文章, 算法竞赛, 课程笔记, 友情链接, 首页.

## 3. Verify locally

- [x] 3.1 `npm run clean && npm run build` completes.
- [x] 3.2 `public/posts/index.html` is the rendered article list (size jumps from "near-empty" back to a multi-card page).
- [x] 3.3 `public/posts/2/index.html` through `public/posts/7/index.html` exist (or however many pages the current post count produces).
- [x] 3.4 Grep `public/posts/index.html` for at least one known post title to confirm content is present.
- [x] 3.5 Start `npm run dev`; `curl http://localhost:8080/posts/` returns 200.

## 4. Wrap up

- [x] 4.1 Stage `gatsby-node.js`, `src/data/navigators.js`, and the change directory.
- [x] 4.2 Commit with `fix: restore /posts/ article list and nav order` (Conventional Commits per CLAUDE.md).
