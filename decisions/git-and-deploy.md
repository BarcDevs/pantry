# Decisions — Git & Deploy

⚠️ Load only when following a link from [[decisions/index]] for a specific entry, or scanning for
a lesson in this topic — not routinely.

---

## 18/09/2026 — `main` is the trunk; no `dev` branch until the app is published (scope:workflow)

**Problem:** `dev` was the trunk (origin's default) and `main` a separately-synced mirror. With one
user and no published app, that meant two long-lived branches to keep in sync (they had drifted:
`main` ended up ahead of `dev`) for no benefit.

**Decision:** `main` is the only trunk and the GitHub default branch. Work on feature branches,
merge locally, push to `main`. CI runs on PRs and pushes to `main`. Vercel production deploys from
`main`. Introduce a `dev`/staging branch only once the app is published and there is something to
protect.

**How to apply:** see `GIT_RULES.md`. Don't recreate `dev` without a new decision entry.
