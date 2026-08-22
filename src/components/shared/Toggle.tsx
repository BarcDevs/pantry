import { cn } from '@/lib/utils'

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
    <button
        type={'button'}
        role={'switch'}
        aria-checked={checked}
        aria-label={ariaLabel}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
            'relative h-6.5 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
            checked ? 'bg-green' : 'bg-track'
        )}
    >
        <span
            className={cn(
                'absolute top-0.75 size-5 rounded-full bg-surface transition-all',
                checked ? 'right-0.75' : 'left-0.75'
            )}
        />
    </button>
)
