'use client'

import { useEffect } from 'react'

import '@/lib/zod-locale'

export const ServiceWorkerRegister = () => {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        if (process.env.NODE_ENV !== 'production') {
            navigator.serviceWorker
                .getRegistrations()
                .then(regs => regs.forEach(r => r.unregister()))
            caches
                .keys()
                .then(keys => keys.forEach(k => caches.delete(k)))
            return
        }

        navigator.serviceWorker.register('/sw.js')
    }, [])

    return null
}
