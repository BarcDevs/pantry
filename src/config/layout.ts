import type { Metadata, Viewport } from 'next'
import { Assistant, Heebo } from 'next/font/google'

import appConfig from './app'

export const heebo = Heebo({
    variable: '--font-heebo',
    subsets: [
        'latin',
        'hebrew'
    ],
    weight: [
        '400',
        '500',
        '600',
        '700',
        '800'
    ]
})

export const assistant = Assistant({
    variable: '--font-assistant',
    subsets: [
        'latin',
        'hebrew'
    ],
    weight: [
        '500',
        '600',
        '700',
        '800'
    ]
})

export const metadata: Metadata = {
    title: appConfig.name,
    description: appConfig.description,
    manifest: '/manifest.json'
}

export const viewport: Viewport = {
    themeColor: appConfig.themeColor
}
