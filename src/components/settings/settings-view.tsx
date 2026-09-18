'use client'

import type { User } from '@/types/user'

import { LogoutButton } from '@/components/settings/logout-button'
import { SettingsCookingLevelField } from '@/components/settings/settings-cooking-level-field'
import { SettingsDietaryPreferencesField } from '@/components/settings/settings-dietary-preferences-field'
import { SettingsHouseholdSizeField } from '@/components/settings/settings-household-size-field'
import { SettingsProfileSection } from '@/components/settings/settings-profile-section'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { Form } from '@/components/ui/form'

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
                <SettingsProfileSection
                    control={form.control}
                    displayName={form.watch('displayName') || user.displayName}
                    email={user.email}
                />
                <div className={'flex flex-col gap-1.5'}>
                    <span className={'px-1 text-label font-bold text-ink-3'}>
                        {settingsTexts.cookingPreferencesTitle}
                    </span>
                    <div className={'flex flex-col gap-5 rounded-lg border border-border-2 bg-surface p-4.5'}>
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
                    </div>
                </div>
                <FormError errors={form.formState.errors}/>
                <PrimaryButton
                    type={'submit'}
                    disabled={isSubmitting}
                    className={'w-full'}
                >
                    {isSubmitting
                        ? settingsTexts.submitting
                        : settingsTexts.submit}
                </PrimaryButton>
                <LogoutButton/>
            </form>
        </Form>
    )
}
