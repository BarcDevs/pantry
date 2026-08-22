import { recipesTexts } from '@/constants/texts/recipes'

export const DeductHeader = () => (
    <div className={'mb-6.5 text-center'}>
        <div className={'mx-auto mb-4 flex size-18 items-center justify-center rounded-full bg-status-green-bg text-[34px]'}>
            {'🍽️'}
        </div>
        <div className={'font-display text-heading font-extrabold'}>
            {recipesTexts.deduct.title}
        </div>
        <div className={'mx-auto mt-1.5 max-w-xs text-body text-ink-3'}>
            {recipesTexts.deduct.description}
        </div>
    </div>
)
