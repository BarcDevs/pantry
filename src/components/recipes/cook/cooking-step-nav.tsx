import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { recipesTexts } from '@/constants/texts/recipes'

type CookingStepNavProps = {
    stepIndex: number
    isLastStep: boolean
    onPrev: () => void
    onNext: () => void
}

export const CookingStepNav = ({
    stepIndex,
    isLastStep,
    onPrev,
    onNext
}: CookingStepNavProps) => (
    <div className={'mt-9 flex gap-3'}>
        <SecondaryButton
            onClick={onPrev}
            disabled={stepIndex === 0}
            className={'flex-1 border-surface/25 bg-transparent text-surface'}
        >
            {recipesTexts.cook.previous}
        </SecondaryButton>
        <PrimaryButton
            onClick={onNext}
            className={'flex-[2] bg-ember text-surface'}
        >
            {isLastStep ? recipesTexts.cook.finish : recipesTexts.cook.next}
        </PrimaryButton>
    </div>
)
