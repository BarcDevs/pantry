type LeanDoc = {
    _id: {
        toString: () => string
    }
} & Record<string, unknown>

export const toPlainDoc = <T>(doc: LeanDoc): T => {
    const { _id, ...rest } = doc
    return { ...rest, _id: _id.toString() } as T
}
