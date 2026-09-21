import { Dialog } from 'radix-ui'
import type { ReactNode } from 'react'

type CenteredModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    icon: string
    title: string
    description: string
    children: ReactNode
}

export const CenteredModal = ({
    open,
    onOpenChange,
    icon,
    title,
    description,
    children
}: CenteredModalProps) => (
    <Dialog.Root
        open={open}
        onOpenChange={onOpenChange}
    >
        <Dialog.Portal>
            <Dialog.Overlay className={'fixed inset-0 z-50 bg-ink/45'}/>
            <Dialog.Content
                className={'fixed top-1/2 left-1/2 z-50 w-[calc(100%-40px)] max-w-95 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface px-6 py-6.5 text-center outline-none'}
            >
                <div
                    aria-hidden={'true'}
                    className={'mb-2.5 text-[34px]'}
                >
                    {icon}
                </div>
                <Dialog.Title className={'mb-2 text-[18px] font-extrabold text-ink'}>
                    {title}
                </Dialog.Title>
                <Dialog.Description className={'mb-5 text-[14px] leading-[1.6] text-ink-2'}>
                    {description}
                </Dialog.Description>
                <div className={'flex flex-col gap-2.5'}>
                    {children}
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
)
