import { LandingFeatureCard } from '@/components/landing/landing-feature-card'

import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.features

export const LandingFeatures = () => (
    <div
        id={'features'}
        className={'mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:py-22'}
    >
        <div className={'mx-auto mb-10 max-w-xl text-center sm:mb-12'}>
            <div className={'mb-3 text-label font-bold text-green'}>
                {texts.eyebrow}
            </div>
            <h2 className={'text-3xl leading-tight font-weight-title font-display tracking-tight text-ink sm:text-4xl'}>
                {texts.title}
            </h2>
            <p className={'mt-3.5 text-body leading-relaxed text-ink-2'}>
                {texts.subtitle}
            </p>
        </div>
        <div className={'grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3'}>
            {texts.cards.map((card) => (
                <LandingFeatureCard
                    key={card.title}
                    emoji={card.emoji}
                    title={card.title}
                    description={card.description}
                    chips={'chips' in card ? [...card.chips] : undefined}
                />
            ))}
        </div>
    </div>
)
