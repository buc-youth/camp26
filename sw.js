const CACHE_NAME = "buc-camp-26-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./registration.html",
  "./bring.html",
  "./quiz.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
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
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});