import { landingTexts } from '@/constants/texts/landing'

export const LandingAnnouncement = () => (
    <div className={'bg-[image:var(--gradient-brand)] px-4 py-2.25 text-center text-caption font-bold text-surface'}>
        {landingTexts.announcement}
    </div>
)
