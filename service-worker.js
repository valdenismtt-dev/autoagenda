const CACHE = 'autoagenda-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7W0Q5n-wU.woff2',
  'https://unpkg.com/feather-icons@4.29.0/dist/feather.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'unpkg.com') {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('index.html')))
    );
  }
});
