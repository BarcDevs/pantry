type AuthHeadingProps = {
    title: string
    subtitle: string
}

export const AuthHeading = ({
    title,
    subtitle
}: AuthHeadingProps) => (
    <>
        <h1 className={'font-display font-extrabold text-title text-ink'}>
            {title}
        </h1>
        <p className={'mt-1.5 text-body text-ink-3'}>
            {subtitle}
        </p>
    </>
)
