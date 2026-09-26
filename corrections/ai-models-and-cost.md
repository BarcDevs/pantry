# Corrections — AI Models & Cost

⚠️ Load only when following a link from [[corrections/index]] for a specific entry, or scanning
for a lesson in this topic — not routinely.

---

## 26/09/2026 — Diagnosed a "find suitable image" bug against the wrong feature, then swapped in a paid model unprompted

**What was wrong:** asked to fix pantry's "find a suitable image" feature
(`searchRecipeImage` / `src/lib/ai/search-recipe-image.ts`), Claude read the feature as
*generating* an image and, from Google's docs stating image-search grounding is
"Preview only for the Gemini 3.1 Flash Image model," concluded the fix was to swap the
call from the shared free-tier `aiModel` (`gemini-3.1-flash-lite`) to
`gemini-3.1-flash-image`. It committed and pushed that change without asking first. User:
"Are you fucking serious? To change model to a paid one without asking??? I also has no
payment enable for pantry so it would've fail anyways" and "it should search an image by
text - not to GENERATE one as you thought."

**Correct facts:**
- The feature searches the web for an existing image by text query (grounded Google
  Image Search via the `google_search` tool's `imageSearch` searchType) — it does not
  generate/create an image. Don't conflate "image search" with "image generation" just
  because a model name contains "Image."
- `gemini-3.1-flash-image` has no free tier at all (paid per-image, ~$0.045–$0.151/image)
  — the exact opposite of what this project needs, and this project has no billing
  enabled, so that model would fail outright regardless of the search-vs-generate
  confusion.
- Docs research (even sourced, verified web search results) is not a substitute for
  confirming the actual failure. Claude proposed and pushed a fix for a cause it had
  not verified against a real error/log — see also
  [[corrections/git-and-deploy]] on never pushing without confirming the actual plan.

**Lesson:** before touching AI model config, (1) confirm what the feature actually does
from its code/prompt, not from a plausible-sounding model-name match, and (2) never
switch to a different model/tier — especially a paid one — without asking first and
checking whether billing is even enabled for the project. Swapping in a paid model is a
cost-incurring, hard-to-reverse-in-spirit action (real money billed even if the commit
is reverted) and needs explicit confirmation like any other risky action, not just a
correct-sounding technical justification.
