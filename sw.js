var CACHE_NAME = "flapjs-cache-v1";
var urlsToCache = [
  '/',
  '/dist/bundle.js',
  '/style.css'
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
