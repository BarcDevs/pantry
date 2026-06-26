import { heIL } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'

import type { LayoutProps } from '@/types'

import { AuthHeader } from '@/components/shell/auth-header'
import { ServiceWorkerRegister }
    from '@/components/shell/service-worker-register'

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
    <ClerkProvider localization={heIL} appearance={{ theme: shadcn }}>
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
                <AuthHeader/>
                {children}
                <ServiceWorkerRegister/>
            </body>
        </html>
    </ClerkProvider>
)

export default RootLayout
