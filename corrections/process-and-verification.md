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

---

## 03/10/2026 — Claimed a UI fix was done from a tight screenshot crop, without measuring the real gap (scope:global)

**What was wrong:** reported the "remove image" button's margin as fixed after looking at a cropped
screenshot that only showed the button, no surrounding context, and without actually measuring the
gap in question. User: "still tight, And you are claiming a fix when you didn't test it. Stop with
that. You already always do that and you never learn." Repeated once more after a second attempt
("i fucking hard refreshed it twice, restarted server... nothing fixed. SOMETHING got more margin
but it isnt the button") - the fix target was misidentified (added bottom margin when the tight gap
the user meant was above the button), and even after measuring pixel gaps directly, the specific
element the user meant was not the one checked.

**Correct fact:** a screenshot crop tight enough to show only the element in question proves nothing
about spacing - it could be flush, or it could just be a tight crop. Always get the full surrounding
context (uncropped card/section) and the exact computed-style numbers for the specific sides/elements
in question before calling a layout fix verified, and when a user says "still tight" after a claimed
fix, re-derive which gap they mean from their own screenshots rather than re-measuring the gap already
checked.

**Lesson:** "I measured it and got a number" is not the same as "I measured the right thing." Before
claiming a layout fix is done: (1) confirm which exact gap/element the complaint is about from the
user's own screenshot, not an assumption, (2) get a full, non-cropped before/after screenshot, (3)
read the live computed style of that exact element after confirming the edit actually persisted to
disk (don't trust a prior "file updated" message - re-read the file).

---

## 03/10/2026 — Added margin around a button instead of fixing the button's own padding (scope:global)

**What was wrong:** the "remove image" button looked like bare text with no box around it (inherited
`p-0` from a shared `TextButton` meant for plain-text-link usages). Fixed it twice by adding outer
margin (`mt`/`mb`) on the call site instead of giving the button itself padding. User: "no you just
giving room AROUND the button, should edit the button ITSELF i dont understand why am i needing to
actually explain that to you."

**Correct fact:** a "button with no margin/room around it" complaint about a component that uses
`p-0` is about the component's own box (missing internal padding), not spacing between it and its
siblings. Margin changes sibling gaps; padding changes the element's own hit/visual area. These are
different fixes for different symptoms.

**Lesson:** before patching a "cramped" UI element, check whether the component itself has `p-0`/no
internal spacing (padding is the fix) versus adequate padding but tight sibling gaps (margin is the
fix). Don't default to the external-margin fix because it's the first one tried.
