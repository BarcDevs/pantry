import { PantryIcon } from '@/components/icons/pantry-icon'

import { authTexts } from '@/constants/texts/auth'

import appConfig from '@/config/app'

export const AuthBrandPanel = () => (
    <div className={'relative flex flex-col justify-center overflow-hidden text-surface flex-none min-h-brand-min p-10 md:basis-[38%] md:grow-0 md:shrink-0 md:min-h-0 bg-brand-gradient'}>
        <div className={'absolute -left-15 -bottom-15 size-60 rounded-full bg-white/6'}/>
        <div className={'relative flex items-center gap-icon-gap mb-icon-mb'}>
            <div className={'flex items-center justify-center shrink-0 size-13 rounded-icon bg-white/16 border border-white/22'}>
                <PantryIcon/>
            </div>
            <span className={'font-display font-extrabold text-display'}>
                {appConfig.name.toUpperCase()}
            </span>
        </div>
        <p className={'relative max-w-tagline font-display font-extrabold text-display leading-tagline'}>
            {authTexts.brandTagline}
        </p>
        <p className={'relative mt-3.5 max-w-sub text-heading leading-sub text-surface/85'}>
            {authTexts.brandSub}
        </p>
    </div>
)
