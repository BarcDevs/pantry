import { z } from 'zod'

import { DIFFICULTIES } from '@/types/enums'

import { MAX_HOUSEHOLD_SIZE, MIN_HOUSEHOLD_SIZE } from '@/constants/onboarding'

export const userProfileFieldsSchema = z.object({
    cookingLevel: z.enum(DIFFICULTIES).optional(),
    householdSize: z.number().int()
        .min(MIN_HOUSEHOLD_SIZE).max(MAX_HOUSEHOLD_SIZE).optional(),
    dietaryPreferences: z.array(z.string().min(1).max(50)).max(10).optional()
})
