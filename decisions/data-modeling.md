# Decisions — Data Modeling

⚠️ Load only when following a link from [[decisions/index]] for a specific entry, or scanning for
a lesson in this topic — not routinely.

---

## 11/07/2026 — Mongoose doc types get a shared `MongoDbObject` base

**Problem:** `PantryItemDoc` (and other Mongoose doc types) exposed `id` instead of `_id`, which
doesn't match what a real MongoDB fetch returns — a latent bug waiting to break at the first real
query.

**Decision:** introduce a shared `MongoDbObject` base type carrying only `_id`, and have every
Mongoose doc type extend it instead of redefining its own id field. Keep `*Doc` types
(`PantryItemDoc`, `UserDoc`) as pure schema-shape types, and add separate serialized types
(`PantryItem`, `User` — with `_id: string`) for what actions actually return to the client.

**Why over alternatives:** a one-off fix on `PantryItemDoc` alone would leave the same bug latent
in every other model. A single base type fixes the id-vs-`_id` confusion everywhere at once and
keeps schema types and serialized-return types cleanly separated.

**How to apply:** any new Mongoose model's doc type extends `MongoDbObject`; never redeclare `id`
or `_id` locally on a doc type.
