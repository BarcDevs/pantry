'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { ReactNode } from 'react'

import { useUser } from '@clerk/nextjs'

import { GenerateIcon } from '@/components/icons/generate-icon'
import { HistoryIcon } from '@/components/icons/history-icon'
import { HomeIcon } from '@/components/icons/home-icon'
import { LibraryIcon } from '@/components/icons/library-icon'
import { PantryIcon } from '@/components/icons/pantry-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { NavItem } from '@/components/shell/nav-item'

import { useIsChromeHidden } from '@/hooks/use-is-chrome-hidden'

import { routes } from '@/constants/routes'
import { commonTexts } from '@/constants/texts/common'

type SidebarNavItem = {
    href: string
    label: string
    icon: ReactNode
    isActive: (pathname: string) => boolean
}

const sidebarNavItems: SidebarNavItem[] = [
    {
        href: routes.pantry,
        label: commonTexts.navHome,
        icon: <HomeIcon/>,
        isActive: (pathname) => pathname === routes.pantry
    },
    {
        href: routes.generate,
        label: commonTexts.navGenerate,
        icon: <GenerateIcon/>,
        isActive: (pathname) => pathname.startsWith(routes.generate)
    },
    {
        href: routes.recipes,
        label: commonTexts.navLibrary,
        icon: <LibraryIcon/>,
        isActive: (pathname) => pathname.startsWith(routes.recipes)
    },
    {
        href: routes.history,
        label: commonTexts.navHistory,
        icon: <HistoryIcon/>,
        isActive: (pathname) => pathname.startsWith(routes.history)
    },
    {
        href: routes.add,
        label: commonTexts.navAdd,
        icon: <PlusIcon/>,
        isActive: (pathname) => pathname.startsWith(routes.add)
    }
]

export const Sidebar = () => {
    const pathname = usePathname()
    const { user } = useUser()
    const isChromeHidden = useIsChromeHidden()

    const displayName = user?.fullName
        ?? user?.emailAddresses[0]?.emailAddress
        ?? ''
    const initial = displayName
        .charAt(0)
        .toUpperCase() || '?'

    if (isChromeHidden) return null

    return (
        <aside className={'hidden md:flex w-sidebar shrink-0 flex-col bg-surface border-e border-border-2 sticky top-0 h-screen self-start px-4 py-6'}>
            <div className={'flex items-center gap-2.5 px-2 pb-6'}>
                <div className={'flex size-10 items-center justify-center rounded-md bg-green text-surface'}>
                    <PantryIcon/>
                </div>
                <span className={'font-display text-heading font-bold'}>
                    {commonTexts.appName}
                </span>
            </div>

            <nav className={'flex flex-col gap-1'}>
                {sidebarNavItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={item.isActive(pathname)}
                    />
                ))}
            </nav>

            <div className={'flex-1'}/>

            <Link
                href={routes.settings}
                className={'flex items-center gap-3 rounded-md border border-border-2 px-3 py-2.5 hover:bg-border-3 transition-colors'}
            >
                <div className={'flex size-10 shrink-0 items-center justify-center rounded-full bg-green text-surface font-bold text-label'}>
                    {initial}
                </div>
                <div className={'min-w-0'}>
                    <div className={'truncate text-body font-bold'}>
                        {displayName}
                    </div>
                    <div className={'text-caption text-ink-3'}>
                        {commonTexts.navSettings}
                    </div>
                </div>
            </Link>
        </aside>
    )
}
