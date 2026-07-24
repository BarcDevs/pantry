import {
    type LucideIcon,
    Trash2
} from 'lucide-react'
import type { MouseEvent } from 'react'

import { Button } from '@/components/shared/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

type ConfirmationDialogProps = {
    open: boolean
    onOpenChangeAction: (isOpen: boolean) => void
    title: string
    description: string
    label: string
    cancelLabel: string
    icon?: LucideIcon
    isLoading?: boolean
    onConfirmAction: () => Promise<void>
}

const iconClass = 'text-destructive focus:text-destructive'

export const ConfirmationDialog = ({
    open,
    onOpenChangeAction,
    title,
    description,
    label,
    cancelLabel,
    icon: Icon = Trash2,
    isLoading = false,
    onConfirmAction
}: ConfirmationDialogProps) => {
    const stopPropagation = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    const handleConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event)
        try {
            await onConfirmAction()
            onOpenChangeAction(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
        stopPropagation(event)
        onOpenChangeAction(false)
    }

    const handleOpenChange = (nextOpen: boolean) => {
        if (isLoading) return
        onOpenChangeAction(nextOpen)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent
                showCloseButton={false}
                className={'max-w-sm'}
            >
                <DialogHeader>
                    <div className={'flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto mb-2'}>
                        <Icon
                            className={iconClass}
                            size={20}
                        />
                    </div>
                    <DialogTitle className={'text-center'}>
                        {title}
                    </DialogTitle>
                    <DialogDescription className={'text-center'}>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className={'flex justify-center gap-2 mt-2'}>
                    <Button
                        variant={'outline'}
                        disabled={isLoading}
                        onClick={handleCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={'destructive'}
                        disabled={isLoading}
                        onClick={handleConfirm}
                    >
                        {label}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
