const CACHE_NAME = 'pantry-shell-v1'
const SHELL_URLS = ['/', '/manifest.json']

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)),
    )
})

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) return
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request)),
    )
})
