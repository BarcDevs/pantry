import { MinusIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/shared/buttons/Button'

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
        <Button
            variant={'ghost'}
            size={'icon-lg'}
            onClick={onMinus}
            className={'cursor-pointer rounded-none text-green'}
        >
            <MinusIcon size={18}/>
        </Button>
        <div className={'min-w-16 text-center text-label font-bold text-ink'}>
            {`${used} ${unit}`}
        </div>
        <Button
            variant={'ghost'}
            size={'icon-lg'}
            onClick={onPlus}
            className={'cursor-pointer rounded-none text-green'}
        >
            <PlusIcon size={18}/>
        </Button>
    </div>
)
