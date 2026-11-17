const CACHE = 'jul-nedtelling-v5';
const FILES = ['./', './index.html', './manifest.json', './icon-192-v2.png', './icon-512-v2.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Let audio (and any range-based) requests go straight to the network -
  // caching/intercepting Range requests can break mobile audio streaming.
  if (e.request.headers.has('range') || e.request.destination === 'audio') {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
