import { Button } from '@/components/shared/Button'

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
        <Button
            variant={'outline'}
            onClick={onPrev}
            disabled={stepIndex === 0}
            className={'flex-1 border-surface/25 bg-transparent text-surface'}
        >
            {recipesTexts.cook.previous}
        </Button>
        <Button
            onClick={onNext}
            className={'flex-[2] bg-saffron text-ink'}
        >
            {isLastStep ? recipesTexts.cook.finish : recipesTexts.cook.next}
        </Button>
    </div>
)
