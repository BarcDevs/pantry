import { useTransition } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import type { User } from '@/types/user'

import { userProfileFieldsSchema } from '@/lib/schemas/user-profile'

import { settingsTexts } from '@/constants/texts/settings'

import { updateUserProfile } from '@/actions/users/update-user-profile'

const settingsFormSchema = userProfileFieldsSchema.extend({
    displayName: z.string().trim().min(1).max(100)
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>

export const useSettingsForm = (user: User) => {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            displayName: user.displayName,
            cookingLevel: user.cookingLevel,
            householdSize: user.householdSize,
            dietaryPreferences: user.dietaryPreferences
        }
    })

    const [isSubmitting, startSubmitting] = useTransition()

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                await updateUserProfile(values)
                toast.success(settingsTexts.saveSuccess)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: settingsTexts.saveError
                })
                toast.error(settingsTexts.saveError)
            }
        })
    })

    return {
        form,
        isSubmitting,
        handleSubmit
    }
}
