const CACHE_NAME = "buc-camp-26-v4";

const ASSETS = [
  "./",
  "./index.html",
  "./info.html",
  "./bring.html",
  "./quotes.html",
  "./quiz.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/intro.mp4",
  "./assets/bg.jpg",
  "./assets/header.jpg",
  "./assets/date.jpg",
  "./assets/location.jpg",
  "./assets/scripture.jpg",
  "./assets/quote.png",
  "./assets/quiz.png",
  "./assets/vv.png",
  "./assets/wheel.jpg",
  "./assets/board.jpg"
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

  if (req.destination === "video" || req.destination === "audio") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});