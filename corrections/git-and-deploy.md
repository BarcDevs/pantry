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

---

## 19/09/2026 — Land the feature commit before the refactor commit

**What was wrong:** the refresh button was built and centralized into one hook in a single working
tree, so a single commit would have mixed the new feature with the refactor. User: "commit it first
so the centralisation would be a separate commit".

**Correct fact:** a feature and the refactor that tidies it are separate commits, feature first
(`feat`), refactor second (`rfc`), each passing lint, typecheck and tests on its own.

**Lesson:** if a refactor grows out of a feature, rebuild the plain feature state, commit it, then
apply the refactor on top and commit that. Back up the finished tree first so nothing is lost while
rebuilding the intermediate state.

---

## 26/09/2026 - Every separate piece of work gets its own branch

A whole rfc series was done on whatever branch was checked out (an upgrade branch) without creating a branch for it; another session then merged unrelated work into that branch, mixing the two. User: "u shoul've done it by yourself. a separate branch for every separate work needed."

**Lesson:** at the start of any new piece of work, check `git branch --show-current`; if it is not a branch for that work, create one (`rfc/<topic>`, `feat/<topic>`, `fix/<topic>` etc.) before the first commit, without waiting to be asked. Never pile unrelated work onto whatever branch happens to be checked out.

---

## 03/10/2026 — Don't reach for a worktree when a plain branch checkout is enough

**What was wrong:** to diagnose a bug on an existing remote fix branch, created a brand-new git
worktree (`../pantry-image-fix`) instead of just checking out the branch in the main tree (which had
a clean working tree, so nothing was at risk). User: "for that you can open a branch, no need to
over-engineer things."

**Correct fact:** a worktree earns its keep only when you need two branches checked out
*simultaneously* (e.g. another session is actively using the main tree's current branch). A clean
working tree with no concurrent work on it can just `git checkout <branch>` directly - no second
checkout needed.

**Lesson:** before creating a worktree, check whether a plain `git checkout` would do (working tree
clean, no other session on it per `ListAgents`). Reach for a worktree only when something is actually
using the current checkout and can't be disturbed.
