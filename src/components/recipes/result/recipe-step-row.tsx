import type { RecipeStep } from '@/types/recipe'

type RecipeStepRowProps = {
    step: RecipeStep
}

export const RecipeStepRow = ({ step }: RecipeStepRowProps) => (
    <div className={'flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5'}>
        <span className={'flex size-6.5 shrink-0 items-center justify-center rounded-full bg-green text-caption font-bold text-surface'}>
            {step.order}
        </span>
        <span className={'pt-0.5 text-label text-ink-2'}>
            {step.description}
        </span>
    </div>
)
