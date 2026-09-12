import mongoose from 'mongoose'

import { DIFFICULTIES } from '@/types/enums'
import type { UserDoc } from '@/types/user'

const userSchema = new mongoose.Schema<UserDoc>(
    {
        email: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        passwordHash: { type: String, default: null },
        emailVerifiedAt: { type: Date, default: null },
        verificationCode: { type: String, default: null },
        verificationCodeExpiresAt: { type: Date, default: null },
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
