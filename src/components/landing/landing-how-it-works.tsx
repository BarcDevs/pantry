import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.how

export const LandingHowItWorks = () => (
    <div
        id={'how'}
        className={'border-y border-border-2 bg-surface'}
    >
        <div className={'mx-auto max-w-(--breakpoint-xl) px-4 py-14 sm:py-20'}>
            <div className={'mx-auto mb-9 max-w-xl text-center sm:mb-13'}>
                <div className={'mb-3 text-label font-bold text-green'}>
                    {texts.eyebrow}
                </div>
                <h2 className={'text-3xl leading-tight font-weight-title font-display tracking-tight text-ink sm:text-4xl'}>
                    {texts.title}
                </h2>
            </div>
            <div className={'grid grid-cols-1 gap-6 sm:grid-cols-3'}>
                {texts.steps.map((step, index) => (
                    <div key={step.title}>
                        <div className={'mb-5 flex size-10 items-center justify-center rounded-full bg-green font-display text-heading font-weight-heading text-surface'}>
                            {index + 1}
                        </div>
                        <div className={'mb-2.25 font-display text-[22px] font-weight-title text-ink'}>
                            {step.title}
                        </div>
                        <p className={'text-body leading-relaxed text-ink-2'}>
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
