## Context

When the `add-external-homepage` change introduced an external static landing page at `/`, the top-nav entry that linked there was labelled "首页" (Home). That label describes the *navigation primitive* — "this link leads home" — but doesn't tell the reader what's actually behind the link. After living with it briefly, the author wants "关于博主" (About the Blogger), which tells visitors the destination is a personal/about page. This is a one-string change in code and a couple of spec wording updates.

## Goals / Non-Goals

**Goals:**

- Rename the nav entry to a label that better describes the page at `/`.
- Update the spec so the label change is reflected in the long-lived record and so the "/about/ not in nav" scenario no longer reads as contradictory after rename (because an entry *labelled* "关于博主" does exist post-rename — it just points to `/`, not `/about/`).

**Non-Goals:**

- Changing the URL `/about/` resolves to (still 200s with the same content).
- Changing the position of the nav entry (still last).
- Adding any other labels or restructuring the nav.

## Decisions

**1. Use "关于博主", not "About me" or "关于".**

Rationale: the original (pre-add-external-homepage) label was "关于博主" pointing to `/about/`. After the redesign, the page is gone but the about-me intent persists at `/`. Matching the old label keeps muscle memory for returning visitors and matches the rest of the site's Chinese-language nav.

**2. Update spec scenarios for "/about/ not in nav" so they describe the URL target, not the label.**

Rationale: the current scenario says "THEN '关于博主' / 'About' is not listed". After this change, "关于博主" IS listed (with a different URL). Rewording to "no nav entry whose target is `/about/`" removes the ambiguity.

**3. Don't add a new requirement for the rename.**

Rationale: this is wording polish on existing requirements, not a new invariant. MODIFIED is the right delta type.

## Risks / Trade-offs

- **[Reader expects 关于博主 to lead to /about/]** → After this change, "关于博主" leads to `/` (the new homepage, which IS the about page). If anyone bookmarked `/about/`, that URL still resolves. The label is now about the *destination* (a page about the blogger), not the literal old `/about/` URL.
- **[Future readers of the spec see 关于博主 mentioned in two different contexts]** → The MODIFIED requirements remove the contradiction by being explicit about URL targets. The "/about/ not in nav" scenario is the most footgun-prone — that's the one we reword most carefully.

## Migration Plan

1. Edit `src/data/navigators.js`.
2. `npm run clean && npm run build`. Spot-check `public/posts/index.html`: the rendered top nav has "关于博主" in the last slot. (Nav is rendered into the static HTML at SSR time.)
3. Commit + push.

**Rollback**: revert.

## Open Questions

None.
