import type { RecipeStep } from '@/types/recipe'

import { RecipeStepRow } from '@/components/recipes/result/recipe-step-row'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeStepsListProps = {
    steps: RecipeStep[]
}

export const RecipeStepsList = ({ steps }: RecipeStepsListProps) => (
    <div>
        <div className={'mb-3 font-display text-heading font-weight-heading text-ink'}>
            {recipesTexts.result.stepsTitle}
        </div>
        <div className={'flex flex-col gap-2.5'}>
            {steps.map((step) => (
                <RecipeStepRow
                    key={step.order}
                    step={step}
                />
            ))}
        </div>
    </div>
)
