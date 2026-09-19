import type { Control } from 'react-hook-form'

import { MEAL_TYPES } from '@/types/enums'

import { GenerateChipField } from '@/components/recipes/generate/generate-chip-field'
import { GenerateCountStepperField } from '@/components/recipes/generate/generate-count-stepper-field'
import { GenerateFieldCard } from '@/components/recipes/generate/generate-field-card'
import { GenerateTimePresetField } from '@/components/recipes/generate/generate-time-preset-field'

import { recipesTexts } from '@/constants/texts/recipes'

import type { GenerateRecipeFormValues } from '@/schemas/generate-recipe-form'

type GenerateConfigFieldsProps = {
    control: Control<GenerateRecipeFormValues>
}

const texts = recipesTexts.generate

export const GenerateConfigFields = ({
    control
}: GenerateConfigFieldsProps) => (
    <div className={'flex flex-col gap-4'}>
        <div className={'grid grid-cols-1 gap-3 md:grid-cols-3'}>
            <GenerateFieldCard>
                <GenerateCountStepperField
                    control={control}
                    name={'mealCount'}
                    label={texts.mealCountLabel}
                    unitLabel={texts.mealCountUnit}
                />
            </GenerateFieldCard>
            <GenerateFieldCard>
                <GenerateTimePresetField
                    control={control}
                    name={'maxTime'}
                    label={texts.maxTimeLabel}
                    presetSuffix={texts.maxTimePresetSuffix}
                    customLabel={texts.maxTimeCustomLabel}
                />
            </GenerateFieldCard>
            <GenerateFieldCard>
                <GenerateChipField
                    control={control}
                    name={'mealType'}
                    label={texts.mealTypeLabel}
                    values={MEAL_TYPES}
                    optionLabels={texts.mealTypeOptions}
                />
            </GenerateFieldCard>
        </div>
    </div>
)
