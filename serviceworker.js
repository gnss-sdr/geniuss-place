const releaseVersion = "0.0.12";
const serviceWorkerVersion = "3";
const CACHE = `geniuss-place-${releaseVersion}-${serviceWorkerVersion}`;

const offlineFallbackPage = "offline.html";

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Cached offline and index pages during install");

      return cache.addAll(
        [
          '/assets/css/main.css',
          '/assets/css/style.css',
          '/assets/js/main.min.js',
          '/assets/images/site-logo.png',
          '/assets/images/logo-gnss-sdr.png',
          '/assets/images/logo-gnss-sdr-invert.png',
          '/assets/images/not-found.jpg',
          '/offline.html',
          '/index.html',
          '/assets/images/main-page-header.jpg',
          '/assets/images/icon-gnss-sdr-white.png',
          '/assets/images/fix.png',
          '/assets/images/binder.png',
          '/assets/images/radar-chart.png',
          '/assets/images/geniuss.png',
          '/assets/images/logo-gnss-sdr-new-release.png',
          '/assets/images/logo-gsoc.png',
          '/assets/images/gnss-sdr_monitoring_teaser.png',
          '/assets/images/PDCA.png',
          '/assets/images/Cmake-logo.png',
          '/assets/images/oe-logo.png',
          '/assets/images/gnss-signals-teaser.png',
          '/assets/images/lego.jpg',
          '/assets/images/git-repository.jpg'
      ]);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("Add page to offline cache: " + response.url);

        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {
        console.log("Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return the offline page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        // The following validates that the request was for a navigation to a new document
        if (request.destination !== "document" || request.mode !== "navigate") {
          return Promise.reject("no-match");
        }

        return cache.match(offlineFallbackPage);
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
