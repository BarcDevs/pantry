'use client'

import type { User } from '@/types/user'

import { LogoutButton } from '@/components/settings/logout-button'
import { SettingsCookingLevelField } from '@/components/settings/settings-cooking-level-field'
import { SettingsDietaryPreferencesField } from '@/components/settings/settings-dietary-preferences-field'
import { SettingsHouseholdSizeField } from '@/components/settings/settings-household-size-field'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useSettingsForm } from '@/hooks/use-settings-form'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsViewProps = {
    user: User
}

export const SettingsView = ({ user }: SettingsViewProps) => {
    const {
        form,
        isSubmitting,
        handleSubmit
    } = useSettingsForm(user)

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit}
                className={'flex flex-col gap-6'}
            >
                <FormInputField
                    control={form.control}
                    name={'displayName'}
                    label={settingsTexts.profileNameLabel}
                    render={(field) => <Input {...field}/>}
                />
                <SettingsCookingLevelField
                    value={form.watch('cookingLevel')}
                    onChange={(level) => form.setValue('cookingLevel', level)}
                />
                <SettingsHouseholdSizeField
                    value={form.watch('householdSize')}
                    onChange={(size) => form.setValue('householdSize', size)}
                />
                <SettingsDietaryPreferencesField
                    value={form.watch('dietaryPreferences') ?? []}
                    onChange={(value) => form.setValue('dietaryPreferences', value)}
                />
                <FormError errors={form.formState.errors}/>
                <Button
                    type={'submit'}
                    disabled={isSubmitting}
                    className={'w-full'}
                >
                    {isSubmitting
                        ? settingsTexts.submitting
                        : settingsTexts.submit}
                </Button>
                <LogoutButton/>
            </form>
        </Form>
    )
}
