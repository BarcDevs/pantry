import Link from 'next/link'

import { LandingRecipeCard } from '@/components/landing/landing-recipe-card'

import { routes } from '@/constants/routes'
import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.recipes

export const LandingRecipes = () => (
    <div
        id={'recipes'}
        className={'mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:py-22'}
    >
        <div className={'mb-9 flex flex-wrap items-end justify-between gap-6'}>
            <div className={'max-w-xl'}>
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
            <Link
                href={routes.signUp}
                className={'rounded-[13px] border border-border bg-surface px-5 py-3 text-label font-bold whitespace-nowrap text-ink'}
            >
                {texts.cta}
            </Link>
        </div>
        <div className={'grid grid-cols-2 gap-4.5 lg:grid-cols-4'}>
            {texts.cards.map((card) => (
                <LandingRecipeCard
                    key={card.title}
                    emoji={card.emoji}
                    title={card.title}
                    meta={card.meta}
                    matched={card.matched}
                />
            ))}
        </div>
    </div>
)
