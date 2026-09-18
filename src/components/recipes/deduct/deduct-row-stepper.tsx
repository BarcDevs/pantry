import { MinusIcon, PlusIcon } from 'lucide-react'

import { IconButton } from '@/components/shared/buttons/IconButton'

type DeductRowStepperProps = {
    used: number
    unit: string
    onMinus: () => void
    onPlus: () => void
}

export const DeductRowStepper = ({
    used,
    unit,
    onMinus,
    onPlus
}: DeductRowStepperProps) => (
    <div className={'flex shrink-0 items-center overflow-hidden rounded-lg border border-border bg-canvas'}>
        <IconButton
            size={'icon-lg'}
            onClick={onMinus}
            className={'rounded-none text-green'}
        >
            <MinusIcon size={18}/>
        </IconButton>
        <div className={'min-w-16 text-center text-label font-bold text-ink'}>
            {`${used} ${unit}`}
        </div>
        <IconButton
            size={'icon-lg'}
            onClick={onPlus}
            className={'rounded-none text-green'}
        >
            <PlusIcon size={18}/>
        </IconButton>
    </div>
)
