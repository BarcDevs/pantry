import { useState } from 'react'

import type { Control } from 'react-hook-form'

import { SettingsProfileCard } from '@/components/settings/settings-profile-card'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Input } from '@/components/ui/input'

import type { SettingsFormValues } from '@/hooks/use-settings-form'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsProfileSectionProps = {
    control: Control<SettingsFormValues>
    displayName: string
    email: string
}

export const SettingsProfileSection = ({
    control,
    displayName,
    email
}: SettingsProfileSectionProps) => {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <FormInputField
                control={control}
                name={'displayName'}
                label={settingsTexts.profileNameLabel}
                render={(field) => <Input {...field}/>}
            />
        )
    }

    return (
        <SettingsProfileCard
            name={displayName}
            email={email}
            onEdit={() => setIsEditing(true)}
        />
    )
}
