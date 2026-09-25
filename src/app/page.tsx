import { LandingAnnouncement } from '@/components/landing/landing-announcement'
import { LandingFaq } from '@/components/landing/landing-faq'
import { LandingFeatures } from '@/components/landing/landing-features'
import { LandingFinalCta } from '@/components/landing/landing-final-cta'
import { LandingFooter } from '@/components/landing/landing-footer'
import { LandingHero } from '@/components/landing/landing-hero'
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingRecipes } from '@/components/landing/landing-recipes'
import { LandingTestimonial } from '@/components/landing/landing-testimonial'
import { LandingTrustBand } from '@/components/landing/landing-trust-band'

const Home = () => (
    <div
        dir={'rtl'}
        className={'min-h-screen overflow-x-hidden bg-canvas text-ink'}
    >
        <LandingAnnouncement/>
        <LandingNav/>
        <LandingHero/>
        <LandingTrustBand/>
        <LandingFeatures/>
        <LandingHowItWorks/>
        <LandingRecipes/>
        <LandingTestimonial/>
        <LandingFaq/>
        <LandingFinalCta/>
        <LandingFooter/>
    </div>
)

export default Home
