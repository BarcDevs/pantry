const CACHE_NAME = 'pantry-shell-v1'
const SHELL_URLS = ['/', '/manifest.json']

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS))
    )
})

self.addEventListener('fetch', event => {
    const { request } = event
    const url = new URL(request.url)

    if (request.method !== 'GET') return
    if (url.origin !== self.location.origin) return
    if (url.pathname.startsWith('/_next/')) return
    if (url.pathname.startsWith('/api/')) return

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() =>
                caches.match('/').then(r => r || fetch(request))
            )
        )
        return
    }

    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request))
    )
})
