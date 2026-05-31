const CACHE = 'squish-em-v2';
const PRECACHE = ['/', '/index.html', '/game.html', '/howtoplay.html', '/about.html', '/favicon.svg', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname === '/changelog.json') return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        if (res.ok && res.status < 400) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || new Response('Offline', { status: 503 })))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || "SQUISH 'EM!";
  const opts = {
    body: data.body || 'Blob waves are waiting. Jump in and SQUISH!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [80, 40, 80],
    tag: 'squish-notif',
    renotify: true,
    data: { url: data.url || '/play' },
    actions: [
      { action: 'play', title: '🎮 Play Now' },
      { action: 'dismiss', title: 'Later' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.action === 'play' ? '/play' : (e.notification.data?.url || '/');
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      const w = wins.find(w => w.url.includes(self.location.origin));
      return w ? w.focus() : clients.openWindow(url);
    })
  );
});
