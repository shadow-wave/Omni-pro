// Omni-Studio Production Service Worker
// Version bump ensures clients automatically receive the latest index.html updates
const CACHE_VERSION = 'omni-studio-v3.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Essential App Shell Assets
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
  'https://cdn.tailwindcss.com',
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

// Install Event: Cache app shell immediately and skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Non-critical asset cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear all previous versions of static & runtime caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== STATIC_CACHE && name !== RUNTIME_CACHE) {
            console.log('[SW] Purging outdated cache store:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for HTML navigation, Cache-first with background fill for WASM/CDNs
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Strategy A: HTML navigation requests (Network-First to always fetch code updates immediately)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html') || caches.match('./'))
    );
    return;
  }

  // Strategy B: CDN, WebAssembly (.wasm), Wheels (.whl), data packages (Cache-First)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.hostname.includes('jsdelivr.net') ||
           url.hostname.includes('cdnjs.cloudflare.com') ||
           url.hostname.includes('fonts.gstatic.com') ||
           url.hostname.includes('fonts.googleapis.com') ||
           url.pathname.endsWith('.whl') ||
           url.pathname.endsWith('.wasm') ||
           url.pathname.endsWith('.data') ||
           url.pathname.endsWith('.json'))
        ) {
          const clone = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, clone));
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[SW] Offline fetch fallback for:', req.url, err);
      });
    })
  );
});
