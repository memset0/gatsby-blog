## Context

The site builds in GitHub Actions (`.github/workflows/deploy.yml`) and the resulting `public/` directory is pushed to two separate static-hosting repos: `memset0/blog-deployment` (the primary deployment) and `mem-static/blog-ng` (a secondary mirror). Both pushes are currently done by `cpina/github-action-push-to-another-repository@main`, whose maintainer has announced minimal-maintenance status.

There is no test suite, but the deploy is observable by checking either destination repo for a new commit on each push to this repo's `master`. The deployment commit history is the operational signal for "did the deploy land."

## Goals / Non-Goals

**Goals:**

- Replace the unmaintained action with a maintained equivalent that preserves all of the current pipeline's behavior.
- Keep the developer-visible inputs as close to the existing config as possible (same source dir, same destination repos, same branches, same commit author email).
- Re-use the existing `GH_TOKEN` secret; no new credential provisioning.
- Default to **incremental commits** on the destination repos so deploy history is preserved and a `git log` on the destination shows what changed when.

**Non-Goals:**

- Migrating to a server-side deploy (the commented-out `appleboy/ssh-action` block stays commented out).
- Adding new destination repos or changing branch names.
- Speccing the *contents* of the deployed `public/` directory — that's covered by other capabilities (`content-organization`, `post-visibility`, `external-homepage`). This change is only about how those contents get pushed.

## Decisions

**1. Use `peaceiris/actions-gh-pages@v4` over `JamesIves/github-pages-deploy-action@v4`.**

Both are well-maintained alternatives. The deciding factor is **default commit behavior**: peaceiris defaults to incremental commits (each deploy is a new commit on top of the existing branch), which matches the requirement exactly. JamesIves defaults to force-pushing the build output (rewriting the destination branch on each deploy) and offers incremental as an opt-in via flags. Defaulting to the desired behavior is safer than defaulting to the undesired behavior with an opt-in.

Secondary factors:
- peaceiris's configuration surface for "push static dir to external repo" is more direct (`external_repository`, `publish_branch`, `publish_dir`).
- JamesIves requires `persist-credentials: false` on the `actions/checkout` step to avoid auth conflicts. Our workflow uses `actions/checkout@v4` without that flag and we'd rather not add a per-action coupling.
- peaceiris does not require the destination branch to exist beforehand — it creates the branch if missing — which matches what `cpina` already does.

**2. Use `personal_token` (PAT) auth, not `deploy_key` or `github_token`.**

`personal_token` matches the current auth model: a fine-grained PAT stored as `secrets.GH_TOKEN` with `repo` scope on the destination repos. `github_token` does NOT work for external repositories (per peaceiris docs). `deploy_key` would require provisioning new SSH keys per destination repo, which is more bookkeeping for no benefit.

**3. Pin to `@v4`, not `@main`.**

Pinning to a major tag is a small reliability improvement: we get patches within v4 automatically but get notified (via deploy breakage) if the maintainer publishes a v5 with breaking changes. `cpina@main` floated against the action's `main` branch, which is part of why drift is a concern. We deliberately do not pin to a specific minor or SHA; v4 has been stable since April 2024 and peaceiris uses semver discipline.

**4. Leave the rest of the workflow alone.**

The two checkout steps (`content`, `homepage`), the Node setup, the npm cache, the npm install, the Gatsby build, and the cache restore steps are all unaffected. The change is scoped to the two `Push to the static repository` steps.

## Risks / Trade-offs

- **[First deploy after the swap shows a noisy diff]** → peaceiris and cpina may differ in which dotfiles, symlinks, or empty directories they include in the commit. The first post-change deploy on each destination could surface an unexpectedly large diff that's not really a content change. Mitigation: accept the one-shot diff; future deploys will only show real content changes.
- **[`GH_TOKEN` scope is wrong for peaceiris]** → cpina used the token via `env: API_TOKEN_GITHUB`; peaceiris uses it via `with: personal_token`. The token's permission requirements (repo write on the destination) are the same. If the existing token works today, it works after the swap. If it doesn't, both fail the same way (push rejected). Mitigation: monitor the next deploy run.
- **[Action input typos]** → peaceiris uses `publish_branch` while cpina uses `target-branch`; `publish_dir` vs. `source-directory`; `external_repository: "user/repo"` (combined string) vs. `destination-github-username` + `destination-repository-name` (two fields). Easy to fat-finger during the swap. Mitigation: verify against the action's documented examples; commit message should reference the destination repo+branch explicitly so reviewers can sanity-check.
- **[peaceiris/actions-gh-pages becomes unmaintained too]** → no immediate concern (last release was post-2024 and the project has 1,200+ commits). If it ever does, the same migration pattern applies again — that's the value of having a documented `deployment-pipeline` capability spec.

## Migration Plan

1. Update `.github/workflows/deploy.yml`: replace both push steps with `peaceiris/actions-gh-pages@v4` blocks.
2. Push this commit to this repo's `master`.
3. Watch the GitHub Actions run for the first post-change deploy. Confirm green.
4. Check `memset0/blog-deployment` — expect one new commit on `master` authored by `ci@memset0.cn`.
5. Check `mem-static/blog-ng` — expect one new commit on `main` authored by `ci@memset0.cn`.
6. Open the destination commits and skim the diff. A larger-than-usual first diff is expected (dotfile / symlink convention differences); subsequent deploys should be small.

**Rollback**: `git revert` the workflow commit. No data migration to undo.

## Open Questions

- Should the deploy commit message follow a template (e.g. include the source repo's commit SHA)? peaceiris's default `commit_message` is `"deploy: ${GITHUB_SHA}"`, which is already useful. Decision: stay with the default unless the author wants something custom.
- Should we eventually consolidate the two deploy steps into a matrix to reduce duplication? Not in this change — minimize scope.
