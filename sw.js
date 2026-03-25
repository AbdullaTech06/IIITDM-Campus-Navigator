self.addEventListener('install', (e) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Delete all caches to ensure the PWA is completely purged.
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    return caches.delete(key);
                })
            );
        }).then(() => {
            self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Do nothing. Completely bypass the service worker.
});
