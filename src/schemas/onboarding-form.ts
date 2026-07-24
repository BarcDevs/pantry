import { z } from 'zod'

import { DIFFICULTIES } from '@/types/enums'

import {
    MAX_HOUSEHOLD_SIZE,
    MIN_HOUSEHOLD_SIZE
} from '@/constants/onboarding'

export const onboardingFormSchema = z.object({
    cookingLevel: z.enum(DIFFICULTIES).optional(),
    dietaryPreferences: z.array(z.string()).max(10),
    householdSize: z.number().int()
        .min(MIN_HOUSEHOLD_SIZE)
        .max(MAX_HOUSEHOLD_SIZE)
        .optional()
})

export type OnboardingFormValues
    = z.infer<typeof onboardingFormSchema>
