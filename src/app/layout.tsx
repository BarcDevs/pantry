import '@/lib/zod-locale'
import { Direction } from 'radix-ui'

import { heIL } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

import type { LayoutProps } from '@/types/react'

import { ServiceWorkerRegister }
    from '@/components/shell/service-worker-register'

import { cn } from '@/lib/utils'

import { clerkAppearance } from '@/config/clerk'
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
    <ClerkProvider
        localization={heIL}
        appearance={clerkAppearance}
    >
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
    </ClerkProvider>
)

export default RootLayout
