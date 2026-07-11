// Service worker — Dieta Fase 2
// Per aggiornare la PWA in futuro: cambia il numero di versione qui sotto (es. v3, v4...)
const CACHE = 'dieta-fase2-v3';

const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  'icon-192.png',
  'icon-512.png'
];

// Installazione: pre-carica i file dell'app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Attivazione: elimina le cache vecchie (versioni precedenti)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: per le pagine (navigazione) prova prima la rete, così vedi subito
// gli aggiornamenti; se offline usa la cache. Per gli altri file: cache prima.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('index.html', copy));
          return res;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
