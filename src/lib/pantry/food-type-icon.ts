import { FoodType } from '@/types/enums'

import { foodTypeEmoji } from '@/constants/food-type-emoji'

export const getFoodTypeIcon = (type: FoodType | null): string => (
    foodTypeEmoji[type ?? FoodType.Other]
)
