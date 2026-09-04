type LeanDoc = {
    _id: {
        toString: () => string
    }
} & Record<string, unknown>

const isObjectIdLike = (value: unknown): value is { toString: () => string } => (
    value !== null && typeof value === 'object' && '_bsontype' in value
    && (value as { _bsontype: unknown })._bsontype === 'ObjectId'
)

// Subdocuments in arrays (e.g. recipe ingredients[]/steps[]) get their own
// auto _id from Mongoose - stringify it so no BSON ObjectId instance leaks
// into a client-component prop. Only touches plain-object array items.
const stringifySubdocIds = (value: unknown): unknown => {
    if (!Array.isArray(value)) return value
    return value.map((item) => {
        if (item === null || typeof item !== 'object' || !('_id' in item)) return item
        const { _id, ...rest } = item as { _id: unknown } & Record<string, unknown>
        return isObjectIdLike(_id) ? { ...rest, _id: _id.toString() } : item
    })
}

export const toPlainDoc = <T>(doc: LeanDoc): T => {
    const { _id, ...rest } = doc
    const plain: Record<string, unknown> = { ...rest, _id: _id.toString() }
    for (const [key, value] of Object.entries(plain)) {
        plain[key] = stringifySubdocIds(value)
    }
    return plain as T
}
