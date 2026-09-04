import { Switch } from '@/components/ui/switch'

type ToggleProps = {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    'aria-label': string
}

export const Toggle = ({
    checked,
    onCheckedChange,
    'aria-label': ariaLabel
}: ToggleProps) => (
    <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel}
        className={'data-[state=checked]:bg-green'}
    />
)
