# Git Rules

## Before Committing
1. `npm run typecheck`
2. `npm run lint:check`
3. `npm test`
4. Env vars via config exports only - never direct access to env
5. No commented-out code

## Commit Rules
- **ALWAYS ask before committing** - never auto-commit
- Don't run /commit skill on small fixes or formatting
- Always ask before invoking /commit
- Never jump ahead to commit without being asked
- Commit messages: imperative, present tense, describe what was **implemented** not just what changed
- Generate messages with /caveman-commit skill
- **Never claim commit succeeded without running actual `git commit`** - /caveman-commit is drafting only
- When committing after review fixes: include original work scope, not just the fix
- **Never commit directly on `main`.** Always work on a `feature/`/`fix/`/`rfc`/`chore/` etc. branch, even for small docs/fix commits — branch first, always. `main` is the trunk (origin's default branch) — merge the feature branch locally and push straight to `main`, no PR needed. There is no `dev` branch until the app is published; introduce one then, and record it in `decisions/`.
- Conventional commits: `feat`, `fix`, `docs`, `style`, `rfc`, `test`, `chore`. Breaking changes: `feat!:`
- Think on what the current commit job is before deciding if it either `feat`, `rfc`, `fix`, etc and REPORT BACK your reasoning - Don't just mechanically label as `feat` for everything.
- *IMPORTANT:* refactor job - always name `rfc` instead of `refactor`!
- If you're not sure, read [["../.resources/conventional-commits-cheatsheet.md]]` for more info
- Atomic commits - one change or fix per commit
- If staged changes span multiple unrelated logical units, plan the commit chunks (which files → which commit, in order) BEFORE invoking /commit, not during - /commit scans staged files once and expects a chunk plan, not per-chunk re-scans
- Claude's plans must never be committed
- *IMPORTANT:* Use /commit skill only when user explicitly invokes it - never on plain "commit"