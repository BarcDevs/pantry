import mongoose from 'mongoose'

import { DIFFICULTIES } from '@/types/enums'
import type { UserDoc } from '@/types/user'

const userSchema = new mongoose.Schema<UserDoc>(
    {
        clerkId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        displayName: { type: String, required: true },
        cookingLevel: { type: String, enum: DIFFICULTIES },
        householdSize: { type: Number },
        dietaryPreferences: { type: [String], default: [] },
        onboardingCompletedAt: { type: Date, default: null }
    },
    { timestamps: true }
)

export const UserModel
    = (mongoose.models.User as mongoose.Model<UserDoc>)
    ?? mongoose.model<UserDoc>('User', userSchema)
