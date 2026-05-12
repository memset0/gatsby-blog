## Why

The top-nav entry that points to `/` currently displays as "首页" ("Home"). Since `/` now serves a standalone landing page that is itself an about-me destination, the more meaningful label is "关于博主" ("About the Blogger") — it tells visitors what's behind the link rather than describing the link as a navigation primitive. The author originally suggested this label in earlier rounds; finalize it now as a separate, scoped change so the spec record cleanly reflects the rename.

## What Changes

- `src/data/navigators.js`: change the last nav entry's `text` from `"首页"` to `"关于博主"`. URL, position, icon, and `rule` all stay the same.
- `openspec/specs/external-homepage/spec.md`: update both requirements that mention "首页" to use "关于博主" instead — and tighten the "/about/ not in nav" scenario so it can no longer be misread as "no entry labelled 关于博主" (after this change, such an entry exists, it just targets `/` instead of `/about/`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `external-homepage`: two requirements (`Homepage UI Is Decoupled From Blog Shell` and `Old About URL Hidden From Nav But Reachable`) have their nav-entry label updated from "首页" to "关于博主", and the "/about/ not in nav" scenario is reworded to disambiguate label-vs-URL.

## Impact

- **Files changed**: `src/data/navigators.js` (one string), plus the change directory.
- **Build/output**: rendered HTML on any blog page that includes the top nav will show "关于博主" instead of "首页" in the last nav slot. No other change.
- **Spec record**: two requirements get MODIFIED deltas; net spec content is approximately the same size (a few words swapped).
- **Risk**: trivial. Single-string change.
- **Rollback**: revert the commit.
