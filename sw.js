const CACHE_NAME = "buc-camp-26-v2";

const ASSETS = [
  "./",
  "./index.html",
"./info.html",
  "./registration.html",
  "./bring.html",
  "./quiz.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
"./assets/intro.mp4",
  "./assets/bg.jpg",
  "./assets/header.jpg",
  "./assets/date.jpg",
  "./assets/location.jpg",
  "./assets/scripture.jpg"

];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Network-first for video/audio so playback doesn’t freeze due to stale cache
  if (req.destination === "video" || req.destination === "audio") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else (fast + works offline)
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});