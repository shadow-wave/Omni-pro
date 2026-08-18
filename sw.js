const CACHE_NAME = 'omni-studio-production-v10';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
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

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (
            e.request.url.includes('jsdelivr.net') ||
            e.request.url.includes('cdnjs.cloudflare.com') ||
            e.request.url.includes('fonts.gstatic.com') ||
            e.request.url.endsWith('.whl') ||
            e.request.url.endsWith('.wasm')
          ) {
            cache.put(e.request, clone);
          }
        });
        return res;
      }).catch(() => caches.match(e.request));
    })
  );
});
