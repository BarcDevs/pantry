import { type ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Assistant, Heebo } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { ServiceWorkerRegister } from '@/components/shell/service-worker-register'
import './globals.css'

const heebo = Heebo({
    variable: '--font-heebo',
    subsets: ['latin', 'hebrew'],
    weight: ['400', '500', '600', '700', '800'],
})

const assistant = Assistant({
    variable: '--font-assistant',
    subsets: ['latin', 'hebrew'],
    weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
    title: 'Pantry',
    description: 'בשלו ממה שכבר יש לכם בבית',
    manifest: '/manifest.json',
}

export const viewport: Viewport = {
    themeColor: '#3f7d4e',
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
    <ClerkProvider>
        <html lang="he" dir="rtl" className={cn(heebo.variable, assistant.variable, 'h-full antialiased')}>
            <body className="min-h-full flex flex-col">
                {children}
                <ServiceWorkerRegister />
            </body>
        </html>
    </ClerkProvider>
)

export default RootLayout
