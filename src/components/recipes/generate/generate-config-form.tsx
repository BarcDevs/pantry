'use client'

import { ExpiredItemsGate } from '@/components/recipes/generate/expired-items-gate'
import { GenerateConfigFields } from '@/components/recipes/generate/generate-config-fields'
import { PantrySelectSheet } from '@/components/recipes/generate/pantry-select-sheet'
import { PantrySelectionSummary } from '@/components/recipes/generate/pantry-selection-summary'
import { SparsePantryWarning } from '@/components/recipes/generate/sparse-pantry-warning'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

import { useGenerateRecipeForm } from '@/hooks/use-generate-recipe-form'

import { recipesTexts } from '@/constants/texts/recipes'

export const GenerateConfigForm = () => {
    const {
        form,
        pantryItems,
        isLoadingPantry,
        selectedItemIds,
        toggleItem,
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

    return (
        <Form {...form}>
            <form
                onSubmit={submit}
                className={'flex flex-col gap-4'}
            >
                <GenerateConfigFields control={form.control}/>
                <PantrySelectionSummary
                    selectedCount={selectedItemIds.length}
                    onEdit={() => setIsPantrySheetOpen(true)}
                />
                {isSparsePantry && <SparsePantryWarning/>}
                {isExpiredGateOpen && (
                    <ExpiredItemsGate
                        expiredItems={expiredSelectedItems}
                        onRemoveExpired={removeExpiredFromSelection}
                        onContinueAnyway={acknowledgeExpired}
                    />
                )}
                <FormError errors={form.formState.errors}/>
                <Button
                    type={'submit'}
                    disabled={isSubmitting || isExpiredGateOpen || isLoadingPantry}
                    className={'w-full'}
                >
                    {isSubmitting ? texts.submitting : texts.submit}
                </Button>
                <PantrySelectSheet
                    open={isPantrySheetOpen}
                    onOpenChange={setIsPantrySheetOpen}
                    items={pantryItems}
                    selectedItemIds={selectedItemIds}
                    onToggleItem={toggleItem}
                />
            </form>
        </Form>
    )
}
