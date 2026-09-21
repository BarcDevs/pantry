import { recipesTexts } from '@/constants/texts/recipes'

type GenerateNoMatchNoticeProps = {
    isStrict: boolean
}

const texts = recipesTexts.generate

export const GenerateNoMatchNotice = ({
    isStrict
}: GenerateNoMatchNoticeProps) => {
    const hints = [
        texts.noMatchHints.enableAi,
        ...isStrict ? [texts.noMatchHints.flexibleMode] : [],
        texts.noMatchHints.addItems
    ]

    return (
        <div
            role={'status'}
            className={'flex flex-col gap-1.5 rounded-lg border border-warning-border bg-warning-bg p-2.75'}
        >
            <p className={'text-caption font-bold text-warning-fg'}>
                {texts.noMatchTitle}
            </p>
            <ul className={'flex flex-col gap-0.5 text-caption text-ink-3'}>
                {hints.map((hint) => (
                    <li key={hint}>
                        {hint}
                    </li>
                ))}
            </ul>
        </div>
    )
}
