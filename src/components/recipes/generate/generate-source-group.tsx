import type { Control } from 'react-hook-form'

import {
    MATCH_STRICTNESSES,
    RECIPE_SCOPES
} from '@/types/enums'

import { GenerateChipField } from '@/components/recipes/generate/generate-chip-field'
import { GenerateToggleField } from '@/components/recipes/generate/generate-toggle-field'
import { FormField } from '@/components/ui/form'

import { recipesTexts } from '@/constants/texts/recipes'

import type { GenerateRecipeFormValues } from '@/schemas/generate-recipe-form'

type GenerateSourceGroupProps = {
    control: Control<GenerateRecipeFormValues>
}

const texts = recipesTexts.generate

export const GenerateSourceGroup = ({
    control
}: GenerateSourceGroupProps) => (
    <div className={'flex flex-col gap-4 rounded-lg border border-border-2 bg-surface p-4'}>
        <div className={'flex flex-col gap-1'}>
            <span className={'font-semibold text-body text-ink-2'}>
                {texts.sourceGroupTitle}
            </span>
            <span className={'text-caption text-ink-3'}>
                {texts.sourceGroupDescription}
            </span>
        </div>
        <GenerateChipField
            control={control}
            name={'scope'}
            label={texts.scopeLabel}
            values={RECIPE_SCOPES}
            optionLabels={texts.scopeOptions}
        />
        <div className={'border-t border-border pt-4'}>
            <GenerateToggleField
                control={control}
                name={'allowAiGeneration'}
                label={texts.allowAiGenerationLabel}
                trueLabel={texts.allowAiGenerationOptions.true}
                falseLabel={texts.allowAiGenerationOptions.false}
            />
            <FormField
                control={control}
                name={'allowAiGeneration'}
                render={({ field }) => (
                    <p className={'mt-2 text-caption text-ink-3'}>
                        {field.value
                            ? texts.allowAiGenerationHint.true
                            : texts.allowAiGenerationHint.false}
                    </p>
                )}
            />
        </div>
        <div className={'border-t border-border pt-4'}>
            <GenerateChipField
                control={control}
                name={'matchStrictness'}
                label={texts.matchStrictnessLabel}
                values={MATCH_STRICTNESSES}
                optionLabels={texts.matchStrictnessOptions}
            />
            <FormField
                control={control}
                name={'matchStrictness'}
                render={({ field }) => (
                    <p className={'mt-2 text-caption text-ink-3'}>
                        {field.value === 'strict'
                            ? texts.matchStrictnessHint.strict
                            : texts.matchStrictnessHint.flexible}
                    </p>
                )}
            />
        </div>
    </div>
)
