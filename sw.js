const CACHE_NAME = 'omni-studio-v5-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/nord.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.asm.js',
  'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.asm.data',
  'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/repodata.json'
];

// Install: Cache core assets and Pyodide binaries
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache critical assets immediately
      await cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('Pre-cache warning:', err));
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-First strategy for Pyodide packages (.whl, .wasm, CDN scripts)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic wheels, CDN scripts, and data files
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes('jsdelivr.net') ||
           event.request.url.includes('cdnjs.cloudflare.com') ||
           event.request.url.includes('fonts.gstatic.com') ||
           event.request.url.endsWith('.whl') ||
           event.request.url.endsWith('.wasm') ||
           event.request.url.endsWith('.json'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for offline usage
        return caches.match(event.request);
      });
    })
  );
});
