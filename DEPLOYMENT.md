# Deployment to GitHub Pages

This repository is set up to deploy the built Vite app to GitHub Pages at:

https://deadronos.github.io/northpole-mail

## Workflow

A GitHub Actions workflow is included at `.github/workflows/deploy-gh-pages.yml`.

High level:
- `build` job: installs deps, runs `npm run build` with `VITE_BASE=/northpole-mail/`, then uploads `./dist` as a Pages artifact (via `actions/upload-pages-artifact`).
- `deploy` job: uses `actions/deploy-pages@v4` to deploy the artifact to GitHub Pages (permissions: `pages: write`, `id-token: write`).

Actions used (pinned to major supported versions):
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/cache@v4`
- `actions/upload-pages-artifact@v4`
- `actions/deploy-pages@v4`

This follows GitHub's recommended Pages deployment approach (upload artifact + deploy).

## Vite base path

To ensure assets are served correctly from the repo subpath, `vite.config.ts` uses the `VITE_BASE` environment variable when present, otherwise it sets the base to `/northpole-mail/` for production builds.

If you prefer a different base path or want to test locally with production base, set the `VITE_BASE` env var before running `npm run build`.

Example (locally, PowerShell):

```powershell
$env:VITE_BASE='/northpole-mail/'; npm run build
```

## First deployment notes

- The workflow runs when a tag matching `v*` (for example `v1.2.3`) is pushed. You can create and push a tag locally with:

```bash
git tag v1.2.3
git push --tags
```

- In some cases the first deployment may require adjusting repository Pages settings or repository token permissions; if the workflow fails with authorization errors, check your repository `Settings → Pages` or add `pages: write` in workflow permissions.

## Alternatives

- `peaceiris/actions-gh-pages` is a widely used alternative to push a `gh-pages` branch directly. The repository includes examples and options if you prefer that approach.

---

If you'd like, I can open a PR with these changes now and include a short checklist for repo admins (e.g., enable Pages via the repo settings / CNAME).