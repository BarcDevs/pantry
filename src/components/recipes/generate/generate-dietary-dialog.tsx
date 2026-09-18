'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { AppDialog } from '@/components/shared/AppDialog'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { DietaryPreferencesPicker } from '@/components/shared/DietaryPreferencesPicker'
import { LabeledCheckbox } from '@/components/shared/LabeledCheckbox'

import { recipesTexts } from '@/constants/texts/recipes'
import { settingsTexts } from '@/constants/texts/settings'

import { updateUserProfile } from '@/actions/users/update-user-profile'

type GenerateDietaryDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    value: string[]
    onSaved: (value: string[]) => void
}

export const GenerateDietaryDialog = ({
    open,
    onOpenChange,
    value,
    onSaved
}: GenerateDietaryDialogProps) => {
    const [draft, setDraft] = useState(value)
    const [saveToProfile, setSaveToProfile] = useState(true)
    const [isSaving, startSaving] = useTransition()
    const texts = recipesTexts.generate

    const handleSave = () => {
        if (!saveToProfile) {
            onSaved(draft)
            onOpenChange(false)
            return
        }

        startSaving(async () => {
            try {
                await updateUserProfile({ dietaryPreferences: draft })
                onSaved(draft)
                onOpenChange(false)
            } catch (error) {
                console.error(error)
                toast.error(settingsTexts.saveError)
            }
        })
    }

    return (
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen) setDraft(value)
                onOpenChange(nextOpen)
            }}
            title={texts.dietaryPreferencesLabel}
        >
            <DietaryPreferencesPicker
                value={draft}
                onChange={setDraft}
            />
            <LabeledCheckbox
                checked={saveToProfile}
                onCheckedChange={setSaveToProfile}
                label={texts.dietaryPreferencesSaveToProfile}
            />
            <PrimaryButton
                disabled={isSaving}
                onClick={handleSave}
                className={'w-full'}
            >
                {isSaving
                    ? settingsTexts.submitting
                    : texts.dietaryPreferencesSave}
            </PrimaryButton>
        </AppDialog>
    )
}
