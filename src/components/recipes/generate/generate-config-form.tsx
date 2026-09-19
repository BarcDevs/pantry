'use client'

import { ExpiredItemsGate } from '@/components/recipes/generate/expired-items-gate'
import { GenerateConfigFields } from '@/components/recipes/generate/generate-config-fields'
import { GenerateDietarySummary } from '@/components/recipes/generate/generate-dietary-summary'
import { GenerateSourceGroup } from '@/components/recipes/generate/generate-source-group'
import { PantrySelectSheet } from '@/components/recipes/generate/pantry-select-sheet'
import { PantrySelectionSummary } from '@/components/recipes/generate/pantry-selection-summary'
import { SparsePantryWarning } from '@/components/recipes/generate/sparse-pantry-warning'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Input } from '@/components/shared/Input'
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

    return (
        <Form {...generateRecipe.form}>
            <form
                onSubmit={generateRecipe.submit}
                className={'flex flex-col gap-4'}
            >
                <GenerateConfigFields control={generateRecipe.form.control}/>
                <PantrySelectionSummary
                    selectedCount={generateRecipe.selectedItemIds.length}
                    totalCount={generateRecipe.pantryItems.length}
                    onEdit={() => generateRecipe.setIsPantrySheetOpen(true)}
                />
                {generateRecipe.isSparsePantry && scope !== 'open'
                    && <SparsePantryWarning/>}
                {generateRecipe.isExpiredGateOpen && (
                    <ExpiredItemsGate
                        expiredItems={generateRecipe.expiredSelectedItems}
                        onRemoveExpired={generateRecipe.removeExpiredFromSelection}
                        onContinueAnyway={generateRecipe.acknowledgeExpired}
                    />
                )}
                <GenerateSourceGroup control={generateRecipe.form.control}/>
                <GenerateDietarySummary dietaryPreferences={dietaryPreferences}/>
                <FormInputField
                    control={generateRecipe.form.control}
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
                <FormError errors={generateRecipe.form.formState.errors}/>
                <PrimaryButton
                    type={'submit'}
                    disabled={generateRecipe.isSubmitting
                        || generateRecipe.isExpiredGateOpen
                        || generateRecipe.isLoadingPantry}
                    className={'w-full'}
                >
                    {generateRecipe.isSubmitting ? texts.submitting : texts.submit}
                </PrimaryButton>
                <PantrySelectSheet
                    open={generateRecipe.isPantrySheetOpen}
                    onOpenChange={generateRecipe.setIsPantrySheetOpen}
                    items={generateRecipe.pantryItems}
                    selectedItemIds={generateRecipe.selectedItemIds}
                    onToggleItem={generateRecipe.toggleItem}
                    onToggleAll={generateRecipe.toggleAllItems}
                />
            </form>
        </Form>
    )
}
