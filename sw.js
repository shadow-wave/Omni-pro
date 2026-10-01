const CACHE_VERSION = 'omni-studio-v9';
const RUNTIME_CACHE = 'omni-studio-runtime-v9';
const APP_SHELL = ['./','./index.html','./manifest.json','./tailwind.js','./critical.css','./omni-upgrade.js','./omni-premium.js','./sw.js'];
const CDN_HOSTS = new Set(['cdn.tailwindcss.com','cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com']);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.all(APP_SHELL.map(async url => { try { await cache.add(url); } catch (_) {} }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => ![CACHE_VERSION,RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const usable = r => r && (r.ok || r.type === 'opaque');
const put = async (cacheName, request, response) => { if (usable(response)) { try { const c=await caches.open(cacheName); await c.put(request,response.clone()); } catch (_) {} } return response; };

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const cdn = CDN_HOSTS.has(url.hostname);

  if (same && req.mode === 'navigate') {
    event.respondWith(fetch(req).then(r => put(CACHE_VERSION,'./index.html',r)).catch(() => caches.match('./index.html')));
    return;
  }

  if (same) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r => put(RUNTIME_CACHE,req,r))));
    return;
  }

  if (cdn) {
    event.respondWith(caches.match(req).then(cached => {
      const network = fetch(req).then(r => put(RUNTIME_CACHE,req,r)).catch(() => cached);
      return cached || network;
    }));
  }
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_RUNTIME_CACHE') event.waitUntil(caches.delete(RUNTIME_CACHE));
});
