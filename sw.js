/**
 * Omni-Studio Service Worker
 * Version: 6.0.0
 * 
 * Provides offline caching for the Omni-Studio IDE, local Tailwind engine,
 * CodeMirror suite, and Pyodide WebAssembly packages (NumPy, Pandas, Matplotlib).
 */

const CACHE_VERSION = 'omni-studio-v6';
const RUNTIME_CACHE = 'omni-runtime-v6';

// Core local assets that must be pre-cached immediately on installation
const PRECACHE_LOCAL_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './tailwind.js'
];

// Essential third-party editor scripts and CDN dependencies
const PRECACHE_CDN_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/nord.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/searchcursor.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'
];

// Install Event: Precaches local shell and CDN assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(async (cache) => {
            // Cache core local assets first (resilient to missing files)
            for (const url of PRECACHE_LOCAL_ASSETS) {
                try {
                    const response = await fetch(url, { cache: 'no-cache' });
                    if (response.ok) {
                        await cache.put(url, response);
                    }
                } catch (err) {
                    console.warn(`[SW] Precache skipped for local: ${url}`, err);
                }
            }

            // Cache critical CDN dependencies
            for (const url of PRECACHE_CDN_ASSETS) {
                try {
                    const response = await fetch(url, { mode: 'cors' });
                    if (response.ok || response.type === 'opaque') {
                        await cache.put(url, response);
                    }
                } catch (err) {
                    console.warn(`[SW] Precache skipped for CDN: ${url}`, err);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

// Activate Event: Purges old cache versions and takes immediate client control
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_VERSION, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!currentCaches.includes(cacheName)) {
                        console.log(`[SW] Deleting deprecated cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Cache-First for static assets/WASM, Network-First for navigation
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only handle standard HTTP/HTTPS GET requests
    if (request.method !== 'GET') return;
    if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) return;

    // 1. Navigation requests (Page reload, URL direct hits): Network-first with offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(async () => {
                const cache = await caches.open(CACHE_VERSION);
                const cachedPage = await cache.match('./index.html') || await cache.match('./');
                return cachedPage || Response.error();
            })
        );
        return;
    }

    // 2. Static Assets, Pyodide WASM, Packages (.whl), Fonts, and Scripts: Cache-First Strategy
    event.respondWith(
        caches.match(request).then(async (cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            // If not found in cache, download from network and save to dynamic runtime cache
            try {
                const networkResponse = await fetch(request);

                // Cache valid responses or opaque CDN responses (status 0)
                if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                    const runtimeCache = await caches.open(RUNTIME_CACHE);
                    runtimeCache.put(request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                // Return broken/offline fallback if network fails
                return cachedResponse || Response.error();
            }
        })
    );
});

// Message listener to trigger manual skipWaiting from web UI if needed
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
