/**
 * Service worker for Wordhaven.
 * Precaches the small app shell on install (so that step is fast and
 * reliable), then caches everything else - the chapter photos especially,
 * which are the largest files - opportunistically the first time each is
 * actually requested. Precaching the photos with cache.addAll() was tried
 * first, but addAll() is all-or-nothing: one slow or dropped image fetch
 * (easy to hit on real cellular/wifi on first install) failed the whole
 * install and left the app with no working cache at all, which is why
 * images sometimes didn't show up in the installed app.
 */
const CACHE_NAME = 'zenword-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './levels.js',
  './crossword.js',
  './game.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        CORE_ASSETS.map((url) => cache.add(url).catch(() => { /* one bad asset shouldn't block the rest */ }))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
