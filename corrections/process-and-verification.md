# Corrections - Process & Verification

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic - not routinely.

---

## 19/09/2026 — A plan step or PRD toggle is done only when the code enforces it (web search)

**What was wrong:** the Phase 2 plan (`docs/plans/gentle-watching-giraffe.md`, local only -
`docs/plans` is gitignored, so it is not in git history) says `generate-recipe` "calls Gemini w/
Search Grounding when `allow_ai_generation`", and `phase-2-progress.md` marks Step 2 done. The PRD
(AC-2.8, feature table, data model) says: toggle off = only web-sourced recipes, never invented,
explicit "no match found" otherwise. The code does none of it: `src/lib/ai/gemini.ts` passes no search
tool, and the toggle only changes one sentence of the prompt (`generate-recipe-prompt.ts`), so nothing
stops the AI from inventing a recipe with the toggle off. Found while working on recipe images.
User: "it misleading. the purpose is when it is off, only webfetched recipes would be given. no
exception. no ai = no ai".

**Correct fact:** see [[decisions/ai-features]] ("Web recipe sourcing") for the intended behavior
(web first, generate only when nothing is found, convert on serving mismatch, save the origin URL;
toggle off = web only).

**Lesson:** a toggle or requirement counts as done only when behavior enforces it, and a test must
assert the behavior (the search tool is passed, nothing is generated when off), not the prompt text.
Before marking a plan step done, confirm the tool/config it names exists in code. When a PRD
acceptance criterion and the code disagree, say so and log it instead of working around it.
