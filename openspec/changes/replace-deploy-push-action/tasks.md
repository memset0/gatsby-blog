## 1. Edit the workflow

- [x] 1.1 In `.github/workflows/deploy.yml`, replaced `Push to the static repository (1)` with `peaceiris/actions-gh-pages@v4` (`personal_token: secrets.GH_TOKEN`, `external_repository: memset0/blog-deployment`, `publish_branch: master`, `publish_dir: ./public`, `user_name: mem-ci-bot`, `user_email: ci@memset0.cn`).
- [x] 1.2 Replaced `Push to the static repository (2)` with the same shape but `external_repository: mem-static/blog-ng` and `publish_branch: main`.
- [x] 1.3 Confirmed no other step references `cpina/github-action-push-to-another-repository` or `API_TOKEN_GITHUB`.

## 2. Verify locally that the YAML is valid

- [x] 2.1 `python3 -c 'import yaml; yaml.safe_load(open(".github/workflows/deploy.yml"))'` parses cleanly; build job has 12 steps.
- [x] 2.2 Diff against `master`: only the two push step blocks changed.

## 3. Validate the OpenSpec change

- [x] 3.1 `openspec validate replace-deploy-push-action --strict` passes.
- [x] 3.2 `openspec status --change replace-deploy-push-action` shows 4/4 artifacts complete.

## 4. Deploy and observe

- [ ] 4.1 Commit and push to `master`. CI runs.
- [ ] 4.2 Watch the GitHub Actions run; both push steps must succeed (green).
- [ ] 4.3 Check `memset0/blog-deployment` for a new commit on `master` authored by `ci@memset0.cn`. Open the commit and skim the diff.
- [ ] 4.4 Check `mem-static/blog-ng` for a new commit on `main` authored by `ci@memset0.cn`. Open the commit and skim the diff.
- [ ] 4.5 If the first post-change diff is large (more than just the actual content delta), note it but accept it as a one-shot artifact of switching tools — confirm subsequent deploys produce small, focused diffs.

## 5. Wrap up

- [x] 5.1 Stage `.github/workflows/deploy.yml` and the change directory.
- [x] 5.2 Commit with a Conventional Commits message such as `chore(ci): switch deploy push to peaceiris/actions-gh-pages` (per CLAUDE.md conventions).
