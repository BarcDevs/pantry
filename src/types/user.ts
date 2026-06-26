import type { Difficulty } from '@/types/enums'

export type UserDoc = {
    clerkId: string
    email: string
    displayName: string
    cookingLevel?: Difficulty
    householdSize?: number
    dietaryPreferences: string[]
    onboardingCompletedAt: Date | null
}
