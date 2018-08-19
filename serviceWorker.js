//This is the github-ready service worker
//TODO: When we get a server, this needs to be at the root!
//TODO: when we get a server, remove all  "dist/"
//TODO: Don't forget to remove \/dist\/ from isValidCachePath

//Must stay in service worker to trigger update
//Must also NEVER rename the file
const CONFIG = {
  version: '0.0.0',
  //TODO: For production mode, change this to false!
  networkPriority: true,
  //TODO: For production mode, change this to false!
  sourcePriority: true,
  staticCacheItems: [
    './',
    './app.html',

    './dist/offline/offline.html',
    './dist/offline/offline.png',

    './dist/src/app.bundle.js',
    './dist/src/landing.bundle.js',
    './dist/src/runtime~app.bundle.js',
    './dist/src/runtime~landing.bundle.js',
    './dist/src/vendors.bundle.js',

    './dist/lang/I18N.js',
    './dist/lang/en_us.lang',

    './dist/images/flapjs.svg',

    './dist/style.css'
  ],
  offlineImage: './dist/offline/offline.png',
  offlinePage: './dist/offline/offline.html',
  isValidCachePath(cachePath)
  {
    const pattern = /^\/(dist|FLAPJS-WebApp\/dist)\/(images|src|lang)\//g;
    const result = pattern.exec(cachePath);
    return result;
  },
};

function cacheName(key, opts)
{
  return opts.version + "-" + key;
}

function addToCache(cacheKey, request, response)
{
  if (response.ok)
  {
    //Response objects are only used once!
    const copy = response.clone();

    caches.open(cacheKey).then(cache => {
      cache.put(request, copy);
    });
  }

  //Don't cache invalid resources...
  return response;
}

function fetchFromCache(event)
{
  //Find it in the cache...
  return caches.match(event.request)
    .then(response => {
      //Allow later chains to handle the error
      if (!response)
      {
        throw new Error(event.request.url + " not found in cache");
      }
      return response;
    });
}

function offlineResponse(request, opts)
{
  if (resourceType === 'content')
  {
    return caches.match(opts.offlinePage);
  }
  else if (responseType === 'image')
  {
    return caches.match(opts.offlineImage);
  }
  else// if (responseType === ...)
  {
    //Handle any other resources that have offline versions...
  }

  return undefined;
}

//Pre-cache static resources for offline use...
self.addEventListener('install', event => {

  //Install resources into cache...
  function onInstall(event, opts)
  {
    const cacheKey = cacheName('static', opts);
    return caches.open(cacheKey)
      .then(cache => cache.addAll(opts.staticCacheItems));
  }

  //Wait for it to happen...
  event.waitUntil(onInstall(event, CONFIG).then(() => self.skipWaiting()));
});

//Update old versions of caches
self.addEventListener('activate', event => {
  //Delete old caches with different versions
  function onActivate(event, opts)
  {
    return caches.keys()
      .then(cacheKeys => {
        const oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
        return Promise.all(
          oldCacheKeys.map(oldKey => caches.delete(oldKey))
        );
      });
  }

  event.waitUntil(onActivate(event, CONFIG).then(() => self.clients.claim()));
});

//Respond to offline fetches...
self.addEventListener('fetch', event => {

  //Should we though?
  function shouldHandleFetch(event, opts)
  {
    const request = event.request;
    const url = new URL(request.url);

    return opts.isValidCachePath(url.pathname) &&//Is fetch a wanted cache?
      request.method === 'GET' &&//Is fetch a GET request?
      url.origin === self.location.origin;//Is fetch from same origin?
  }

  //Yes, let's do it.
  function onFetch(event, opts)
  {
    const request = event.request;
    const url = new URL(request.url);
    let resourceType = 'static';
    let cacheKey;

    //Filter resources by headers...
    const acceptHeader = request.headers.get('Accept');
    console.log("Cache -> " + acceptHeader);
    if (acceptHeader.indexOf('text/html') !== -1)
    {
      resourceType = 'content';
    }
    else if (acceptHeader.indexOf('image') !== -1)
    {
      resourceType = 'image';
    }
    else if (url.pathname.endsWith(".js"))
    {
      resourceType = 'js';
    }
    else if (url.pathname.endsWith(".lang"))
    {
      resourceType = 'lang';
    }
    else// if (...)
    {
      //Filter by other resource types...
    }

    //Use resource type as cache key (not required, but nice)
    cacheKey = cacheName(resourceType, opts);

    //Prioritize content files to always grab network versions FIRST
    if (CONFIG.networkPriority ||
      resourceType === 'content' ||
      (CONFIG.sourcePriority && resourceType === 'js'))
    {
      //Network-first strategy
      event.respondWith(fetch(request)
        .then(response => addToCache(cacheKey, request, response))
        .catch(() => fetchFromCache(event))
        .catch(() => offlineResponse(resourceType, opts))
      );
    }
    //Other files rely on cached files FIRST
    else
    {
      //Cache-first strategy
      event.respondWith(fetchFromCache(event)
        .catch(() => fetch(request))
        .then(response => addToCache(cacheKey, request, response))
        .catch(() => offlineResponse(resourceType, opts))
      );
    }
  }

  //Actually try it.
  if (shouldHandleFetch(event, CONFIG))
  {
    onFetch(event, CONFIG);
  }
});
