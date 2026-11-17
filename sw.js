self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('memorama-pwa').then((cache) => {
      return cache.addAll([
        'index.html',
        'style.css',
        'script.js',
        'cerebro.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});