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

        startSubmitting(async () => {
            try {
                const recipe = await generateRecipe({
                    ...values,
                    customInstructions: (
                        values.customInstructions.trim() || undefined
                    ),
                    selectedItemIds
                })
                saveGeneratedRecipe(recipe)
                router.push(routes.generateResult)
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.generate.generateError)
            }
        })
    })

    return {
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
        acknowledgeExpired: () => setAcknowledgedExpiredIds(
            expiredSelectedItems.map((item) => item._id)
        ),
        isSubmitting,
        submit
    }
}
