const CACHE = "app-animal-v1";

const arquivos = [
  "/",
  "/index.html",
  "/animais.html",
  "/cadastrar.html",
  "/css/index.css",
  "/js/index.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(arquivos))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});