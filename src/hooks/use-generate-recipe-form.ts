import {
    useEffect,
    useMemo,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'

import {
    MatchStrictness,
    MealType,
    RecipeScope
} from '@/types/enums'
import type { PantryItem } from '@/types/pantry-item'

import { saveGeneratedRecipe } from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { getPantryItems } from '@/actions/pantry/get-pantry-items'
import { generateRecipe } from '@/actions/recipes/generate-recipe'
import {
    generateRecipeFormSchema,
    type GenerateRecipeFormValues
} from '@/schemas/generate-recipe-form'

const sparsePantryThreshold = 5

export const useGenerateRecipeForm = () => {
    const router = useRouter()

    const form = useForm<GenerateRecipeFormValues>({
        resolver: zodResolver(generateRecipeFormSchema),
        defaultValues: {
            mealCount: 2,
            maxTime: 30,
            mealType: MealType.Dinner,
            scope: RecipeScope.PantryFirst,
            allowAiGeneration: true,
            matchStrictness: MatchStrictness.Flexible,
            customInstructions: ''
        }
    })

    const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
    const [isLoadingPantry, startLoadingPantry] = useTransition()
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
    const [acknowledgedExpiredIds, setAcknowledgedExpiredIds] = (
        useState<string[]>([])
    )
    const [isSubmitting, startSubmitting] = useTransition()
    const [isPantrySheetOpen, setIsPantrySheetOpen] = useState(false)
    const [noMatchDish, setNoMatchDish] = useState<string>()

    useEffect(() => {
        startLoadingPantry(async () => {
            try {
                const items = await getPantryItems()
                setPantryItems(items)
                setSelectedItemIds(items.map((item) => item._id))
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.generate.pantryLoadError)
            }
        })
    }, [])

    const selectedItems = useMemo(
        () => pantryItems.filter(
            (item) => selectedItemIds.includes(item._id)
        ),
        [pantryItems, selectedItemIds]
    )

    const expiredSelectedItems = useMemo(() => {
        const now = new Date()
        return selectedItems.filter(
            (item) => item.expiryDate
                && new Date(item.expiryDate) < now
        )
    }, [selectedItems])

    const isExpiredGateOpen = expiredSelectedItems.some(
        (item) => !acknowledgedExpiredIds.includes(item._id)
    )
    const isSparsePantry = (
        selectedItemIds.length < sparsePantryThreshold
    )

    const toggleItem = (itemId: string) => {
        setSelectedItemIds((current) => (
            current.includes(itemId)
                ? current.filter((id) => id !== itemId)
                : [...current, itemId]
        ))
    }

    const toggleAllItems = () => {
        setSelectedItemIds((current) => (
            current.length === pantryItems.length
                ? []
                : pantryItems.map((item) => item._id)
        ))
    }

    const removeExpiredFromSelection = () => {
        const expiredIds = expiredSelectedItems.map(
            (item) => item._id
        )
        setSelectedItemIds((current) => current.filter(
            (id) => !expiredIds.includes(id)
        ))
    }

    const submit = form.handleSubmit((values) => {
        if (isExpiredGateOpen) return

        const dish = values.customInstructions.trim() || undefined

        setNoMatchDish(undefined)
        startSubmitting(async () => {
            try {
                const request = {
                    ...values,
                    customInstructions: dish,
                    selectedItemIds
                }
                const result = await generateRecipe(request)
                if (result.status === 'found') {
                    saveGeneratedRecipe(result.recipe, {
                        request,
                        shownUrls: result.recipe.sourceUrl
                            ? [result.recipe.sourceUrl]
                            : []
                    })
                    router.push(routes.generateResult)
                    return
                }
                if (result.reason === 'not-found') setNoMatchDish(dish ?? '')
                else toast.error(recipesTexts.generate.generateError)
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.generate.generateError)
            }
        })
    })

    return {
        form,
        pantry: {
            items: pantryItems,
            isLoading: isLoadingPantry,
            selectedIds: selectedItemIds,
            isSparse: isSparsePantry,
            toggleItem,
            toggleAll: toggleAllItems,
            isSheetOpen: isPantrySheetOpen,
            setIsSheetOpen: setIsPantrySheetOpen
        },
        expired: {
            items: expiredSelectedItems,
            isGateOpen: isExpiredGateOpen,
            removeFromSelection: removeExpiredFromSelection,
            acknowledge: () => setAcknowledgedExpiredIds(
                expiredSelectedItems.map((item) => item._id)
            )
        },
        submission: {
            isSubmitting,
            submit
        },
        noMatch: {
            isOpen: noMatchDish !== undefined,
            dish: noMatchDish ?? '',
            close: () => setNoMatchDish(undefined),
            enableAiAndRetry: () => {
                setNoMatchDish(undefined)
                form.setValue('allowAiGeneration', true)
                void submit()
            }
        }
    }
}
