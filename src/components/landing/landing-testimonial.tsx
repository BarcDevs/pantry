import { landingTexts } from '@/constants/texts/landing'

const texts = landingTexts.testimonial

export const LandingTestimonial = () => (
    <div className={'mx-auto max-w-3xl px-4 py-16 text-center sm:py-22'}>
        <div className={'font-display text-4xl text-border-3'}>
            ”
        </div>
        <p className={'mt-1.5 text-xl leading-snug font-weight-heading font-display tracking-tight text-ink sm:text-2xl'}>
            {texts.quote}
        </p>
        <div className={'mt-6.5 flex items-center justify-center gap-3'}>
            <div className={'flex size-11.5 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] font-display font-weight-heading text-surface'}>
                {texts.initial}
            </div>
            <div className={'text-end'}>
                <div className={'text-body font-bold text-ink'}>
                    {texts.author}
                </div>
                <div className={'text-label text-ink-3'}>
                    {texts.role}
                </div>
            </div>
        </div>
    </div>
)
