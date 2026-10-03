const CACHE_NAME = 'sinai-guide-shell-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('sinai-guide-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const networkResponse = fetch(request);
    event.waitUntil(networkResponse.then((response) => {
      if (!response.ok) return undefined;
      return caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', response.clone()));
    }).catch(() => undefined));
    event.respondWith(networkResponse.catch(async () => (
      (await caches.match('/index.html')) || (await caches.match('/'))
    )));
    return;
  }

  if (url.pathname.startsWith('/assets/') && request.destination) {
    event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    }));
  }
});
