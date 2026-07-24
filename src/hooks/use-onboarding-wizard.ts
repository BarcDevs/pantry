import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'

import type { SetState } from '@/types/react'

import {
    onboardingFormSchema,
    OnboardingFormValues
} from '@/lib/schemas/onboarding-form'

import { routes } from '@/constants/routes'
import { onboardingTexts } from '@/constants/texts/onboarding'

import { updateOnboarding } from '@/actions/users/update-onboarding'

const STEP_COUNT = onboardingTexts.stepLabels.length

const OnboardingField = {
    cookingLevel: 'cookingLevel',
    dietaryPreferences: 'dietaryPreferences',
    householdSize: 'householdSize'
} as const satisfies {
    [K in keyof OnboardingFormValues]: K
}

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

    const cookingLevel = useWatch({
        control: form.control,
        name: OnboardingField.cookingLevel
    })
    const dietaryPreferences = useWatch({
        control: form.control,
        name: OnboardingField.dietaryPreferences
    })
    const householdSize = useWatch({
        control: form.control,
        name: OnboardingField.householdSize
    })

    const setCookingLevel: SetState<
        OnboardingFormValues['cookingLevel']
    > = (action) => {
        form.setValue(
            OnboardingField.cookingLevel,
            action instanceof Function
                ? action(cookingLevel)
                : action
        )
    }

    const setDietaryPreferences: SetState<
        OnboardingFormValues['dietaryPreferences']
    > = (action) => {
        form.setValue(
            OnboardingField.dietaryPreferences,
            action instanceof Function
                ? action(dietaryPreferences)
                : action
        )
    }
    const setHouseholdSize: SetState<
        OnboardingFormValues['householdSize']
    > = (action) => {
        form.setValue(
            OnboardingField.householdSize,
            action instanceof Function
                ? action(householdSize)
                : action
        )
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
