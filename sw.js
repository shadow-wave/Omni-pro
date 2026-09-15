// Omni-Studio Service Worker (Offline First Architecture)
const CACHE_VERSION = 'omni-studio-v3.0.0';
const STATIC_CACHE = static-${CACHE_VERSION};
const RUNTIME_CACHE = runtime-${CACHE_VERSION};
​// Core App Shell Assets
const STATIC_ASSETS = [
'./',
'./index.html',
'./manifest.json',
'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
'https://cdn.tailwindcss.com',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/nord.min.css',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.css',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'
];
​// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(STATIC_CACHE).then((cache) => {
return cache.addAll(STATIC_ASSETS).catch((err) => {
console.warn('Non-critical pre-cache warning:', err);
});
}).then(() => self.skipWaiting())
);
});
​// Activate Event: Clear outdated cache stores
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((name) => {
if (name !== STATIC_CACHE && name !== RUNTIME_CACHE) {
return caches.delete(name);
}
})
);
}).then(() => self.clients.claim())
);
});
​// Fetch Event: Cache-first for WASM/CDN runtime, network-first for index
self.addEventListener('fetch', (event) => {
const req = event.request;
if (req.method !== 'GET') return;
​event.respondWith(
caches.match(req).then((cachedResponse) => {
if (cachedResponse) {
return cachedResponse;
}
​return fetch(req).then((networkResponse) => {
if (
networkResponse &&
networkResponse.status === 200 &&
(req.url.includes('jsdelivr.net') ||
req.url.includes('cdnjs.cloudflare.com') ||
req.url.includes('fonts.gstatic.com') ||
req.url.includes('.whl') ||
req.url.includes('.wasm') ||
req.url.includes('.data') ||
req.url.endsWith('.json'))
) {
const clone = networkResponse.clone();
caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, clone));
}
return networkResponse;
}).catch(() => {
if (req.mode === 'navigate') {
return caches.match('./index.html');
}
});
})
);
});
