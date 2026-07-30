import { TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type DeductZeroWarningProps = {
    choice: 'keep' | 'delete' | null
    onKeep: () => void
    onDelete: () => void
}

export const DeductZeroWarning = ({
    choice,
    onKeep,
    onDelete
}: DeductZeroWarningProps) => (
    <div className={'mt-2.75 rounded-lg border border-status-red-fg/20 bg-status-red-bg p-2.75'}>
        <div className={'mb-2.25 flex items-center gap-1.5 text-caption font-bold text-status-red-fg'}>
            <TriangleAlertIcon size={14}/>
            {recipesTexts.deduct.zeroWarning}
        </div>
        <div className={'flex gap-2'}>
            <Button
                variant={'outline'}
                onClick={onKeep}
                className={cn(
                    'flex-1 cursor-pointer text-caption font-bold',
                    choice === 'keep' && 'border-green bg-green/10 text-green'
                )}
            >
                {recipesTexts.deduct.keepAtZero}
            </Button>
            <Button
                variant={'outline'}
                onClick={onDelete}
                className={cn(
                    'flex-1 cursor-pointer text-caption font-bold',
                    choice === 'delete' && 'border-status-red-fg bg-status-red-fg/10 text-status-red-fg'
                )}
            >
                {recipesTexts.deduct.deleteFromPantry}
            </Button>
        </div>
    </div>
)
