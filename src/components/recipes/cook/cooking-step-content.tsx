import type { RecipeStep } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

type CookingStepContentProps = {
    step: RecipeStep
}

export const CookingStepContent = ({
    step
}: CookingStepContentProps) => (
    <div className={'flex flex-1 flex-col justify-center'}>
        <div className={'mb-3.5 text-body font-bold text-ember'}>
            {`${recipesTexts.cook.stepLabel} ${step.order}`}
        </div>
        <div className={'text-body leading-relaxed text-surface/85'}>
            {step.description}
        </div>
    </div>
)
