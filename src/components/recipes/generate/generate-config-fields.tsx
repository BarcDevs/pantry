import type { Control } from 'react-hook-form'

import {
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES
} from '@/types/enums'

import { GenerateChipField } from '@/components/recipes/generate/generate-chip-field'
import { GenerateToggleField } from '@/components/recipes/generate/generate-toggle-field'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Input } from '@/components/ui/input'

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
        <FormInputField
            control={control}
            name={'mealCount'}
            label={texts.mealCountLabel}
            render={(field) => (
                <Input
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    type={'number'}
                    min={1}
                    value={field.value as number}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                />
            )}
        />
        <FormInputField
            control={control}
            name={'maxTime'}
            label={texts.maxTimeLabel}
            render={(field) => (
                <Input
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    type={'number'}
                    min={1}
                    value={field.value as number}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                />
            )}
        />
        <GenerateChipField
            control={control}
            name={'mealType'}
            label={texts.mealTypeLabel}
            values={MEAL_TYPES}
            optionLabels={texts.mealTypeOptions}
        />
        <GenerateChipField
            control={control}
            name={'scope'}
            label={texts.scopeLabel}
            values={RECIPE_SCOPES}
            optionLabels={texts.scopeOptions}
        />
        <GenerateToggleField
            control={control}
            name={'allowAiGeneration'}
            label={texts.allowAiGenerationLabel}
            trueLabel={texts.allowAiGenerationOptions.true}
            falseLabel={texts.allowAiGenerationOptions.false}
        />
        <GenerateChipField
            control={control}
            name={'matchStrictness'}
            label={texts.matchStrictnessLabel}
            values={MATCH_STRICTNESSES}
            optionLabels={texts.matchStrictnessOptions}
        />
        <FormInputField
            control={control}
            name={'customInstructions'}
            label={texts.customInstructionsLabel}
            render={(field) => (
                <Input
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    value={field.value as string}
                    onChange={field.onChange}
                    placeholder={texts.customInstructionsPlaceholder}
                />
            )}
        />
    </div>
)
