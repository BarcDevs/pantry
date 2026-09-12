import type { LayoutProps } from '@/types/react'

import { AuthBrandPanel } from './auth-brand-panel'

export const AuthLayout = ({ children }: LayoutProps) => (
    <div className={'min-h-screen flex flex-col md:flex-row'}>
        <AuthBrandPanel/>
        <div className={'flex-1 flex items-center justify-center p-10 md:basis-[62%] md:grow-0 md:shrink-0'}>
            {children}
        </div>
    </div>
)
