const parseBaseUrl = 'http://internal.invalid'
const backslash = '\\'
const lastControlCode = 31
const deleteCode = 127

const hasUnsafeCharacter = (value: string): boolean => (
    value.includes(backslash)
    || [...value].some((character) => {
        const code = character.charCodeAt(0)

        return code <= lastControlCode || code === deleteCode
    })
)

export const parseInternalPath = (
    value?: string
): string | undefined => {
    if (!value?.startsWith('/')) return undefined
    if (hasUnsafeCharacter(value)) return undefined

    try {
        const parsed = new URL(value, parseBaseUrl)

        if (parsed.origin !== parseBaseUrl) return undefined

        return `${parsed.pathname}${parsed.search}${parsed.hash}`
    } catch {
        return undefined
    }
}
