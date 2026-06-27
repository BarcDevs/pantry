import type { ReactNode } from 'react'

export type NavButtonProps = {
    href: string
    label: string
    icon: ReactNode
    active: boolean
    disabled?: boolean
}
