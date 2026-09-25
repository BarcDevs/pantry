import Link from 'next/link'

import { routes } from '@/constants/routes'
import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.hero

export const LandingHero = () => (
    <div className={'mx-auto grid max-w-(--breakpoint-xl) items-center gap-9 px-4 py-10 md:grid-cols-2 md:py-16'}>
        <div>
            <div className={'mb-5.5 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1.75 pe-3.5 ps-3 text-label font-bold text-green'}>
                <span className={'size-1.75 rounded-full bg-green'}/>
                {texts.eyebrow}
            </div>
            <h1 className={'max-w-xl text-4xl leading-[1.1] font-weight-title font-display tracking-tight text-ink sm:text-5xl lg:text-6xl'}>
                {texts.titlePrefix}
                <span className={'text-green'}>
                    {texts.titleHighlight}
                </span>
                {texts.titleSuffix}
            </h1>
            <p className={'mt-5 max-w-md text-body leading-relaxed text-ink-2'}>
                {texts.subtitle}
            </p>
            <div className={'mt-7.5 flex flex-wrap items-center gap-3'}>
                <Link
                    href={routes.signUp}
                    className={'rounded-2xl bg-green px-6.5 py-3.75 text-body font-bold text-surface shadow-[0_12px_24px_-10px_rgba(63,125,78,0.85)]'}
                >
                    {texts.cta}
                </Link>
                <Link
                    href={'#how'}
                    className={'flex items-center gap-2.25 rounded-2xl border border-border bg-surface px-6 py-3.75 text-body font-bold text-ink'}
                >
                    {texts.secondaryCta}
                    <span className={'text-ink-3'}>
                        ←
                    </span>
                </Link>
            </div>
            <div className={'mt-5.5 flex flex-wrap items-center gap-4 text-label font-bold text-ink-3'}>
                {texts.trustPoints.map((point) => (
                    <span
                        key={point}
                        className={'flex items-center gap-1.5'}
                    >
                        <span className={'text-green'}>
                            ✓
                        </span>
                        {point}
                    </span>
                ))}
            </div>
        </div>
        <div className={'mx-auto grid w-full max-w-110 grid-cols-2 gap-3.5'}>
            {texts.collage.map((card, index) => (
                <div
                    key={card.title}
                    className={`rounded-2xl border border-border-2 bg-surface p-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)] ${index % 2 === 1 ? 'mt-6.5' : ''}`}
                >
                    <div className={'flex h-24 items-center justify-center rounded-[13px] bg-[image:var(--gradient-brand)] text-[42px]'}>
                        {card.emoji}
                    </div>
                    <div className={'mt-2.75 text-body font-bold text-ink'}>
                        {card.title}
                    </div>
                    <div className={card.matched ? 'mt-0.75 text-label font-bold text-green' : 'mt-0.75 text-label text-ink-3'}>
                        {card.meta}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
