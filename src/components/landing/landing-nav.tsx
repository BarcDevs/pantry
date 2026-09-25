import Link from 'next/link'

import { routes } from '@/constants/routes'
import { landingTexts } from '@/constants/texts/landing'

const navLinks = [
    { href: '#features', label: landingTexts.nav.features },
    { href: '#how', label: landingTexts.nav.how },
    { href: '#recipes', label: landingTexts.nav.recipes },
    { href: '#faq', label: landingTexts.nav.faq }
]

export const LandingNav = () => (
    <div className={'sticky top-0 z-50 border-b border-border-2 bg-canvas/85 backdrop-blur-md'}>
        <div className={'mx-auto flex max-w-(--breakpoint-xl) items-center justify-between gap-4 px-4 py-3'}>
            <div className={'flex items-center gap-2.75'}>
                <div className={'flex size-9.5 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)]'}>
                    <span className={'text-heading'}>
                        🥕
                    </span>
                </div>
                <span className={'font-display text-heading font-weight-heading tracking-wide text-ink'}>
                    PANTRY
                </span>
            </div>
            <div className={'hidden items-center gap-7.5 md:flex'}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={'text-label font-bold text-ink-2'}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className={'flex items-center gap-3'}>
                <Link
                    href={routes.signIn}
                    className={'hidden text-label font-bold text-ink sm:block'}
                >
                    {landingTexts.nav.login}
                </Link>
                <Link
                    href={routes.signUp}
                    className={'rounded-xl bg-green px-4 py-2.5 text-label font-bold whitespace-nowrap text-surface shadow-[0_8px_18px_-10px_rgba(63,125,78,0.9)]'}
                >
                    {landingTexts.nav.cta}
                </Link>
            </div>
        </div>
    </div>
)
