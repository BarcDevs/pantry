export const normalizeName = (name: string): string =>
    name
        .trim()
        .toLowerCase()
        .replace(/[.,!?;:'"()]/g, '')
        .replace(/\s+/g, ' ')
