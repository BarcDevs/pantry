import { Button } from '@/components/shared/Button'

type SourceTabsProps = {
    tab: 'url' | 'text'
    urlLabel: string
    textLabel: string
    onChange: (tab: 'url' | 'text') => void
}

export const SourceTabs = ({
    tab,
    urlLabel,
    textLabel,
    onChange
}: SourceTabsProps) => (
    <div className={'flex gap-2'}>
        <Button
            type={'button'}
            variant={tab === 'url' ? 'default' : 'outline'}
            onClick={() => onChange('url')}
        >
            {urlLabel}
        </Button>
        <Button
            type={'button'}
            variant={tab === 'text' ? 'default' : 'outline'}
            onClick={() => onChange('text')}
        >
            {textLabel}
        </Button>
    </div>
)
