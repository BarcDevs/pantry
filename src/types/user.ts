import type { MongoDbObject } from '@/types'
import type { Difficulty } from '@/types/enums'

export type UserDoc = {
    email: string
    displayName: string
    passwordHash: string | null
    emailVerifiedAt: Date | null
    verificationCode: string | null
    verificationCodeExpiresAt: Date | null
    cookingLevel?: Difficulty
    householdSize?: number
    dietaryPreferences: string[]
    onboardingCompletedAt: Date | null
}

export type User = UserDoc & MongoDbObject

export type OnboardingInput = {
    cookingLevel?: Difficulty
    householdSize?: number
    dietaryPreferences?: string[]
}

export type UserProfileInput = OnboardingInput & {
    displayName?: string
}

export type RecipePromptUserContext = {
    cookingLevel?: Difficulty
    householdSize?: number
    dietaryPreferences?: string[]
}
