import type { ReactNode } from 'react'

type GenerateFieldCardProps = {
    children: ReactNode
}

export const GenerateFieldCard = ({
    children
}: GenerateFieldCardProps) => (
    <div className={'rounded-lg border border-border-2 bg-surface p-4'}>
        {children}
    </div>
)
