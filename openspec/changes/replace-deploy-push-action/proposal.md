## Why

The deploy workflow currently uses `cpina/github-action-push-to-another-repository@main` to push the built site to two downstream static-hosting repos. The maintainer of that action has explicitly stated it is **no longer actively maintained** ("I plan to fix issues if they arise due to changes on GitHub, to minimise disruption of existing usage"). The author has reported encountering small issues already, and the open-issue backlog (~19) suggests further drift. Continuing to depend on it is increasingly risky — the next breaking GitHub Actions runtime change could leave the deploy pipeline broken with no upstream fix coming.

The replacement must (per user requirements):
- Push the built site to an external GitHub repo (different from this one).
- Produce an **incremental commit** showing the diff against the previous deploy — not a force-push or full-history wipe.
- Re-use the existing `GH_TOKEN` secret that is already configured in the org's GitHub secrets, with no new credential provisioning.

## What Changes

- Replace both `Push to the static repository (1)` and `Push to the static repository (2)` steps in `.github/workflows/deploy.yml` with `peaceiris/actions-gh-pages@v4`.
- Use `personal_token: ${{ secrets.GH_TOKEN }}` for auth (same secret name as today).
- Use `external_repository: memset0/blog-deployment` and `external_repository: mem-static/blog-ng` for the two destinations (same target repos as today).
- Use `publish_branch: master` and `publish_branch: main` (preserving each destination's current default branch name).
- Use `publish_dir: ./public` (same source dir as today).
- Preserve the deploy commit author email `ci@memset0.cn` via `user_email` (and add a `user_name` for the author display).
- Rely on the action's **default incremental commit behavior** — do NOT enable `force_orphan` (which would wipe history).

## Capabilities

### New Capabilities

- `deployment-pipeline`: Formalizes the previously-undocumented deployment behavior — what the build pushes to, how authentication works, what the commit shape on the destination repos looks like. Establishing this as an explicit capability lets future workflow changes reason against a documented baseline instead of "however the action currently behaves."

### Modified Capabilities

None against existing user-facing specs.

## Impact

- **Files changed**: `.github/workflows/deploy.yml` only. ~16 lines replaced with ~22 lines (the new YAML is slightly more verbose because peaceiris uses `with:` keys instead of `env:` for auth).
- **Secrets**: unchanged. `GH_TOKEN` continues to be used; no new secret provisioning.
- **Destination repos**: unchanged. `memset0/blog-deployment` (branch `master`) and `mem-static/blog-ng` (branch `main`) keep receiving the built `public/` directory.
- **Commit history on destinations**: preserved (was already incremental under `cpina`; remains incremental under `peaceiris`).
- **Risk**: low. First post-change deploy may show a noisy diff if `peaceiris` and `cpina` differ in which dotfiles or symlinks they include — that's a one-shot artifact, not an ongoing concern.
- **Rollback**: revert the single commit. Same workflow file, no infra to undo.
