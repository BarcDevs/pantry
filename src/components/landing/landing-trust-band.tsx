import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.trustBand

export const LandingTrustBand = () => (
    <div className={'mx-auto max-w-(--breakpoint-xl) px-4'}>
        <div className={'grid grid-cols-1 items-center gap-6 rounded-[22px] border border-border-2 bg-surface p-6.5 shadow-[0_3px_14px_-10px_rgba(0,0,0,0.2)] sm:grid-cols-2 lg:grid-cols-4'}>
            <div className={'text-body font-bold text-ink-2 lg:col-span-1'}>
                {texts.headline}
            </div>
            {texts.stats.map((stat) => (
                <div
                    key={stat.label}
                    className={'text-center'}
                >
                    <div className={'font-display text-title font-weight-title text-green'}>
                        {stat.value}
                    </div>
                    <div className={'mt-0.5 text-label font-bold text-ink-3'}>
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
