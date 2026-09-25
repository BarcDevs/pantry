import Link from 'next/link'

import { routes } from '@/constants/routes'
import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.finalCta

export const LandingFinalCta = () => (
    <div className={'mx-auto max-w-(--breakpoint-xl) px-4'}>
        <div className={'relative overflow-hidden rounded-[30px] bg-[image:var(--gradient-brand)] px-6 py-13 text-center text-surface sm:py-16'}>
            <div className={'font-display text-3xl leading-tight font-weight-title tracking-tight sm:text-4xl'}>
                {texts.title}
            </div>
            <p className={'mx-auto mt-4 max-w-md text-body leading-relaxed text-surface/85'}>
                {texts.subtitle}
            </p>
            <div className={'mt-7.5 flex flex-wrap items-center justify-center gap-3'}>
                <Link
                    href={routes.signUp}
                    className={'rounded-2xl bg-surface px-7 py-3.75 text-body font-bold text-green-deep'}
                >
                    {texts.cta}
                </Link>
                <Link
                    href={'#how'}
                    className={'rounded-2xl border border-surface/30 bg-surface/10 px-6.5 py-3.75 text-body font-bold text-surface'}
                >
                    {texts.secondaryCta}
                </Link>
            </div>
        </div>
    </div>
)
