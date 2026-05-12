## 1. Code change

- [x] 1.1 In `src/data/navigators.js`, change the `text` field of the last nav entry (the one with `to: "/"`) from `"首页"` to `"关于博主"`. Leave everything else (icon, URL, `rule`, position) unchanged.

## 2. Verification

- [x] 2.1 `npm run clean && npm run build` succeeds.
- [x] 2.2 Grep `public/posts/index.html` (or any page that includes the top nav) for `关于博主`; confirm the string appears in the rendered nav and `首页` no longer appears as a nav label.

## 3. Wrap up

- [x] 3.1 Stage `src/data/navigators.js` and the change directory.
- [x] 3.2 Commit with `fix: relabel home nav entry to 关于博主` (Conventional Commits per CLAUDE.md).
