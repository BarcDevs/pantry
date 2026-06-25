import type { LayoutProps } from '@/types'
import {
    heebo,
    assistant,
    metadata,
    viewport
} from '@/config/layout'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { ServiceWorkerRegister } from '@/components/shell/service-worker-register'
import './globals.css'

export { metadata, viewport }

const RootLayout = ({
    children
}: Readonly<LayoutProps>) => (
    <ClerkProvider>
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
                {children}
                <ServiceWorkerRegister/>
            </body>
        </html>
    </ClerkProvider>
)

export default RootLayout
