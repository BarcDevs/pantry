import { TextButton } from '@/components/shared/buttons/TextButton'

import { settingsTexts } from '@/constants/texts/settings'

type SettingsProfileCardProps = {
    name: string
    email: string
    onEdit: () => void
}

export const SettingsProfileCard = ({
    name,
    email,
    onEdit
}: SettingsProfileCardProps) => (
    <div className={'flex items-center gap-3.5 rounded-lg border border-border-2 bg-surface p-4.5'}>
        <div className={'flex size-13.5 shrink-0 items-center justify-center rounded-full bg-ember text-heading font-bold text-surface'}>
            {name.charAt(0)}
        </div>
        <div className={'flex-1'}>
            <div className={'text-heading font-bold text-ink'}>
                {name}
            </div>
            <div
                dir={'ltr'}
                className={'text-right text-label text-ink-3'}
            >
                {email}
            </div>
        </div>
        <TextButton
            onClick={onEdit}
            className={'text-body'}
        >
            {settingsTexts.profileEdit}
        </TextButton>
    </div>
)
