const CACHE_NAME = 'navigator-cache-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './styles.css?v=5',
    './scripts.js',
    './scripts.js?v=5',
    // Cache the external libraries we use (Leaflet & Routing)
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js',
    'https://unpkg.com/@supabase/supabase-js@2'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('Opened cache');
            const results = await Promise.allSettled(
                ASSETS_TO_CACHE.map((url) => cache.add(url))
            );
            const failed = results.filter((r) => r.status === 'rejected');
            if (failed.length) {
                console.warn('Some assets failed to cache during install:', failed.length);
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k.startsWith('navigator-cache-') && k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            )
        )
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version if found
            if (response) {
                return response;
            }

            // Otherwise, fetch from network and dynamically cache map tiles
            return fetch(event.request).then((networkResponse) => {
                // Only dynamically cache standard openstreetmap tiles.
                // Doing this lets the map work offline after the user browses it once!
                if (event.request.url.includes('openstreetmap.org')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Fallback if network fails and completely offline.
                // It will just fail gracefully for assets we haven't cached.
                console.log('Offline: Could not find in cache or network.');
            });
        })
    );
});
