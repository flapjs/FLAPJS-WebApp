//This is the github-ready service worker
// - Config must stay in service worker to trigger update
// - Must be at the root
// - Must also NEVER rename the file

//TODO: When we get a server, this needs to be at the root!
//TODO: when we get a server, remove all  "dist/"
//TODO: Don't forget to remove \/dist\/ from isValidCachePath

const CONFIG = {
  version: '0.2.0',         //Change this to invalidate user caches, refer to CURRENT_VERSION
  forceNetworkFirst: true,  //For debuggin' purposes, force load everything!
  networkPriority: [
    'content'
  ],
  staticCacheItems: [       //Static cache for installing
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

    './dist/css/style.css'
  ],
  isValidPathToCache(cachePath)
  {
    const pattern = /^\/((dist|FLAPJS-WebApp\/dist)\/(images|src|css|lang)\/|.*(\.html)$)/g;
    const result = pattern.exec(cachePath);
    return result;
  },
  getResourceType(request)
  {
    const url = new URL(request.url);
    //Filter resources by headers...
    const acceptHeader = request.headers.get('Accept');

    //TODO: For debuggin'
    console.log("[ServiceWorker] Resolving fetch for \'" + url.pathname + "\' with header: " + acceptHeader + "...");

    //TODO: this should work, but it doesn't. Probably server settings.
    if (url.pathname.endsWith(".html") || acceptHeader.indexOf('text/html') !== -1)
    {
      return 'content';
    }
    else if (acceptHeader.indexOf('image') !== -1)
    {
      return 'image';
    }
    else if (url.pathname.endsWith(".js"))
    {
      return 'js';
    }
    else if (url.pathname.endsWith(".lang"))
    {
      return 'lang';
    }
    else// if (...)
    {
      //Filter by other resource types...
    }

    return undefined;
  },
  getOfflineResponse(resourceType)
  {
    if (resourceType === 'content')
    {
      return caches.match('./dist/offline/offline.html');
    }
    else if (responseType === 'image')
    {
      return caches.match('./dist/offline/offline.png');
    }
    else// if (responseType === ...)
    {
      //Handle any other resources that have offline versions...
    }

    return undefined;
  }
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
    return opts.isValidPathToCache(url.pathname) &&   //Is fetch a wanted cache?
      request.method === 'GET' &&                     //Is fetch a GET request?
      url.origin === self.location.origin;            //Is fetch from same origin?
  }

  //Yes, let's do it.
  function onFetch(event, opts)
  {
    const request = event.request;
    const resourceType = opts.getResourceType(request) || 'static';

    //Use resource type as cache key (not required, but nice)
    const cacheKey = cacheName(resourceType, opts);

    //Prioritize content files to always grab network versions FIRST
    if (opts.forceNetworkFirst || opts.networkPriority.includes(resourceType))
    {
      //Network-first strategy
      event.respondWith(fetch(request)
        .then(response => addToCache(cacheKey, request, response))
        .catch(() => fetchFromCache(event))
        .catch(() => opts.getOfflineResponse(resourceType))
      );
    }
    //Other files rely on cached files FIRST
    else
    {
      //Cache-first strategy
      event.respondWith(fetchFromCache(event)
        .catch(() => fetch(request))
        .then(response => addToCache(cacheKey, request, response))
        .catch(() => opts.getOfflineResponse(resourceType))
      );
    }
  }

  //Actually try it.
  if (shouldHandleFetch(event, CONFIG))
  {
    onFetch(event, CONFIG);
  }
});
