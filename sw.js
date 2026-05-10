// Versienaam van de cache
const CACHE_NAME = 'bal-enzo-v5';

// Bestanden die gecachet moeten worden
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.png',
  './logo.png',
  './hero.jpg'
];

// Installatie: bestanden vooraf cachen
self.addEventListener('install', event => {
  console.log('Service Worker geïnstalleerd');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// Activatie: oude caches verwijderen
self.addEventListener('activate', event => {
  console.log('Service Worker geactiveerd');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch: eerst cache, daarna netwerk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
