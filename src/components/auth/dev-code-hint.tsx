type DevCodeHintProps = {
    code?: string
}

export const DevCodeHint = ({ code }: DevCodeHintProps) => {
    if (!code || process.env.NODE_ENV === 'production') return null

    return (
        <p
            data-testid={'dev-verification-code'}
            className={'mb-4 text-center text-caption text-ink-4'}
        >
            {`[dev] ${code}`}
        </p>
    )
}
