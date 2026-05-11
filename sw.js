const CACHE_NAME = 'bal-enzo-v17';

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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// Activatie: oude caches verwijderen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Verzoeken: eerst uit cache, anders van het netwerk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Laat een nieuwe service worker onmiddellijk actief worden
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
