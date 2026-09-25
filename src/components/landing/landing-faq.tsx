import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.faq

export const LandingFaq = () => (
    <div
        id={'faq'}
        className={'mx-auto max-w-3xl px-4 py-16 sm:py-22'}
    >
        <div className={'mb-9 text-center sm:mb-11'}>
            <div className={'mb-3 text-label font-bold text-green'}>
                {texts.eyebrow}
            </div>
            <h2 className={'text-3xl leading-tight font-weight-title font-display tracking-tight text-ink sm:text-4xl'}>
                {texts.title}
            </h2>
        </div>
        <div className={'flex flex-col gap-3.25'}>
            {texts.items.map((item) => (
                <div
                    key={item.question}
                    className={'rounded-2xl border border-border-2 bg-surface px-5.5 py-5'}
                >
                    <div className={'mb-1.75 text-heading font-bold text-ink'}>
                        {item.question}
                    </div>
                    <div className={'text-label leading-relaxed text-ink-2'}>
                        {item.answer}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
