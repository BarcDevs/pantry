'use client'

import { UserButton } from '@clerk/nextjs'

import { useIsChromeHidden } from '@/hooks/use-is-chrome-hidden'

export const UserMenu = () => {
    const isChromeHidden = useIsChromeHidden()

    if (isChromeHidden) return null

    return (
        <div className={'flex justify-end px-4 pt-4 md:px-6'}>
            <UserButton
                showName
                appearance={{
                    elements: {
                        userButtonBox: 'flex-row-reverse gap-2 rounded-full border border-border-2 bg-surface px-3 py-1.5 hover:bg-border-3 transition-colors',
                        userButtonOuterIdentifier: 'text-body font-semibold text-ink'
                    }
                }}
            />
        </div>
    )
}
