import type { MongoDbObject } from '@/types'
import type { Difficulty } from '@/types/enums'

export type ClerkUserData = {
    id: string
    email_addresses: Array<{ email_address: string }>
    first_name: string | null
    last_name: string | null
}

export type ClerkEvent =
    | {
          type: 'user.created' | 'user.updated'
          data: ClerkUserData
      }
    | {
          type: 'user.deleted'
          data: { id: string }
      }

export type UserDoc = {
    clerkId: string
    email: string
    displayName: string
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
