import { redirect } from 'next/navigation'

import type { LayoutProps } from '@/types/react'

import { BottomNav } from '@/components/shell/bottom-nav'
import { Sidebar } from '@/components/shell/sidebar'
import { ToastProvider } from '@/components/shell/toast-provider'

import { routes } from '@/constants/routes'

import { ensureUser } from '@/actions/users/ensure-user'

const AppLayout = async ({ children }: LayoutProps) => {
    const user = await ensureUser()
    if (user && !user.onboardingCompletedAt)
        redirect(routes.onboarding)

    return (
        <div className={'flex min-h-screen shrink-0 flex-col md:flex-row'}>
            <Sidebar/>
            <div className={'flex min-w-0 flex-1 flex-col'}>
                <div className={'flex flex-1 flex-col'}>
                    {children}
                </div>
                <BottomNav/>
            </div>
            <ToastProvider/>
        </div>
    )
}

export default AppLayout
