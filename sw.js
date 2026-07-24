const CACHE = 'hoehenmeter-v4';
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

function cachen(request, antwort) {
  if (antwort && antwort.status === 200 && antwort.type === 'basic') {
    const kopie = antwort.clone();
    caches.open(CACHE).then(c => c.put(request, kopie));
  }
  return antwort;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Seitenaufrufe: network-first – immer die aktuelle App laden, offline aus dem Cache.
  // So erscheinen Updates sofort beim ersten Öffnen, ohne mehrfaches Neuladen.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(antwort => cachen(e.request, antwort))
        .catch(() => caches.match(e.request).then(t => t || caches.match('./index.html')))
    );
    return;
  }

  // Übrige Dateien (Icons, Manifest): cache-first mit Hintergrund-Aktualisierung.
  e.respondWith(
    caches.match(e.request).then(treffer => {
      const netz = fetch(e.request).then(antwort => cachen(e.request, antwort)).catch(() => treffer);
      return treffer || netz;
    })
  );
});
