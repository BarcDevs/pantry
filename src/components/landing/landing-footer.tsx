import Link from 'next/link'

import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.footer

const productLinks = [
    { href: '#features', label: landingTexts.nav.features },
    { href: '#how', label: landingTexts.nav.how },
    { href: '#recipes', label: landingTexts.nav.recipes }
]

const companyLinks = [
    { href: '#', label: texts.about },
    { href: '#faq', label: landingTexts.nav.faq },
    { href: '#', label: texts.contact }
]

const legalLinks = [
    { href: '#', label: texts.terms },
    { href: '#', label: texts.privacy }
]

export const LandingFooter = () => (
    <div className={'mx-auto max-w-(--breakpoint-xl) px-4 py-10 sm:py-14'}>
        <div className={'flex flex-wrap justify-between gap-10 border-b border-border-2 pb-7.5'}>
            <div className={'max-w-75'}>
                <div className={'mb-3.5 flex items-center gap-2.75'}>
                    <div className={'flex size-9 items-center justify-center rounded-[11px] bg-[image:var(--gradient-brand)]'}>
                        <span>
                            🥕
                        </span>
                    </div>
                    <span className={'font-display text-body font-weight-heading tracking-wide text-ink'}>
                        PANTRY
                    </span>
                </div>
                <p className={'text-label leading-relaxed text-ink-3'}>
                    {texts.tagline}
                </p>
            </div>
            <div className={'flex flex-wrap gap-10'}>
                <div className={'flex flex-col gap-2.75'}>
                    <div className={'mb-0.75 text-label font-bold text-ink'}>
                        {texts.productTitle}
                    </div>
                    {productLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={'text-label text-ink-2'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className={'flex flex-col gap-2.75'}>
                    <div className={'mb-0.75 text-label font-bold text-ink'}>
                        {texts.companyTitle}
                    </div>
                    {companyLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={'text-label text-ink-2'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className={'flex flex-col gap-2.75'}>
                    <div className={'mb-0.75 text-label font-bold text-ink'}>
                        {texts.legalTitle}
                    </div>
                    {legalLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={'text-label text-ink-2'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        <div className={'flex flex-wrap items-center justify-between gap-4 pt-5.5 text-label text-ink-4'}>
            <div>
                {texts.copyright}
            </div>
            <div className={'flex gap-4.5'}>
                {texts.social.map((label) => (
                    <Link
                        key={label}
                        href={'#'}
                        className={'text-ink-4'}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    </div>
)
