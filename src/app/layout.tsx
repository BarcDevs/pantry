import '@/lib/zod-locale'
import { Direction } from 'radix-ui'

import type { LayoutProps } from '@/types/react'

import { ServiceWorkerRegister }
    from '@/components/shell/service-worker-register'
import { AppSessionProvider } from '@/components/shell/session-provider'

import { cn } from '@/lib/utils'

import {
    assistant,
    heebo,
    metadata,
    viewport
} from '@/config/layout'

import '@/styles/globals.css'

export { metadata, viewport }

const RootLayout = ({
    children
}: Readonly<LayoutProps>) => (
    <AppSessionProvider>
        <html
            lang={'he'}
            dir={'rtl'}
            className={cn(
                heebo.variable,
                assistant.variable,
                'h-full antialiased'
            )}
        >
            <body className={'min-h-full flex flex-col'}>
                <Direction.DirectionProvider dir={'rtl'}>
                    {children}
                    <ServiceWorkerRegister/>
                </Direction.DirectionProvider>
            </body>
        </html>
    </AppSessionProvider>
)

export default RootLayout
