type DevCodeHintProps = {
    code?: string
}

export const DevCodeHint = ({ code }: DevCodeHintProps) => {
    if (!code) return null

    return (
        <p
            data-testid={'dev-verification-code'}
            className={'mb-4 text-center text-caption text-ink-4'}
        >
            {`[dev] ${code}`}
        </p>
    )
}
