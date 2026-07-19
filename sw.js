const CACHE = 'hoehenmeter-v2';
const DATEIEN = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(treffer => {
      const netz = fetch(e.request).then(antwort => {
        if (antwort && antwort.status === 200 && antwort.type === 'basic') {
          const kopie = antwort.clone();
          caches.open(CACHE).then(c => c.put(e.request, kopie));
        }
        return antwort;
      }).catch(() => treffer);
      return treffer || netz;
    })
  );
});
