'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CameraIcon } from '@/components/icons/camera-icon'
import { HomeIcon } from '@/components/icons/home-icon'
import { LibraryIcon } from '@/components/icons/library-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { ProfileIcon } from '@/components/icons/profile-icon'
import { NavButton } from '@/components/shell/nav-button'

import { useIsChromeHidden } from '@/hooks/use-is-chrome-hidden'

import { routes } from '@/constants/routes'
import { commonTexts } from '@/constants/texts/common'

export const BottomNav = () => {
    const pathname = usePathname()
    const isChromeHidden = useIsChromeHidden()

    if (isChromeHidden) return null

    return (
        <nav className={'flex md:hidden justify-around items-center bg-surface border-t border-border-2 px-3 pb-3.5 pt-2.5 shrink-0 sticky bottom-0 z-30'}>
            <NavButton
                href={routes.pantry}
                label={commonTexts.navHome}
                icon={<HomeIcon size={23}/>}
                active={pathname === routes.pantry}
            />
            <NavButton
                href={routes.recipes}
                label={commonTexts.navLibraryMobile}
                icon={<LibraryIcon size={23}/>}
                active={pathname.startsWith(routes.recipes)}
            />
            <Link
                href={routes.generate}
                aria-label={commonTexts.navGenerate}
                className={'-mt-nav-fab-lift flex size-nav-fab items-center justify-center rounded-full bg-green text-surface shadow-button'}
            >
                <PlusIcon size={24}/>
            </Link>
            <NavButton
                href={routes.add}
                label={commonTexts.navAddMobile}
                icon={<CameraIcon size={23}/>}
                active={pathname.startsWith(routes.add)}
            />
            <NavButton
                href={routes.settings}
                label={commonTexts.navProfileMobile}
                icon={<ProfileIcon size={23}/>}
                active={pathname === routes.settings}
            />
        </nav>
    )
}
