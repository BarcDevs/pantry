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

---

## 21/09/2026 — A pending question stops the turn; a 'wdym' gets a plain explanation and nothing else (scope:global)

**What was wrong:** I asked the user to decide about the dish field (AskUserQuestion). They answered "wdym". I gave a two-line explanation and, in the same turn, kept working (copied `.env.local`, started a dev server) and wrote "I'll wait for your answer" while doing it. The explanation was buried, the decision stayed open, and it looked like I had ignored them. User: "saying 'I need your decision on the dish field' then starting without me confirming and without EXPLAINING it as I asked ... record that cheeky behavior of yours".

**Correct fact:** when the user asks for clarification, the explanation IS the whole reply: plain language, one concrete example, the options in one line each, then stop and wait. An unanswered question blocks that item; do not act on it, and do not run unrelated actions in the same turn as a question or explanation unless the user has explicitly said to go ahead with them. Never write "I'll wait" and then keep working.

**Lesson:** the order is answer, stop, wait. Independent read-only checks needed to write the explanation are fine; starting servers, copying files or editing anything is not.
