import type { DietaryOptionKey } from '@/components/onboarding/dietary-preference-chip'

import { onboardingTexts } from '@/constants/texts/onboarding'

export const dietaryOptionKeys = Object.keys(
    onboardingTexts.dietaryOptions
) as DietaryOptionKey[]

export const toggleDietaryPreference = (list: string[], option: string) =>
    list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option]
