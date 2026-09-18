import { useState } from 'react'

import { CheckIcon } from 'lucide-react'
import type { Control } from 'react-hook-form'

import { SettingsProfileCard } from '@/components/settings/settings-profile-card'
import { IconButton } from '@/components/shared/buttons/IconButton'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Input } from '@/components/shared/Input'

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
                render={(field) => (
                    <div className={'relative'}>
                        <Input
                            className={'pe-11'}
                            {...field}
                        />
                        <IconButton
                            aria-label={settingsTexts.profileDone}
                            onClick={() => setIsEditing(false)}
                            className={'absolute end-1 top-1/2 -translate-y-1/2'}
                        >
                            <CheckIcon className={'text-green'}/>
                        </IconButton>
                    </div>
                )}
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
