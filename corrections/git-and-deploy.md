# Corrections — Git & Deploy

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic — not routinely.

---

## 19/09/2026 — Never commit or push directly to `main`; never push unless told to

**What was wrong:** after two commits, Claude ran `git push` unprompted (it failed on a missing
upstream). Later, "merge to main and push" was read as just "push": Claude was already on `main`
(the commits had been made there), saw nothing to merge, and pushed straight to `origin/main`
without a branch or PR and without saying the commits were on `main`. User: "Wait you pushed
directly to main?"

**Correct fact:** "commit" never means "push". "Merge to main" means an actual merge from a
feature/fix branch, not committing on `main` and pushing it.

**Lesson:** never commit directly to `main` — check `git branch --show-current` before every
commit and create/switch to a feature/fix branch first. Never push (any branch) unless explicitly
told to. Before pushing or merging, state the current branch and what will go where, and if the
plan differs from what was asked (e.g. nothing to merge because you're already on `main`), stop
and ask instead of picking the closest action.
