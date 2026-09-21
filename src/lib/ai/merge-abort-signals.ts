export const mergeAbortSignals = (
    options: {
        timeoutMs?: number
        signal?: AbortSignal
    }
): AbortSignal | undefined => {
    const signals = [
        options.timeoutMs === undefined
            ? undefined
            : AbortSignal.timeout(options.timeoutMs),
        options.signal
    ].filter((signal): signal is AbortSignal => signal !== undefined)
    return signals.length === 0
        ? undefined
        : AbortSignal.any(signals)
}
