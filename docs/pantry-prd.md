# Pantry - Product Blueprint v3

> **Auth note:** this PRD was written for Clerk. Auth is now Auth.js (NextAuth v5) with Credentials + Google and JWT sessions - no webhooks, no `clerk_id`, users keyed by `_id`/`email`. Read Clerk mentions below as historical; see `docs/architecture.md`.

## Product Overview

  Pantry is a mobile-first PWA that helps home cooks manage their pantry and fridge inventory, and generates personalized recipes based on what they already have. The core loop is: **add items → generate recipe → cook → update inventory**.
  The product starts as a personal-use tool for a single household. The architecture is designed to support multi-household and multi-user expansion in a later phase without requiring data model migrations.

  
### Core Value Proposition

  
| Problem | Solution |
|---|---|
| Don't know what to cook with what's available | AI recipe generation based on actual pantry contents |
| Ingredients expire before they're used | Expiry tracking with visual warnings |
| Pantry goes stale and inaccurate | Post-cooking inventory deduction flow |
| Manual recipe entry is tedious | Import recipes from URL via AI parsing |


  
### v2 Changes Summary

  
| Area | Change | Rationale |
|---|---|---|
| Auth | ✏️ Supabase → Clerk | Better DX, TypeScript-first, no manual JWT handling |
| Database | ✏️ Supabase Postgres → MongoDB | Same SQL, serverless-native, integrates cleanly with Next.js |
| Backend | ✏️ Supabase Edge Functions → Next.js API Routes | Single codebase, no separate deployment pipeline |
| Guest mode | ❌ DEFERRED → Phase 2 | Personal use only for MVP; adds complexity with no current benefit |
| Shopping list | ❌ DEFERRED → Phase 2 | Not critical for core loop; MVP already dense |
| Cooking sessions DB table | ❌ REMOVED, ✏️ reintroduced as lightweight field | A dedicated cooking_sessions table was removed - but a simple cooking log is needed after all (last-cooked date, per-cook rating). Solved with a `recipes.history` JSONB array instead of a separate table - no joins, no new entity, same simplicity goal as the original decision |
| Recipe version history | ❌ DEFERRED → Phase 2 | parent_recipe_id chain adds complexity; save via refinement is sufficient |
| Product category | 🆕 Split into storage + type | An item has a physical location (fridge/freezer/pantry) AND a food category (vegetables/dairy/etc) - these are orthogonal |
| Recipe fields | 🆕 Added cook_time, difficulty, steps[] | Structured steps array instead of free-text instructions; cook_time separate from prep_time |
| Households | ✏️ Schema-ready but UI-invisible | user_id directly on pantry_items for MVP; household abstraction added when sharing is needed |
| Pantry item form | 🆕 AI storage + expiry suggestion | As user types item name, AI suggests storage location and per-storage expiry estimates with reasons - single call returns all three storage options to avoid repeat round-trips. Suggestion is persisted on the item record; Edit mode reuses it instantly on storage change, with on-demand re-suggest if none exists. Present on both mobile and desktop Add/Edit Item screens. |
| Pantry item form | 🆕 Match vs. mismatch suggestion UI | Suggestion panel behaves differently depending on whether the current storage selection matches the AI's recommendation. Match: confirmation only, no action needed. Mismatch: shows a "Select" button to apply the better location, with both the current and recommended option's reasons displayed side by side so the user understands the trade-off before deciding. |
| Pantry item form | 🆕 Product name autocomplete | Name field is a Combobox filtering against a static list of ~150-200 common Hebrew food items (no AI, no network call, works offline). Substring match after 1 character, up to 8 suggestions. Selecting a suggestion triggers the existing debounced storage suggestion call. Free text accepted when no match. |
| Pantry item form | 🆕 Auto-fill food type from AI suggestion | `suggested_type: FoodType` added to the `StorageSuggestion` response (same single AI call, zero extra latency). Not shown as a form field upfront - displayed as a chip below the suggestion panel after AI responds ("סוג מוצר: X + שנה"). If AI didn't identify a type, a non-blocking popup on save asks the user to select or skip. Saved as `null` if skipped - does not block core functionality. |
| Pantry item icon | 🆕 Derived from food type, no picker | Pantry item visual icon is a fixed emoji determined by `FoodType` (e.g. vegetables→🥦, dairy→🥛, meat→🍗, null→📦). No manual emoji picker - removes a form field and eliminates mismatches between icon and food type. Mapping lives in `src/constants/food-type-emoji.ts`, resolved via `src/lib/pantry/food-type-icon.ts`. |
| Pantry list | 🆕 Product-type filter (multi-select) | Alongside the existing storage-location chips, a popover filter lets the user select any number of food types at once to narrow the pantry grid; independent of and combinable with the storage filter and search box. |
| Recipe generation config | 🆕 Selectable pantry subset | User can choose which pantry items to include for a given recipe generation via checklist (all selected by default, with Select All / Deselect All toggle) instead of always using the entire pantry |
| Recipe generation config | 🆕 Unified time field | Single `max_time` field replaces separate prep_time/cook_time inputs on the generation config screen - simpler MVP UX |
| Recipe generation config | 🆕 Meal count field | New `meal_count` (servings) input added to generation config |
| Recipe generation config | ✏️ Web search + strictness promoted to MVP | `allow_ai_generation` and `match_strictness` moved from Phase 2 to MVP - Gemini's web search (Google Search Grounding) is included in the standard API at no extra complexity, and match_strictness is a simple prompt parameter |
| Recipe cards | 🆕 Emoji visual identifier | AI-generated recipes show an AI-selected emoji on a gradient card instead of a searched/generated image. Imported recipes use the source's og:image when available, with the same emoji+gradient as fallback |
| Recipe import | 🆕 Text-paste import mode | Recipe import now supports two tabs: URL (existing) and free-text paste - user pastes raw recipe text and the AI parses it into the same structured recipe object. Same review screen as URL import |
| Recipe cards | 🆕 Manual image URL field | For recipes with no automatic image (ai_generated, text-paste import), user can optionally paste an image URL - shown on the Recipe Result screen right after generation/import (pre-save) and on the saved recipe's detail/edit screen - to replace the emoji+gradient card. Not available for URL-imported recipes, which already have an auto og:image |
| Recipe rating | ✏️ Reworked: computed from cooking history | Rating is no longer directly editable from the library. It's now the average of all ratings in the new `recipes.history` array, which is populated only via the post-cooking rating prompt (star rating or skip), and individual entries remain editable later from the Cooking History screen. This also powers a new Cooking History screen - implemented as a JSONB field on `recipes`, not a separate cooking_sessions table, preserving the original "no new entity" decision. Pre-cooking rating was considered and explicitly rejected - `is_favorite` already covers "I expect this to be great"; `rating` is reserved for actual cooked-outcome feedback only |


    ## MVP Feature Scope


  
| Feature | Status | Notes |
|---|---|---|
| Pantry item management (manual entry) | MVP | Add, edit, delete. Name, storage location, food type, quantity, unit, expiry date, notes. |
| Expiry date tracking & visual warnings | MVP | Color-coded indicators on pantry items. No push notifications at MVP. |
| AI recipe generation (Gemini) | MVP | Based on pantry contents. Configurable: meal count, unified max time, meal type, scope (pantry-only / pantry-first / open), selectable subset of pantry items (all selected by default), allow_ai_generation (web search vs. invent), match_strictness (flexible / strict). |
| Recipe refinement | MVP | Follow-up instruction to modify generated recipe (swap ingredient, adjust portions, etc). |
| Recipe library (save + rate) | MVP | Save AI-generated recipes. Rating 1–5, is_favorite boolean, tags. |
| Import recipe from URL | MVP | LLM-based parsing. Editable review screen before save. Fallback to manual on failure. |
| Cooking mode | MVP | Step-by-step view optimized for mobile. "Done cooking" triggers inventory deduction flow. |
| Post-cooking inventory deduction | MVP | Direct UPDATE on pantry_items quantities. No session tracking. User confirms or adjusts amounts. |
| Auth (Clerk) | MVP | Google OAuth + email/password. No guest mode needed - Clerk handles all auth flows. |
| Onboarding | MVP | 3 skippable steps: cooking level, dietary preferences, household size. Stored on user profile, used in AI prompt. |
| PWA (installable) | MVP | next-pwa. Installable to home screen. Offline shell. |
| Receipt scan (image) | MVP | Camera → Gemini Flash Vision → editable review list → save to pantry. |
| Receipt import from URL | MVP | Paste link → LLM extracts items → editable review list. Fallback to manual on failure. |
| Shopping list | Phase 2 | Deferred. Core loop doesn't require it. |
| Push notifications | Phase 2 | Deferred. In-app expiry warnings are sufficient for personal use. |
| Guest mode | MVP | localStorage-backed. Prompted to register after first recipe generated. Migration endpoint on signup. |
| Multi-household / family sharing | Phase 2 | DB is schema-ready. UI deferred. |
| Cooking session history | MVP | Moved up from Phase 2. Implemented as `recipes.history` JSONB array (cook timestamps + per-cook ratings), not a separate cooking_sessions table - keeps the original "no new entity" simplicity goal while still supporting the Cooking History screen. |
| Recipe version history | Phase 2 | Deferred. parent_recipe_id chain not needed at MVP. |
| Dish request (`dish_request`) | Phase 2 | Optional free-text field ("מה אתם רוצים להכין?") on the generation config screen. When present, AI attempts to realize the specific requested dish using pantry contents, surfacing missing core ingredients and labeled substitutes rather than freely picking a dish. Deferred: requires a fundamentally different generation response structure (matched / substituted / missing-core ingredient states), a more complex Result screen (title qualifier when substitutes used, three-state ingredient list), and relies on AI reliably identifying "core" vs "substitutable" ingredients - better evaluated after baseline generation quality is known in production. |
| AI recipe feedback loop | Phase 2 / Scaling only | Per-recipe rating data already exists in `recipes.history`. At scale, inject top-rated and low-rated recipe patterns into the generation prompt to personalize future suggestions ("המשתמש דירג נמוך מתכונים עם דגים"). Not relevant for single-user personal use - Gemini is stateless between calls so this requires explicit prompt injection per generation. Evaluate when user base justifies the added prompt tokens and complexity. |
| Web-search recipe sourcing (`allow_ai_generation` toggle) | MVP | Moved up from Phase 2 - Gemini's web search (Google Search Grounding) is included in the standard API, no added cost/complexity. Default: AI searches the web for a matching recipe; if none found, AI generates one. Toggle off → AI only returns web-sourced matches, never invents. |
| Match strictness control (`match_strictness`) | MVP | Moved up from Phase 2 - simple prompt parameter, no added complexity. 'strict' (recipe must closely match available ingredients) vs 'flexible' (core match sufficient, some missing ingredients OK). Independent of `scope` (pantry-only/first/open). |
| Meal count / servings (`meal_count`) | MVP | New. User sets number of servings (default 3) on the generation config screen; included in the AI prompt for ingredient quantity scaling. |


    ## Feature Acceptance Criteria


  
    Feature 1: Pantry Item Management
    As a home cook, I want to maintain an accurate list of what's in my pantry and fridge so the AI always has a real context to work with.
    Acceptance Criteria
    
      AC-1.1User can add an item with: name (required), storage location (fridge / freezer / pantry), food type (vegetables / fruits / dairy / meat / fish / canned / grains / snacks / beverages / condiments / other - optional, see AC-1.8b), quantity, unit, expiry date (optional), notes (optional). The pantry item's visual icon is derived automatically from its food type - there is no manual emoji/icon picker. Each FoodType maps to a fixed emoji (e.g. vegetables→🥦, dairy→🥛, meat→🍗); items with `type: null` show a generic icon (📦).

      - AC-1.2Storage location and food type are independent fields - a product can be "vegetables" stored in "fridge" or "freezer"

      - AC-1.3Items with expiry dates show color-coded indicators: green (>7 days), orange (3–7 days), red (<3 days or expired)

      - AC-1.4Pantry list is sorted by expiry date ascending (soonest first); items without expiry appear at the bottom

      - AC-1.4bAlongside the existing storage-location filter chips, a popover lets the user select any number of food types at once (multi-select) to filter the pantry list; an item with `type: null` is excluded whenever any type filter is active. Combines with the storage filter and search box (all three narrow the same list together, not mutually exclusive).

      - AC-1.5User can edit any field of an existing item

      - AC-1.6User can delete an item (with confirmation)

      - AC-1.7Duplicate name detection on add: if normalized name matches existing item, user is prompted to merge quantities or save as separate item

      - AC-1.7bThe product name field is a Combobox (autocomplete) that filters against a static list of ~150-200 common Hebrew food items (`src/constants/pantry-items.ts`). Matching is case-insensitive substring, triggered after 1 character, showing up to 8 suggestions. Selecting a suggestion fills the name field and triggers the existing debounced storage suggestion call (AC-1.8). If no match exists, the user types freely - no blocking. No AI or network call involved; works offline.

      - AC-1.8As the user types an item name, the system suggests a recommended storage location, food type, and per-storage expiry estimates (debounced AI call). The response includes `suggested_storage`, `suggested_type: FoodType`, `reason`, and `expiry_by_storage` - all from a single `generateObject` call. `suggested_storage` and expiry appear as hint text below their respective fields. `suggested_type` is handled separately - see AC-1.8b. The storage location defaults to pantry on the Add Item screen; when the AI suggestion arrives, `suggested_storage` is applied to the storage field automatically, and the user can still switch it. Once the user has picked a storage location themselves, later suggestions (e.g. after editing the name) no longer change it - the suggestion stays visible as a hint only (AC-1.10/AC-1.11). None of these auto-fill values override a field the user has already manually set.

      - AC-1.8bFood type (`suggested_type`) display and fallback behavior: the food type field is **not shown** at the top of the add/edit form. After the AI suggestion returns, a "סוג מוצר: X 🥦" row appears below the suggestion panel with a "שנה" button - the user can change it or leave it. If the AI did not return a `suggested_type` (or the user clears the value), no food type row is shown during the form. When the user taps "שמור" and `type` is still unset, a non-blocking popup appears: "מה סוג המוצר?" with the full `FoodType` list and a prominent "דלג" option. If skipped, the item is saved with `type: null` and can be updated later from the edit sheet. `type: null` is valid - it does not block any core functionality.

      - AC-1.9The suggestion response includes an expiry estimate AND a short reason for each storage option (fridge / freezer / pantry), since shelf life varies significantly by location for the same item.

      - AC-1.10If the user selects a different storage location than the AI's top suggestion, the expiry hint updates instantly from the already-returned per-storage map - no second AI call is made.

      - AC-1.11If the user manually enters a value in either the storage or expiry field, the corresponding suggestion hint is dismissed - no override of explicit user input.

      - AC-1.12The storage + expiry suggestion (`expiry_by_storage` map and reasons) is persisted on the pantry item record at creation time, not just used transiently in the add form.

      - AC-1.13In Edit Item mode, the suggestion does not auto-run. If the user changes the storage location and a suggestion map already exists on the record, the expiry hint updates instantly from the stored map - no new AI call. If no suggestion exists on the record (e.g. item predates this feature), an on-demand "Suggest" button triggers a fresh AI call and persists the result.

      - AC-1.14The displayed expiry hint always corresponds to the storage location currently selected in the form's storage field - not necessarily the AI's top-recommended storage. If the user has manually set storage to a value different from `suggested_storage`, the expiry hint shown is `expiry_by_storage[current_selection]`, with that option's own `reason`.

      - AC-1.15The suggestion panel compares the currently-selected storage field value against `suggested_storage` and renders one of two states: **Match** - the current selection equals the AI's top recommendation. Panel shows confirmation only ("Recommended for storage: [location]" + its `reason`, e.g. "preserves taste and freshness"). No "Select" button, since there is nothing to change. **Mismatch** - the current selection differs from `suggested_storage`. Panel shows the recommended alternative with a "Select" button (applies it to the storage field on tap) alongside its `reason`, directly under the expiry/reason for the *currently selected* storage - letting the user see, side by side, why their current choice is suboptimal (e.g. "freezing halts spoilage" - true, but not optimal) and why the suggested one is better (e.g. "preserves taste and freshness").

      - AC-1.16Each storage option's `reason` in the `expiry_by_storage` map is written to be meaningful standalone - not just "X days" but a short rationale (e.g. fridge: "preserves taste and freshness" vs freezer: "halts spoilage but degrades texture") - since both the recommended and the currently-selected option's reasons are shown together in the mismatch state.

    
  

  
    
### Feature 2: AI Recipe Generation

    > As a home cook, I want to receive personalized recipe suggestions based on what I actually have, so I can cook without a trip to the store.

    
**Acceptance Criteria**

    
      - AC-2.1Generation config screen lets user set: meal count (number of servings, default 3), max prep time (single unified time field - combines prep + cook, in minutes, with quick presets 15/30/60 and a custom input), meal type (breakfast/lunch/dinner/snack), scope (open / pantry-first / pantry-only), allow_ai_generation toggle (default on - see AC-2.8), and match_strictness (flexible / strict - see AC-2.9)

      - AC-2.1bGeneration config screen shows all pantry items as a checklist, all selected by default, with a "Select All" / "Deselect All" toggle. User can uncheck individual items to exclude them from this generation only - the AI only considers checked items as available ingredients.

      - AC-2.2If expired items exist, user must resolve each (include / exclude / update expiry) before generation proceeds

      - AC-2.3A soft warning is shown if pantry contains fewer than 5 items; user can proceed anyway

      - AC-2.4Generated recipe includes: title, ingredient list (pantry-matched items highlighted, missing items marked, and - when a missing ingredient has a close-but-not-exact pantry match, e.g. milk for soy milk - a distinct "replacement available" state, see AC-2.4b), step-by-step instructions array, difficulty, max_time, meal_count, meal_type, AI disclaimer

      - AC-2.4bEach ingredient carries a `name` (display, can include prep detail like "chopped") and an AI-assigned `base_name` (canonical identity, used only for pantry matching) - this fixes false matches (soy milk matching plain milk) without losing legitimate prep-variant matches (chopped onion matching onion). Matching against the pantry runs live on every read (generate, view, refresh), never cached on the recipe, so adding a previously-missing item to the pantry clears its "missing" flag immediately. Three ingredient-row states, visually distinct: available (green), missing with a related pantry item as a substitute (amber, "תחליף זמין: X"), missing with nothing related (red).

      - AC-2.4cEach ingredient also carries an AI-assigned `category`, using the same food-type taxonomy as pantry items (`FoodType`: vegetables, fruits, dairy, eggs, meat, fish, canned, grains, snacks, beverages, condiments, other). A replacement suggestion (AC-2.4b) requires the pantry item's `type` to match the ingredient's `category`, and requires one side's descriptive words to fully cover the other's (not just any shared word) - this is what stops "red pepper" (vegetables) from suggesting "black pepper" (condiments, different category) or even same-category "hot pepper" (neither name's qualifier is a subset of the other's) as a substitute, while still allowing a bare/generic name to match a more specific one (milk → soy milk, oil → olive oil, plural "peppers" → "red pepper").

      - AC-2.4dAn ingredient that is missing (the red or amber state of AC-2.4b) shows an "add to pantry" link - including one with a replacement suggestion, so the user can still choose to add the original item instead of using the replacement. The link is hidden while the replacement is toggled on (AC-2.5), once the ingredient is removed, and when it is already in the pantry. It opens the manual Add Item screen prefilled with the ingredient's name and - only when the recipe unit is also a pantry unit - its quantity and unit (a recipe-only unit such as tsp or pinch is dropped rather than mislabeled). The link carries the current screen as an internal-only `returnTo` path; after the item is added the user is returned to that screen instead of the pantry list, even if the recipe was never saved (the unsaved recipe is kept per AC-2.10). On return the ingredient list is re-matched against the current pantry automatically, so the newly added item is no longer flagged as missing without any manual refresh.

      - AC-2.4eWater is treated as a staple that is always available: an ingredient whose display text starts with "מים" (e.g. "מים", "מים חמים", "מים רותחים") or "water" is always marked in-pantry, is never flagged as missing, never offers a replacement or an "add to pantry" button, and needs no pantry item. It is skipped by post-cooking deduction, since there is no pantry item to deduct from. Other water-like ingredients (e.g. rose water, "מי ורדים") are not covered and match against the pantry as usual.

      - AC-2.5User can send a refinement instruction (e.g. "replace chicken with tofu"); updated recipe replaces the current view. Each ingredient row with a replacement suggestion (AC-2.4b) has an "add to adjustments" toggle that appends a ready-made instruction line ("use X instead of Y") to this field instead of requiring the user to type it - toggling again removes just that line. Each optional ingredient (AC-2.4) similarly has a "remove" toggle that appends a "without X" line - also independently toggleable and coexists with a replacement toggle on the same row if both apply.

      - AC-2.5bA saved (already in the library) recipe also exposes this adjustments field. Submitting it there does not modify the saved recipe: it sends the current recipe + instruction through the same refinement call, then saves the result as a brand-new recipe (fresh id, rating/history/favorite reset, no lineage recorded - see the `recipes` data model note on parent_recipe_id), and navigates to it. The original recipe is left untouched.

      - AC-2.6User's dietary preferences and cooking level from onboarding are included in the AI prompt as default constraints

      - AC-2.7AI call is made server-side only; Gemini API key is never exposed to the client

      - AC-2.8`allow_ai_generation` toggle (default: on). When on, the AI uses Gemini's built-in web search (Google Search Grounding) to find a matching recipe online first; if no good match exists, it generates one from scratch. When off, the AI only returns web-sourced recipe matches and explicitly states "no match found" rather than inventing one.

      - AC-2.9`match_strictness` setting (default: flexible). 'Strict' requires the recipe to closely match available pantry ingredients (minimal missing items). 'Flexible' allows the recipe to proceed with some missing ingredients as long as the core dish matches. This is a prompt parameter only - no additional API complexity beyond the existing generation call.

      - AC-2.10An unsaved recipe (the generated Result screen, and the import review of AC-3.14) is kept as a draft in local storage, so the user can navigate away (e.g. to the Add Item screen, AC-2.4d) and come back to the same recipe at any point, not only via the add-to-pantry round trip. Every change to the recipe (refinement, title, favorite, image URL) refreshes the draft and restarts its timer. A draft is discarded only when: (a) the user dismisses it with an explicit "discard draft" control on the screen, (b) the recipe is saved to the library, (c) it has been untouched for 30 minutes, or (d) a new generation/import replaces it. When a draft is restored, its ingredient list is re-matched against the current pantry (AC-2.4b) so pantry changes made in the meantime are reflected. Drafts are also surfaced from the main entry point: opening the Generate screen (the green "+" button in the bottom nav) shows one banner per existing draft - generated and/or imported - above the config form, with the recipe title, a "continue" button that opens the draft on its own screen (Result or import review) and a "discard draft" control. The form stays usable, and generating or importing a new recipe replaces the corresponding draft. This means the draft is reachable without returning to its exact URL (e.g. via the browser back button) until it is dismissed, saved or expires.

    
  

  
    
### Feature 3: Recipe Library

    > As a home cook, I want to save, rate, and rediscover recipes I've generated or imported, so I can build a personal cookbook over time.

    
**Acceptance Criteria**

    
      - AC-3.1User can save any generated or imported recipe to their library with one tap

      - AC-3.2Each saved recipe has: title, source (ai_generated / imported_url / manual), rating (1–5, nullable), is_favorite (boolean), tags (user-defined array)

      - AC-3.3Recipe stores structured steps as an ordered array, not free text

      - AC-3.4Library supports search by title and filter by: is_favorite, min_rating, source

      - AC-3.5User can update favorite status and tags on any saved recipe directly from the library or detail screen. Rating is not directly editable here - see AC-4.7 to AC-4.9: rating is only set via the post-cooking flow and displayed as a computed average.

      - AC-3.6Editing ingredients or instructions saves as the same record (no versioning at MVP). Exception: the adjustments field on the detail screen (AC-3.13) - submitting it creates a new record rather than editing this one.

      - AC-3.7Recipe cards display a visual identifier: AI-generated recipes show a single AI-selected emoji on a colored gradient background (no image search or generation). Imported (`imported_url`) recipes show the source page's `og:image` when available, falling back to the same emoji + gradient treatment when no image exists.

      - AC-3.8The `emoji` field is returned by the AI as part of the same generation/import response - no separate API call is made to select a card visual.

      - AC-3.9Recipe import supports two input modes via tabs: URL (existing) and free-text paste - user pastes raw recipe text (e.g. copied from a website, message, or note) and the AI parses it into the same structured recipe object (title, ingredients, steps, difficulty, max_time, meal_count, meal_type, emoji). The text-paste tab also includes the same optional image URL field shown alongside the text input - the user can attach a photo together with the recipe text in one step, rather than only being able to add it after the AI processes the text. Same review/edit screen before save as URL import.

      - AC-3.10Text-paste import has no `source_url` (nullable, unset). `source` is still `imported_url` for both URL and text-paste import - both represent "came from somewhere else," not the AI's own pantry-based generation. `image_url` is never set for text-paste import (no page to pull og:image from) - falls back to emoji + gradient.

      - AC-3.11Recipes with no automatic `image_url` (`ai_generated` and text-paste `imported_url`) show an optional manual image URL field, clearly labeled "optional," on the Recipe Result screen - immediately after generation/import, before the recipe is saved - and on the saved recipe's detail/edit screen. If the user pastes a URL, it populates `image_url` and the card switches from emoji+gradient to the image. This field does not appear for URL-imported recipes that already have an `image_url` from `og:image` - that value is not user-overridable in the MVP.

      - AC-3.12If the user enters an image URL on the text-paste import screen (AC-3.9), that value pre-fills the same field on the subsequent Recipe Result screen - it is the same piece of state carried forward, not a separate entry. The user can still edit or clear it on the Result screen before saving. This avoids asking for the same input twice while still allowing a final check before save.

      - AC-3.13The saved recipe detail screen has the same adjustments field and per-ingredient "add to adjustments" toggle described in AC-2.4b/AC-2.5. Submitting it does not edit this recipe in place (unlike AC-3.6) - it branches: the recipe + instruction go through the same refinement call as AC-2.5, the result is saved as a new library entry (fresh id, `rating`/`history` reset, `is_favorite` reset to false), and the user is navigated to the new recipe. The original stays exactly as it was, so a cooking history or rating already recorded on it is never lost or altered by an adjustment.

      - AC-3.14The import review screen (URL or text-paste, before save) has the same adjustments field and per-ingredient "add to adjustments" toggles as the generate Result screen (AC-2.4b/AC-2.5). Submitting refines the unsaved imported recipe in place through the same refinement call - the preview updates and nothing is saved until the user taps save. The unsaved import follows the same draft rules as a generated recipe (AC-2.10): persisted in local storage, restored whenever the user returns to the import screen within 30 minutes, dismissible with a "discard draft" control, and cleared on save.

    
  

  
    
### Feature 4: Cooking Mode & Inventory Deduction

    > As a home cook, I want a distraction-free step-by-step view while cooking, and an easy way to update my pantry when I'm done.

    
**Acceptance Criteria**

    
      - AC-4.1Cooking mode shows one step at a time, optimized for mobile reading (large text, minimal chrome)

      - AC-4.2"Done cooking" button appears on the last step and as a persistent action

      - AC-4.3Tapping "Done cooking" opens a deduction confirmation screen listing each pantry ingredient with pre-filled suggested deduction quantities

      - AC-4.4User can edit any quantity before confirming; quantities are directly subtracted from pantry_items records (no cooking_sessions table)

      - AC-4.5User can dismiss the deduction screen without updating (pantry unchanged)

      - AC-4.6Items reduced to 0 or below are flagged for removal (user chooses to delete or keep at 0)

      - AC-4.7After confirming (or skipping) the deduction screen, a rating prompt appears: "How did it turn out?" with a 5-star input and a "Save to history without rating" skip option. This is the only place a rating can be entered - recipes are no longer rated directly from the library (see AC-3.5).

      - AC-4.8Submitting the rating prompt (with or without a star rating) appends one entry to `recipes.history`: `{cooked_at: now, rating: <stars or null>}`. The recipe's `rating` field is then recomputed as the average of all non-null ratings in `history`.

      - AC-4.9A Cooking History screen lists every recipe with at least one `history` entry, showing the most recent cook date/time and that recipe's per-cook ratings (e.g. "Today," "Yesterday 19:40," "June 15, 08:10" each with their own star rating, including unrated entries shown as empty stars). Sorted most-recent-first. This screen reads directly from `recipes.history` across all recipes - no separate cooking_sessions table. The screen's subtitle and a small edit-affordance icon (e.g. pencil) next to each star row make it visually unambiguous that ratings are tappable/editable here - not just a static log.

      - AC-4.10User can tap any individual entry in the Cooking History screen to edit its star rating (including adding a rating to a previously-skipped entry, or changing an existing one). Editing a `history` entry's rating recomputes `recipes.rating` (the average) immediately. No pre-cooking rating is offered - `is_favorite` already covers "I expect this to be great" sentiment; `rating` is reserved exclusively for actual cooked-outcome feedback.

    
  

  
    
### Feature 5: Receipt Scanning & URL Import

    > As a home cook, I want to add multiple pantry items quickly after shopping, without typing each one manually.

    
**Acceptance Criteria**

    
      - AC-5.1Camera scan: user photographs receipt → image sent to Gemini Flash Vision server-side → extracted items ({name, quantity, unit}) appear in editable review list

      - AC-5.2URL import: user pastes receipt or shopping page URL → server fetches and sends to Gemini for extraction → same editable review list

      - AC-5.3User can edit, remove, or add items in the review list before confirming save to pantry

      - AC-5.4If URL parsing fails, error is shown with "Enter manually instead" fallback

      - AC-5.5Receipt images are processed server-side and not persisted (deleted after extraction confirmed)

      - AC-5.6Confirmed items are added to pantry; duplicate names trigger the same merge prompt as manual add

    
  


  Product Blueprint v2 · ---


  
## Primary Flow: First Value Loop

  From first open to first cooked recipe with pantry updated.

  
| Step | Action | Detail |
|---|---|---|
| 1 | **Open app** | Splash screen → sign up via Clerk (Google or email), or continue as guest (localStorage). |
| 2 | **Onboarding** | 3 skippable steps: cooking level, dietary preferences, household size. Sets AI prompt defaults. |
| 3 | **Empty pantry** | Empty state CTA with 3 add paths: Add Manually, Scan Receipt, Paste Receipt Link. |
| 4a | **Add manually** | Name + storage location + food type + quantity + optional expiry → save |
| 4b | **Scan receipt** | Camera → Gemini Vision → review list → confirm → items added to pantry |
| 4c | **Paste URL** | URL → Gemini extraction → review list → confirm → items added to pantry |
| 5 | **Generate recipe** | Configure: meal count, max time, meal type, scope, web-search toggle, match strictness. Select/deselect which pantry items to include (all selected by default). Resolve expired items if any. Submit. |
| 6 | **View & refine** | Recipe displayed. Optional: send refinement instruction. Save to library. |
| 7 | **Cook** | Cooking mode: step-by-step. Tap "Done Cooking". |
| 8 | **Update pantry** | Deduction screen: confirm or adjust quantities. Pantry updated. Loop complete. |


  
  
## Secondary Flow: Import Recipe from URL

  
| Step | Action | Detail |
|---|---|---|
| 1 | **Recipe Library → Import** | Tap "Import from URL" |
| 2 | **Paste URL** | Server fetches page, sends to Gemini for structured extraction |
| 3 | **Review** | Editable recipe form: title, ingredients, steps. User corrects any errors. |
| 4 | **On failure** | Error shown with "Enter manually" fallback. Partial extraction pre-fills the manual form. |
| 5 | **Save** | Stored with source=imported_url and source_url set. |


  Product Blueprint v2 · ---


  
## Screen Map

  
| Screen | MVP | Purpose |
|---|---|---|
| Splash / Landing | MVP | Value prop + sign-up / login entry points. Sign-up, login, and guest mode entry points. |
| Authentication (Clerk) | MVP | Google OAuth and email/password via Clerk. Guest mode bypasses auth entirely - data stored in localStorage. |
| Onboarding | MVP | 3-step skippable: cooking level, dietary preferences, household size. |
| Home / Pantry | MVP | Item list sorted by expiry, color-coded warnings, add-item CTA, generate recipe CTA. |
| Add Item (Manual) | MVP | Form: name, storage, type, quantity, unit, expiry (optional), notes (optional). The expiry field opens a Hebrew, RTL calendar with month and year dropdowns (Sunday-first weeks) so a far-off date is one selection away instead of many month-by-month clicks; dates before today are disabled (today is allowed) and the year range runs from the current year to 20 years ahead. The receipt-row editor uses the same picker. AI storage/expiry suggestion persisted on save. |
| Receipt Scan Review | MVP | Editable extracted item list before committing to pantry. |
| Recipe Generation Config | MVP | Meal count, unified max time, meal type, scope mode, allow_ai_generation toggle, match_strictness, expired-item resolution, pantry item checklist (select/deselect which items are available for this recipe). On mobile the meal-count, max-time and meal-type cards stack in a single column (3 columns from the `md` breakpoint up). Shows a banner per unsaved recipe draft (see AC-2.10). |
| Recipe Result | MVP | Generated recipe with pantry-match highlights, missing-ingredient flags (including replacement suggestions with an "add to adjustments" toggle, see AC-2.4b), refinement input, save + start cooking buttons; missing ingredients link to Add Item with a return path, see AC-2.4d. |
| Cooking Mode | MVP | Step-by-step view, dark theme, large text, step counter (e.g. "1/5") with progress bar, persistent "Done Cooking" action and "Previous" navigation. |
| Post-Cooking Deduction | MVP | "Bon appétit" confirmation header. Ingredient list with pre-filled quantities (editable +/-), shows resulting pantry quantity per item ("X left"). "Confirm & Update Pantry" or "Skip - leave pantry unchanged." |
| Rating Prompt | MVP | Appears immediately after deduction (confirm or skip). 5-star input + "Save to history without rating" skip option. Only entry point for rating a recipe. |
| Cooking History | MVP | List of all cooked recipes, most-recent-first, showing last-cooked date/time and per-cook star rating. Reads from `recipes.history`. |
| Recipe Library | MVP | Saved recipes grid/list. Search + filter (favorite, rating, source). Import entry point with two tabbed modes: URL or free-text paste. |
| Recipe Detail / Edit | MVP | Full recipe view, rating, favorite toggle, tags, edit mode (overwrites, no versioning). |
| Settings / Profile | MVP | Cooking level, dietary prefs, household size. Account management via Clerk. |
| Shopping List | Phase 2 | Deferred. |


  Product Blueprint v2 · ---


  
## Recommended Stack

  
| Layer | Technology | Rationale |
|---|---|---|
| Frontend + Backend | Next.js 15 App Router TypeScript | Single codebase for UI and API routes. No separate backend service. Serverless-ready for Vercel deployment. |
| Styling | Tailwind CSS shadcn/ui | Rapid, consistent mobile-first UI. shadcn components are copy-owned, not a runtime dependency. |
| Database | MongoDB Mongoose | Serverless Postgres. Mongoose provides schema validation, typed models, and middleware hooks. |
| Auth | Clerk | Google OAuth + email/password out of the box. TypeScript SDK, Next.js middleware, no manual JWT handling. Webhooks for user sync to MongoDB. |
| AI / LLM | Gemini Flash Google AI SDK | Free tier covers MVP volume. Multimodal (vision for receipts, text for recipes and URL parsing). All calls server-side only. |
| PWA | next-pwa | Service worker + manifest. Installable to home screen. Offline shell. Works on Android Chrome and iOS Safari (PWA installed). |
| Hosting | Vercel | Zero-config Next.js deployment. Edge network. Free tier covers personal-use traffic. |
| ODM Schema | Mongoose Schemas | Schema-first migrations. TypeScript enums mirror DB enums for full type safety end-to-end. |


  
### TypeScript Enums (shared between DB schema and application code)

  
```
// Storage location (physical location in home)
type StorageLocation = 'fridge' | 'freezer' | 'pantry'

// Food type / category (what kind of ingredient it is)
type FoodType =
  | 'vegetables' | 'fruits' | 'dairy' | 'meat'
  | 'fish' | 'canned' | 'grains' | 'snacks'
  | 'beverages' | 'condiments' | 'other'

// Recipe difficulty
type Difficulty = 'easy' | 'medium' | 'hard'

// Recipe source
type RecipeSource = 'ai_generated' | 'imported_url' | 'manual'

// How item was added to pantry
type ItemSource = 'manual' | 'receipt_scan' | 'receipt_url'

// Quantity units
type Unit = 'kg' | 'g' | 'L' | 'ml' | 'units'

// Storage + expiry suggestion response (MVP - /api/pantry/suggest)
// Persisted on pantry_items.storage_suggestion at creation time so Edit mode
// can reuse it instantly on storage change, without a repeat AI call.
interface StorageSuggestion {
  suggested_storage: StorageLocation
  suggested_type: FoodType      // auto-fills the food type selector; does not override manual selection
  reason: string
  expiry_by_storage: {
    fridge: { date: string; reason: string }
    freezer: { date: string; reason: string }
    pantry: { date: string; reason: string }
  }
}

// Recipe generation request (MVP - /api/recipes/generate)
interface RecipeGenerationRequest {
  meal_count: number              // servings, default 3
  max_time: number                // minutes - unified prep+cook time (presets: 15/30/60, or custom)
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  scope: 'pantry-only' | 'pantry-first' | 'open'
  selected_item_ids?: string[]    // omitted/empty = entire pantry used (default: all checked)
  allow_ai_generation: boolean    // default: true. False = web-search-only, never invent
  match_strictness: 'strict' | 'flexible'  // default: 'flexible'
}

// allow_ai_generation and match_strictness moved to MVP - see RecipeGenerationRequest above
type MatchStrictness = 'strict' | 'flexible'
```


  Product Blueprint v2 · ---


  
## Data Model


  
```
users
  id                   uuid         - Primary key, synced from Clerk webhook
  clerk_id             text         - Clerk user ID (used for auth lookup)
  email                text
  display_name         text
  cooking_level        difficulty   - Onboarding. Default for recipe generation prompt.
  household_size       integer      - Onboarding. Influences portion sizing in prompt.
  dietary_preferences  jsonb        - ['vegetarian', 'gluten-free', ...]. Constraints in AI prompt.
  created_at           timestamptz
```


  
```
pantry_items
  id              uuid              - Primary key
  user_id         uuid              - FK to users
  name            text              - Normalized (lowercase, trimmed) for duplicate detection
  storage         storage_location  - 'fridge' | 'freezer' | 'pantry'
  type            food_type         - 'vegetables' | 'dairy' | 'meat' | ... (TypeScript enum, text in DB)
  quantity        numeric
  unit            text              - 'kg' | 'g' | 'L' | 'ml' | 'units'
  expiry_date     date              - Nullable. No alert if null.
  notes           text              - Nullable. Free-text user notes.
  source          item_source       - 'manual' | 'receipt_scan' | 'receipt_url'
  storage_suggestion jsonb          - Nullable. Persisted AI suggestion: { suggested_storage, suggested_type, reason, expiry_by_storage }. Set at creation if AI suggestion was used; enables instant food-type auto-fill and expiry updates on storage change in Edit mode without a new AI call.
  created_at      timestamptz
  updated_at      timestamptz
```


  
```
recipes
  id               uuid            - Primary key
  user_id          uuid            - FK to users
  title            text
  source           recipe_source   - 'ai_generated' | 'imported_url' | 'manual'
  source_url       text            - Nullable. Set for imported recipes.
  difficulty       difficulty      - 'easy' | 'medium' | 'hard'. AI-assessed from the recipe, not a generation input.
  max_time         integer         - Minutes. Unified prep+cook time used in the generation request.
  meal_count       integer         - Servings this recipe yields.
  meal_type        text            - 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ingredients      jsonb           - [{label, name, category, quantity, unit, in_pantry: boolean}]. `label` is the free-text display form written by the AI (e.g. "בצל קצוץ"). `name` is the canonical identity used for pantry matching and is never AI-supplied - it is always derived deterministically in code from `label` by stripping non-identity-changing prep/state words (chopped, sliced, ground, etc.) while keeping real type/variant differences (e.g. soy milk vs. milk), since the AI proved unreliable at this (either dropping real distinguishing words or rewriting the name to match a pantry item outright). `category` is the same `FoodType` enum used for pantry items and remains AI-assigned - required for a replacement suggestion to be surfaced (see AC-2.4c), preventing same-word-different-category false matches (red pepper vs. black pepper). `in_pantry` is likewise never AI-supplied - it and `replacement_name` (when a related-but-not-exact same-category pantry item exists, e.g. milk for soy milk) are always recomputed deterministically against the current pantry on every read (on generate, refine/branch, and detail view), never trusted from AI output or stale storage.
  steps            jsonb           - [{order: number, description: string}]
  emoji            text            - Single AI-selected emoji representing the recipe (e.g. 🍝 for pasta). Used as card visual instead of a generated/searched image.
  image_url        text            - Nullable. Auto-populated for URL-imported recipes when source page has an og:image (not user-editable in MVP). For ai_generated and text-paste recipes (no automatic source), user may optionally paste an image URL manually via the recipe detail/edit screen. Falls back to emoji + gradient card if absent.
  rating           numeric         - 1–5, one decimal. Computed as the average of all rated entries in `history`. Nullable if history is empty or all entries are unrated (skipped). Not directly user-editable - set only via cooking + rating flow.
  history          jsonb           - Array of cooking log entries: [{entryId: string, cooked_at: timestamp, rating: number | null}]. `entryId` (e.g. a short UUID) makes individual entries addressable for editing (AC-4.10). One entry per "Done Cooking" → deduction confirmation. `rating` is null if user chose "save without rating," and editable afterward from the Cooking History screen. This is also what powers the Cooking History screen (last-cooked timestamps, per-cook ratings) - no separate cooking_sessions table.
  is_favorite      boolean         - Default false.
  tags             jsonb           - User-defined string array.
  ai_prompt_context jsonb          - Pantry snapshot + params used at generation time. Enables reproducibility.
  created_at       timestamptz
  updated_at       timestamptz

- Note: no separate cooking_sessions table. Inventory deduction is a direct UPDATE on pantry_items, and cooking history (timestamps + ratings) lives on `recipes.history` instead of a dedicated table.
- Note: no parent_recipe_id / version_number at MVP. Direct metadata edits (is_favorite, tags, title, steps, ingredients via PATCH) overwrite in place. Exception: submitting a refinement instruction on an already-saved recipe (via the "adjustments" field, AC-2.5b) always creates a brand-new recipe row rather than mutating the saved one - the original is untouched. There is still no `parent_recipe_id` link recorded between the two at MVP; they are independent rows.
```


  Product Blueprint v2 · ---


  
## Key API Endpoints

  All endpoints are Next.js API Routes. Auth is handled by Clerk middleware (session token). All AI calls are server-side only.

  
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/pantry | Returns all pantry items for the authenticated user, sorted by expiry_date ascending. Supports ?expiring_within_days=N filter. |
| POST | /api/pantry/items | Adds one or more items. Accepts array. Performs normalized name duplicate check - returns merge prompt data if conflict exists. |
| POST | /api/pantry/suggest | Accepts item name (debounced from input). Returns `{ suggested_storage, suggested_type, reason, expiry_by_storage: { fridge: {date, reason}, freezer: {date, reason}, pantry: {date, reason} } }` in a single AI call - avoids repeat calls when user changes storage selection. |
| PATCH | /api/pantry/items/:id | Updates a single item (any field). Also used for post-cooking deduction (quantity update). |
| DELETE | /api/pantry/items/:id | Removes a single pantry item. |
| POST | /api/pantry/scan-receipt | Accepts base64 receipt image. Sends to Gemini Flash Vision server-side. Returns extracted [{name, quantity, unit}] for client review. Image not persisted. |
| POST | /api/pantry/parse-receipt-url | Accepts a URL. Fetches page content, sends to Gemini for extraction. Returns items for review or error with fallback_to_manual flag. |
| POST | /api/recipes/generate | Assembles pantry context (with expiry weighting for storage type), sends to Gemini with user prefs. Body: meal_count, max_time, meal_type, scope, selected_item_ids (optional), allow_ai_generation, match_strictness. When allow_ai_generation is true, uses Gemini Google Search Grounding to search the web first. Returns structured recipe object. |
| POST | /api/recipes/refine | Accepts recipe_id (or inline recipe) + free-text instruction. Returns modified recipe for client preview before save. Used both for the not-yet-saved generate/import result screen (updates the in-memory preview) and, via /api/recipes/:id/branch, for already-saved recipes. |
| POST | /api/recipes/:id/branch | Accepts an already-saved recipe + free-text adjustments instruction (AC-2.5b). Internally calls refine, then saves the result as a new recipe row (rating/history/favorite reset) rather than updating `:id`. Returns the new recipe; client navigates to it. |
| POST | /api/recipes/import-url | Accepts recipe URL. LLM parses page into structured recipe. Returns recipe object for review, or error with fallback_to_manual flag. |
| POST | /api/recipes/import-text | Accepts raw pasted recipe text. LLM parses text into the same structured recipe object as URL import. Returns recipe object for review. No image_url is set (no source page to pull og:image from) - falls back to emoji + gradient. |
| GET | /api/recipes | Returns user's recipe library. Supports ?search=, ?is_favorite=true, ?min_rating=N, ?source=. |
| POST | /api/recipes | Saves a new recipe. Accepts full recipe object. |
| PATCH | /api/recipes/:id | Updates recipe metadata (is_favorite, tags, title, steps, ingredients). Overwrites in place - no versioning at MVP. Rating is not settable here - see /api/recipes/:id/cook. |
| POST | /api/recipes/:id/cook | Called after deduction confirm/skip and rating submit/skip. Body: `{ rating: number \| null }`. Appends `{cooked_at: now, rating}` to `recipes.history` and recomputes `recipes.rating` as the average of non-null ratings. |
| GET | /api/recipes/history | Returns all recipes with at least one `history` entry, sorted by most recent `cooked_at` descending, for the Cooking History screen. |
| PATCH | /api/recipes/:id/history/:entryId | Updates the `rating` of a single `history` entry (add, change, or clear). Recomputes `recipes.rating` as the average of all non-null ratings afterward. |
| POST | /api/users/sync | Clerk webhook endpoint. Creates or updates user record in MongoDB on Clerk user.created / user.updated events. |


  Product Blueprint v2 · ---


  
## Open Questions & Risks

  
| Risk / Question | Severity | Mitigation |
|---|---|---|
| Gemini Flash Vision accuracy on Hebrew receipts | High | RTL text and abbreviated Hebrew product names may reduce extraction accuracy. Run batch test of 20–30 real Israeli supermarket receipts before committing. Manual correction screen is always available as fallback. |
| Pantry data staleness | High | Without post-cooking updates, pantry context decays and recipe quality degrades. The deduction confirmation screen is the primary mechanism. Consider a "pantry freshness" indicator on home screen showing days since last update. |
| AI recipe quality with sparse pantry | Medium | Fewer than 5 items produces poor/repetitive recipes. Soft warning implemented (AC-2.3). "Open mode" (no pantry restriction) always one tap away. |
| LLM-based URL recipe parsing reliability | Medium | JS-rendered pages and paywalls reduce success rate. Accept ~60–70% at MVP; manual fallback always available. Plan Jina.ai or similar scraper for Phase 2 if failure rate is high. |
| Gemini free-tier rate limits | Medium | Design AI calls behind a server-side abstraction layer so the underlying model can be swapped. Track call counts from day one. Budget for paid tier when usage warrants it. |
| Storage type not wired into expiry weighting | Medium | Frozen items should be weighted differently than fridge items with the same printed date. Define weighting logic in AI prompt assembly before dev begins. |
| Post-cooking deduction dismissed without updating | Medium | At MVP, pantry remains unchanged if user dismisses. No push reminder (Phase 2). Consider in-app banner on next open if deduction was skipped. |
| Clerk webhook reliability for user sync | Low | Clerk webhooks can fail. Make /api/users/sync idempotent. Consider lazy user creation in API middleware as fallback (create user row on first authenticated request if not exists). |


  Product Blueprint v2 · ---


  
## Out of Scope (MVP)

  
    - Guest mode / localStorage-backed sessions - available without auth; prompted to register after first recipe generated

    - Shopping list - deferred to Phase 2

    - Push notifications - deferred; in-app expiry indicators are sufficient for personal use

    - Multi-household / family sharing UI - DB is schema-ready via user_id; sharing UI is Phase 2

    - Cooking history analytics (e.g. "cooked 12 times this year," consumption pattern insights) - basic history log (last-cooked date, per-cook rating) is in MVP via `recipes.history`; deeper analytics on top of that data is Phase 2

    - Recipe version history - edits overwrite in place; parent_recipe_id chain deferred to Phase 2

    - Barcode scanning for individual product lookup - receipt scan covers bulk addition; per-item barcode requires Open Food Facts integration
- Single-product scan (camera photo or barcode, one item at a time or multi-item on countertop) - needs research before scoping: barcode lookup API choice, single-photo recognition accuracy, and whether multi-item-in-one-photo is feasible with Gemini Vision. Receipt scan already covers the primary "just bought groceries" case.
- Printed/manufacturer expiry date context (open vs. closed shelf life) - for items with a printed date (canned goods, packaged bread, dairy), real shelf life varies significantly based on whether the package is sealed or opened, and on storage location after opening. MVP storage suggestion gives a single generic estimate regardless of seal state. Phase 2 would add: an optional "printed expiry date" field separate from the actual tracked expiry date, AI guidance on how long the printed date remains valid (e.g. "valid while sealed; ~5 days after opening if refrigerated"), and possibly two expiry estimates (sealed vs. opened) for the user to choose between. Deferred due to the complexity of modeling open/closed state transitions per food type.
- Dish request (`dish_request`) - optional free-text field on the generation config screen letting the user name a specific dish they want to make ("לזניה", "פד תאי"). When present, the AI identifies core vs. substitutable ingredients for that dish, checks them against the pantry, and returns a structured response: missing core ingredients are surfaced explicitly (not silently swapped), substitutes are labeled with `original` + `substitutedWith`, and the Result screen shows three ingredient states (✅ matched, 🔄 substituted, ❌ must-buy). The recipe title carries a qualifier when substitutes were used ("לזניה - עם תחליפים"). `scope` is respected: if `scope=pantry-only` and core ingredients are missing, the AI surfaces the gap rather than expanding scope. Deferred to Phase 2: requires a different generation response shape and more complex Result screen UI; evaluate after baseline generation quality is established in production. `dish_request` and `substitutions_used` should be added to `recipes` schema and `ai_prompt_context` at that point.

    - Nutritional information / calorie tracking - out of product scope entirely

    - Meal planning calendar - significant UI complexity; natural Phase 2 extension

    - Native iOS / Android apps - PWA covers mobile use case for MVP

    - Community recipe discovery - AI generation and URL import cover recipe sourcing

    - Grocery delivery integration (Shufersal, Rami Levy) - Phase 2 partnership discussion

    - Monetization / freemium paywall - not in scope; architect recipe generation count as a server-side field from day one so paywall can be added later without migration

  

  
  
---


  
## Infrastructure Notes

  
    - All Gemini API calls are server-side only (Next.js API routes). The API key is never exposed to the client. AI provider abstracted behind a service layer so the underlying model can be swapped without client changes.

    - Clerk handles all auth flows. User data is synced to MongoDB via Clerk webhooks (user.created, user.updated). The sync endpoint must be idempotent.

    - Receipt images are sent over HTTPS, processed server-side by Gemini Vision, and not stored. Users are informed in scan UI that the image is processed and not retained.

    - PWA via next-pwa: service worker + web manifest. Installable on Android Chrome (primary target) and iOS Safari (requires "Add to Home Screen"). Push notifications not in scope at MVP - iOS limitation noted for Phase 2 planning.

    - Guest mode: pantry and recipe data stored in browser localStorage. On registration, /api/users/migrate-guest transfers local data to the server account. Migration is idempotent to handle partial failures.
    Product is Hebrew-language, Israel-market only at MVP. Single timezone (Asia/Jerusalem). No multi-timezone handling required.

    - Duplicate pantry item detection: exact-match on normalized name (lowercase, trim, strip punctuation). Fuzzy or embedding-based matching deferred to Phase 2.

    - Track recipe generation count per user as a server-side field from day one. Enables future freemium paywall without data migration.

    - MongoDB connection pooling: use Mongoose with connection caching pattern for Next.js API routes (reuse connection across invocations via global cache).