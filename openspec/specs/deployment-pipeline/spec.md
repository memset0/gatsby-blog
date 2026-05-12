# deployment-pipeline Specification

## Purpose
TBD - created by archiving change replace-deploy-push-action. Update Purpose after archive.
## Requirements
### Requirement: Built Site Pushed To External Static-Hosting Repos
On every push to this repo's `master` branch, the CI workflow SHALL build the site to `./public/` and push that directory's contents to a fixed set of external static-hosting GitHub repositories. The push happens after the build completes successfully; a failed build SHALL NOT trigger any push.

#### Scenario: Push to primary deployment repo
- **WHEN** a push to `master` builds successfully
- **THEN** the contents of `./public/` are pushed to `memset0/blog-deployment` on branch `master`

#### Scenario: Push to mirror deployment repo
- **WHEN** a push to `master` builds successfully
- **THEN** the contents of `./public/` are pushed to `mem-static/blog-ng` on branch `main`

#### Scenario: Failed build does not deploy
- **WHEN** the Gatsby build step fails
- **THEN** neither destination repo receives a new commit

### Requirement: Deploys Are Incremental Commits
Each successful deploy SHALL appear on the destination repo as a normal commit on top of the existing branch — preserving the deployment branch's commit history. The pipeline MUST NOT force-push or orphan-rewrite the destination branch on routine deploys.

#### Scenario: Destination branch history grows linearly
- **WHEN** N successive successful deploys complete
- **THEN** the destination branch has N additional commits compared to before, and all prior commits remain reachable on that branch

#### Scenario: Diff visible in destination commit
- **WHEN** a deploy lands and only one source post was edited
- **THEN** the destination commit's diff shows only the files that actually changed in `public/` (not a full-tree rewrite)

### Requirement: Deploy Authenticates Via Existing PAT Secret
The push step SHALL authenticate using the personal access token stored in `secrets.GH_TOKEN`. The CI workflow MUST NOT require any additional secret or environment variable to be provisioned for the deploy step beyond `GH_TOKEN` (which is already configured at the org level for cross-repo access).

#### Scenario: Same secret for both destinations
- **WHEN** the workflow pushes to both `memset0/blog-deployment` and `mem-static/blog-ng`
- **THEN** both steps use `secrets.GH_TOKEN` — no separate per-destination credentials are required

#### Scenario: Token has required scope
- **WHEN** `secrets.GH_TOKEN` is configured with `repo` scope including the destination repositories
- **THEN** both push steps succeed; if the scope is insufficient, both push steps fail with an authentication error (no silent partial deploy)

### Requirement: Deploy Author Identity Is Stable
Every deploy commit SHALL be authored by a stable identity (`ci@memset0.cn`) regardless of which human's push triggered the workflow. The deploy commit's author email MUST NOT be derived from the GitHub actor that triggered the run.

#### Scenario: Identical author on every deploy
- **WHEN** any number of deploys complete, triggered by any GitHub actors
- **THEN** every resulting commit on either destination repo is authored by `ci@memset0.cn`

### Requirement: Deploy Uses A Maintained Third-Party Action
The push step SHALL use a third-party GitHub Action that is actively maintained (recent releases within the past 12 months, responsive issue tracker). The action SHALL be pinned to a major-version tag (not `@main` / `@master` / a SHA). If the chosen action becomes unmaintained, the deploy capability SHALL be re-validated against a maintained alternative in a follow-up change.

#### Scenario: Action pinned to major tag
- **WHEN** the workflow file is inspected
- **THEN** the deploy action reference matches `<owner>/<repo>@v<major>`, not `<owner>/<repo>@main` or `@master`

#### Scenario: Maintenance regression triggers re-evaluation
- **WHEN** the chosen action's upstream announces minimal-maintenance status, OR more than 12 months pass with no release
- **THEN** a follow-up change SHALL be proposed to swap to a maintained alternative

