var CACHE_NAME = "flapjs-cache-v1";
var urlsToCache = [
  '/',
  '/index.html',
  '/dist/app.html',
  '/dist/app.bundle.js',
  '/dist/runtime.bundle.js',
  '/dist/vendors.bundle.js',
  '/dist/landing.bundle.js',
  '/dist/style.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log("Opened cache...");
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("Fetching..." + event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response)
        {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(function(response) {
            if (!response || response.status !== 200)
            {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
