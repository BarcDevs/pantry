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
    const {
        form,
        pantryItems,
        isLoadingPantry,
        selectedItemIds,
        toggleItem,
        toggleAllItems,
        isPantrySheetOpen,
        setIsPantrySheetOpen,
        isSparsePantry,
        isExpiredGateOpen,
        expiredSelectedItems,
        removeExpiredFromSelection,
        acknowledgeExpired,
        isSubmitting,
        submit
    } = useGenerateRecipeForm()

    const texts = recipesTexts.generate
    const scope = form.watch('scope')

    return (
        <Form {...form}>
            <form
                onSubmit={submit}
                className={'flex flex-col gap-4'}
            >
                <GenerateConfigFields control={form.control}/>
                <PantrySelectionSummary
                    selectedCount={selectedItemIds.length}
                    totalCount={pantryItems.length}
                    onEdit={() => setIsPantrySheetOpen(true)}
                />
                {isSparsePantry && scope !== 'open' && <SparsePantryWarning/>}
                {isExpiredGateOpen && (
                    <ExpiredItemsGate
                        expiredItems={expiredSelectedItems}
                        onRemoveExpired={removeExpiredFromSelection}
                        onContinueAnyway={acknowledgeExpired}
                    />
                )}
                <GenerateSourceGroup control={form.control}/>
                <GenerateDietarySummary dietaryPreferences={dietaryPreferences}/>
                <FormInputField
                    control={form.control}
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
                <FormError errors={form.formState.errors}/>
                <PrimaryButton
                    type={'submit'}
                    disabled={isSubmitting || isExpiredGateOpen || isLoadingPantry}
                    className={'w-full'}
                >
                    {isSubmitting ? texts.submitting : texts.submit}
                </PrimaryButton>
                <PantrySelectSheet
                    open={isPantrySheetOpen}
                    onOpenChange={setIsPantrySheetOpen}
                    items={pantryItems}
                    selectedItemIds={selectedItemIds}
                    onToggleItem={toggleItem}
                    onToggleAll={toggleAllItems}
                />
            </form>
        </Form>
    )
}
