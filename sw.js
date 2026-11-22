const C = 'lernapp';
const FILES = ['./', 'index.html', 'data.enc.json', 'icon.png', 'manifest.webmanifest'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request.url, { cache: 'no-cache' })
    .then(r => { if (r.ok) { const cl = r.clone(); caches.open(C).then(c => c.put(e.request, cl)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
