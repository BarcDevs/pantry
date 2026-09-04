import { useState } from 'react'

import type { KeyboardEvent } from 'react'

import { SelectableOption } from '@/components/shared/SelectableOption'
import { Input } from '@/components/ui/input'

import { onboardingTexts } from '@/constants/texts/onboarding'

type AddCustomDietaryFieldProps = {
    disabled: boolean
    onAdd: (value: string) => void
}

export const AddCustomDietaryField = ({
    disabled,
    onAdd
}: AddCustomDietaryFieldProps) => {
    const [isAdding, setIsAdding] = useState(false)
    const [draft, setDraft] = useState('')

    const submit = () => {
        const trimmed = draft.trim()
        setDraft('')
        setIsAdding(false)
        if (trimmed) onAdd(trimmed)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            submit()
        }
        if (event.key === 'Escape') {
            setDraft('')
            setIsAdding(false)
        }
    }

    if (disabled) return null

    return isAdding
        ? (
            <Input
                autoFocus
                maxLength={50}
                value={draft}
                placeholder={onboardingTexts.dietaryCustomPlaceholder}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={submit}
                className={'h-auto w-40 rounded-full px-4 py-2.75 text-label'}
            />
        )
        : (
            <SelectableOption
                variant={'chip'}
                emoji={'✚'}
                label={onboardingTexts.dietaryCustomAdd}
                isSelected={false}
                onSelect={() => setIsAdding(true)}
            />
        )
}
