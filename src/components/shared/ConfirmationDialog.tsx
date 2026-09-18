import {
    type LucideIcon,
    Trash2
} from 'lucide-react'
import type { MouseEvent } from 'react'

import { AppDialog } from '@/components/shared/AppDialog'
import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

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
        <AppDialog
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            description={description}
            icon={(
                <Icon
                    className={iconClass}
                    size={20}
                />
            )}
            align={'center'}
            showCloseButton={false}
            contentClassName={'max-w-sm'}
            footer={(
                <>
                    <SecondaryButton
                        disabled={isLoading}
                        onClick={handleCancel}
                    >
                        {cancelLabel}
                    </SecondaryButton>
                    <DestructiveButton
                        disabled={isLoading}
                        onClick={handleConfirm}
                    >
                        {label}
                    </DestructiveButton>
                </>
            )}
        />
    )
}
