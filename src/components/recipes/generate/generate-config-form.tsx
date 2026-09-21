'use client'

import { ExpiredItemsGate } from '@/components/recipes/generate/expired-items-gate'
import { GenerateConfigFields } from '@/components/recipes/generate/generate-config-fields'
import { GenerateDietarySummary } from '@/components/recipes/generate/generate-dietary-summary'
import { GenerateDishField } from '@/components/recipes/generate/generate-dish-field'
import { GenerateNoMatchNotice } from '@/components/recipes/generate/generate-no-match-notice'
import { GenerateSourceGroup } from '@/components/recipes/generate/generate-source-group'
import { PantrySelectSheet } from '@/components/recipes/generate/pantry-select-sheet'
import { PantrySelectionSummary } from '@/components/recipes/generate/pantry-selection-summary'
import { SparsePantryWarning } from '@/components/recipes/generate/sparse-pantry-warning'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

import { useGenerateRecipeForm } from '@/hooks/use-generate-recipe-form'

import { recipesTexts } from '@/constants/texts/recipes'

type GenerateConfigFormProps = {
    dietaryPreferences: string[]
}

export const GenerateConfigForm = ({
    dietaryPreferences
}: GenerateConfigFormProps) => {
    const generateRecipe = useGenerateRecipeForm()

    const texts = recipesTexts.generate
    const scope = generateRecipe.form.watch('scope')
    const matchStrictness = generateRecipe.form.watch('matchStrictness')

    return (
        <Form {...generateRecipe.form}>
            <form
                onSubmit={generateRecipe.submission.submit}
                className={'flex flex-col gap-4'}
            >
                <GenerateConfigFields control={generateRecipe.form.control}/>
                <PantrySelectionSummary
                    selectedCount={generateRecipe.pantry.selectedIds.length}
                    totalCount={generateRecipe.pantry.items.length}
                    onEdit={() => generateRecipe.pantry.setIsSheetOpen(true)}
                />
                {generateRecipe.pantry.isSparse && scope !== 'open'
                    && <SparsePantryWarning/>}
                {generateRecipe.expired.isGateOpen && (
                    <ExpiredItemsGate
                        expiredItems={generateRecipe.expired.items}
                        onRemoveExpired={generateRecipe.expired.removeFromSelection}
                        onContinueAnyway={generateRecipe.expired.acknowledge}
                    />
                )}
                <GenerateSourceGroup control={generateRecipe.form.control}/>
                <GenerateDietarySummary dietaryPreferences={dietaryPreferences}/>
                <GenerateDishField control={generateRecipe.form.control}/>
                <FormError errors={generateRecipe.form.formState.errors}/>
                {generateRecipe.noMatch.isShown && (
                    <GenerateNoMatchNotice isStrict={matchStrictness === 'strict'}/>
                )}
                <PrimaryButton
                    type={'submit'}
                    disabled={generateRecipe.submission.isSubmitting
                        || generateRecipe.expired.isGateOpen
                        || generateRecipe.pantry.isLoading}
                    className={'w-full'}
                >
                    {generateRecipe.submission.isSubmitting ? texts.submitting : texts.submit}
                </PrimaryButton>
                <PantrySelectSheet
                    open={generateRecipe.pantry.isSheetOpen}
                    onOpenChange={generateRecipe.pantry.setIsSheetOpen}
                    items={generateRecipe.pantry.items}
                    selectedItemIds={generateRecipe.pantry.selectedIds}
                    onToggleItem={generateRecipe.pantry.toggleItem}
                    onToggleAll={generateRecipe.pantry.toggleAll}
                />
            </form>
        </Form>
    )
}
