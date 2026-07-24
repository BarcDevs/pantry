import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { DIFFICULTIES } from '@/types/enums'
import type { SetState } from '@/types/react'

import { MAX_HOUSEHOLD_SIZE, MIN_HOUSEHOLD_SIZE } from '@/constants/onboarding'
import { routes } from '@/constants/routes'
import { onboardingTexts } from '@/constants/texts/onboarding'

import { updateOnboarding } from '@/actions/users/update-onboarding'

const STEP_COUNT = onboardingTexts.stepLabels.length

const onboardingFormSchema = z.object({
    cookingLevel: z.enum(DIFFICULTIES).optional(),
    dietaryPreferences: z.array(z.string()).max(10),
    householdSize: z.number().int()
        .min(MIN_HOUSEHOLD_SIZE).max(MAX_HOUSEHOLD_SIZE).optional()
})

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>

export const useOnboardingWizard = () => {
    const router = useRouter()

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingFormSchema),
        defaultValues: {
            cookingLevel: undefined,
            dietaryPreferences: [],
            householdSize: undefined
        }
    })

    const [step, setStep] = useState(0)
    const [isSubmitting, startSubmitting] = useTransition()

    const isLastStep = step === STEP_COUNT - 1

    const finish = (values: OnboardingFormValues) => {
        startSubmitting(async () => {
            try {
                await updateOnboarding(values)
                router.push(routes.pantry)
            } catch {
                toast.error(onboardingTexts.saveError)
            }
        })
    }

    const advance = () => (
        isLastStep
            ? form.handleSubmit(finish)()
            : setStep(step + 1)
    )
    const goBack = () => (
        setStep(Math.max(0, step - 1))
    )
    const skipAll = () => finish(form.getValues())

    const cookingLevel = form.watch('cookingLevel')
    const dietaryPreferences = form.watch('dietaryPreferences')
    const householdSize = form.watch('householdSize')

    const setCookingLevel: SetState<OnboardingFormValues['cookingLevel']> = (action) => {
        form.setValue('cookingLevel', action instanceof Function ? action(cookingLevel) : action)
    }
    const setDietaryPreferences: SetState<OnboardingFormValues['dietaryPreferences']> = (action) => {
        form.setValue('dietaryPreferences', action instanceof Function ? action(dietaryPreferences) : action)
    }
    const setHouseholdSize: SetState<OnboardingFormValues['householdSize']> = (action) => {
        form.setValue('householdSize', action instanceof Function ? action(householdSize) : action)
    }

    return {
        step,
        isLastStep,
        isSubmitting,
        advance,
        goBack,
        skipAll,
        cookingLevel,
        setCookingLevel,
        dietaryPreferences,
        setDietaryPreferences,
        householdSize,
        setHouseholdSize
    }
}
