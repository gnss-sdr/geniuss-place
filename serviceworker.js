const releaseVersion = "0.0.20";
const serviceWorkerVersion = "18";
const CACHE = `geniuss-place-${releaseVersion}-${serviceWorkerVersion}`;
const offlineFallbackPage = "/offline.html";

const ASSETS_TO_CACHE = [
  "/index.html",
  "/offline.html",
  "/assets/css/main.css",
  "/assets/css/style.css",
  "/assets/fonts/fontawesome/css/all.min.css",
  "/assets/css/academicons.min.css",
  "/assets/js/main.min.js",
  "/assets/images/site-logo.png",
  "/assets/images/logo-gnss-sdr.png",
  "/assets/images/logo-gnss-sdr-invert.png",
  "/assets/images/not-found.jpg",
  "/assets/images/main-page-header.jpg",
  "/assets/images/icon-gnss-sdr-white.png",
  "/assets/images/fix.png",
  "/assets/images/binder.png",
  "/assets/images/radar-chart.png",
  "/assets/images/geniuss.png",
  "/assets/images/logo-gnss-sdr-new-release.png",
  "/assets/images/logo-gsoc.png",
  "/assets/images/gnss-sdr_monitoring_teaser.png",
  "/assets/images/fpga-ip-core.png",
  "/assets/images/OSNMA_teaser.png",
  "/assets/images/PDCA.png",
  "/assets/images/Cmake-logo.png",
  "/assets/images/oe-logo.png",
  "/assets/images/gnss-signals-teaser.png",
  "/assets/images/lego.jpg",
  "/assets/images/logo-git.png",
  "/assets/images/master-to-main-teaser.png",
  "/assets/images/geniux-teaser.png"
];

// Install: Pre-cache static assets
self.addEventListener("install", event => {
  console.log("Service Worker: Install");

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("Caching index page and offline fallback");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", event => {
  console.log("Service Worker: Activate");

  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE)
          .map(name => {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML, Cache-first for others
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const acceptHeader = request.headers.get("accept") || "";
  const isHTML = acceptHeader.includes("text/html");

  if (isHTML) {
    // Network-first strategy for HTML
    event.respondWith(
      fetch(request)
        .then(response => {
          const cloned = response.clone();
          if (isCacheableRequest(request)) {
            event.waitUntil(updateCache(request, cloned));
          }
          return response;
        })
        .catch(error => {
          console.warn("Fetch failed; trying cache for HTML:", error);
          return fromCache(request);
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request)
          .then(response => {
            if (
              response &&
              response.status === 200 &&
              isCacheableRequest(request)
            ) {
              const cloned = response.clone();
              event.waitUntil(updateCache(request, cloned));
            }
            return response;
          })
          .catch(error => {
            console.warn("Fetch failed; asset not cached:", error);
            return;
          });
      })
    );
  }
});

// Only cache GET requests with http/https schemes from same origin
function isCacheableRequest(request) {
  try {
    const url = new URL(request.url);
    return (
      request.method === "GET" &&
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin === self.location.origin
    );
  } catch (e) {
    return false;
  }
}

// Serve cached content or fallback offline page
function fromCache(request) {
  return caches.open(CACHE).then(cache =>
    cache.match(request).then(matching => {
      if (!matching || matching.status === 404) {
        if (request.destination === "document" || request.mode === "navigate") {
          return cache.match(offlineFallbackPage);
        }
        return Response.error();
      }
      return matching;
    })
  );
}

// Store response in cache
function updateCache(request, response) {
  return caches.open(CACHE).then(cache => cache.put(request, response));
}