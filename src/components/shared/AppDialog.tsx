import { XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import type { ClassName } from '@/types/react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

type AppDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: ReactNode
    description?: ReactNode
    icon?: ReactNode
    align?: 'start' | 'center'
    children?: ReactNode
    footer?: ReactNode
    contentClassName?: ClassName
    showCloseButton?: boolean
}

export const AppDialog = ({
    open,
    onOpenChange,
    title,
    description,
    icon,
    align = 'start',
    children,
    footer,
    contentClassName,
    showCloseButton = true
}: AppDialogProps) => {
    const isCentered = align === 'center'

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                showCloseButton={false}
                onClick={(e) => e.stopPropagation()}
                className={cn('rounded-2xl bg-canvas p-5.5', contentClassName)}
            >
                <DialogHeader
                    className={cn(
                        !isCentered && 'flex-row items-center justify-between gap-3 space-y-0 py-px'
                    )}
                >
                    <div className={cn(!isCentered && 'min-w-0')}>
                        {icon && (
                            <div className={'mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10'}>
                                {icon}
                            </div>
                        )}
                        <DialogTitle
                            className={cn(
                                'font-display text-heading font-bold text-ink',
                                isCentered && 'text-center'
                            )}
                        >
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription className={cn(isCentered && 'text-center')}>
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                    {showCloseButton && !isCentered && (
                        <DialogClose className={'flex size-8 shrink-0 items-center justify-center rounded-full border border-border-2 text-ink-4'}>
                            <XIcon size={16}/>
                        </DialogClose>
                    )}
                </DialogHeader>
                {children}
                {footer && (
                    <DialogFooter className={cn(isCentered && 'sm:justify-center')}>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
