const CACHE = "ed-c493f6c4";
// Only reference files that actually exist. The manifest + touch-icon are
// inlined as data URIs inside index.html, so they are not separate files.
const ASSETS = [
  "./",
  "./index.html",
  "./content/manifest.json",
  "./content/general.json",
  "./content/nce2.json",
  "./content/nce3.json",
  "./content/nce4.json",
  "./content/freq-1k.json",
  "./content/freq-2k.json",
  "./content/freq-3k.json",
  "./content/freq-4k.json"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (resp) {
        // Cache same-origin successful responses (incl. content/*.json)
        if (resp && resp.ok && new URL(e.request.url).origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return resp;
      }).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
