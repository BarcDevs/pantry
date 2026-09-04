'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/shared/Button'
import { DietaryPreferencesPicker } from '@/components/shared/DietaryPreferencesPicker'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

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
    const [isSaving, startSaving] = useTransition()
    const texts = recipesTexts.generate

    const handleSave = () => {
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
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen) setDraft(value)
                onOpenChange(nextOpen)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={'font-display text-heading font-bold text-ink'}>
                        {texts.dietaryPreferencesLabel}
                    </DialogTitle>
                </DialogHeader>
                <DietaryPreferencesPicker
                    value={draft}
                    onChange={setDraft}
                />
                <Button
                    disabled={isSaving}
                    onClick={handleSave}
                    className={'w-full'}
                >
                    {isSaving
                        ? settingsTexts.submitting
                        : texts.dietaryPreferencesSave}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
