import { FoodType } from '@/types/enums'

export const foodTypeEmoji: Record<FoodType, string> = {
    [FoodType.Vegetables]: '🥦',
    [FoodType.Fruits]: '🍎',
    [FoodType.Dairy]: '🧀',
    [FoodType.Eggs]: '🥚',
    [FoodType.Meat]: '🍗',
    [FoodType.Fish]: '🐟',
    [FoodType.Canned]: '🥫',
    [FoodType.Grains]: '🍚',
    [FoodType.Snacks]: '🍿',
    [FoodType.Beverages]: '🥤',
    [FoodType.Condiments]: '🧂',
    [FoodType.Other]: '📦'
}
