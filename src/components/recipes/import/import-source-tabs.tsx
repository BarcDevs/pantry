import { SourceTabs } from '@/components/shared/SourceTabs'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportSourceTabsProps = {
    tab: 'url' | 'text'
    onChange: (tab: 'url' | 'text') => void
}

export const ImportSourceTabs = ({
    tab,
    onChange
}: ImportSourceTabsProps) => (
    <SourceTabs
        tab={tab}
        urlLabel={recipesTexts.import.urlTab}
        textLabel={recipesTexts.import.textTab}
        onChange={onChange}
    />
)
