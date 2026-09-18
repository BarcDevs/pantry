import { ChipButton } from '@/components/shared/buttons/ChipButton'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportSourceTabsProps = {
    tab: 'url' | 'text'
    onChange: (tab: 'url' | 'text') => void
}

const segClass = (active: boolean) => cn(
    'flex-1 rounded-md border py-3',
    active
        ? 'border-2 border-green bg-[#eef5ef] font-bold text-green-deep'
        : 'border-border bg-surface font-medium text-ink-2'
)

export const ImportSourceTabs = ({
    tab,
    onChange
}: ImportSourceTabsProps) => (
    <div className={'mb-4.5 flex gap-2.25'}>
        <ChipButton
            isSelected={tab === 'url'}
            onClick={() => onChange('url')}
            className={segClass(tab === 'url')}
        >
            {recipesTexts.import.urlTab}
        </ChipButton>
        <ChipButton
            isSelected={tab === 'text'}
            onClick={() => onChange('text')}
            className={segClass(tab === 'text')}
        >
            {recipesTexts.import.textTab}
        </ChipButton>
    </div>
)
