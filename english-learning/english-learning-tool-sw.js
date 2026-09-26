/* Two caches on purpose:
   - APP_CACHE     : index.html (200 KB). Bumped on every app deploy.
   - CONTENT_CACHE : content/*.json (2.2 MB). Bumped ONLY when a pack changes.

   Previously they shared one cache, so every version bump forced the phone to
   re-download ~2.4 MB before the app was usable offline again. Now a deploy
   re-downloads only the HTML.
*/
const APP_CACHE = "ed-app-v36";
const CONTENT_CACHE = "ed-content-v1";

// Only reference files that actually exist. The manifest + touch-icon are
// inlined as data URIs inside index.html, so they are not separate files.
const APP_ASSETS = ["./", "./index.html"];
const CONTENT_ASSETS = [
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

/* addAll() is atomic: ONE 404 fails the whole install and the app ends up with
   no offline cache at all. Cache what we can, skip what is missing. */
function addAllSafe(cache, urls) {
  return Promise.all(urls.map(function (u) {
    return cache.add(u).catch(function () { /* asset unavailable — skip */ });
  }));
}
/* Top up a cache without re-downloading anything it already holds. */
function ensureAll(cache, urls) {
  return Promise.all(urls.map(function (u) {
    return cache.match(u).then(function (hit) {
      if (hit) return null;
      return cache.add(u).catch(function () { /* asset unavailable — skip */ });
    });
  }));
}

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(APP_CACHE)
      .then(function (c) { return addAllSafe(c, APP_ASSETS); })
      .then(function () { return caches.open(CONTENT_CACHE); })
      .then(function (c) { return ensureAll(c, CONTENT_ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== APP_CACHE && k !== CONTENT_CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function cacheFor(url) {
  return url.indexOf("/content/") >= 0 ? CONTENT_CACHE : APP_CACHE;
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (resp) {
        // Cache same-origin successful responses (incl. content/*.json)
        if (resp && resp.ok && new URL(e.request.url).origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(cacheFor(e.request.url)).then(function (c) { c.put(e.request, copy); });
        }
        return resp;
      }).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
