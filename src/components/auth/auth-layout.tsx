import type { LayoutProps } from '@/types'

import { AuthBrandPanel } from './auth-brand-panel'

export const AuthLayout = ({ children }: LayoutProps) => (
    <div className={'min-h-screen flex flex-col md:flex-row'}>
        <AuthBrandPanel/>
        <div className={'flex-1 flex items-center justify-center p-10'}>
            {children}
        </div>
    </div>
)
