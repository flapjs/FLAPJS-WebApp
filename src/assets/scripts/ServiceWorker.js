/* eslint-env serviceworker */
/* global workbox */

// https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
// You should not use skipWaiting, since it may break other pages currently using that version.
// workbox.core.skipWaiting();

// You should not use clientsClaim; it is good for quick reload, but they really should ask the user first before it happens.
// workbox.core.clientsClaim();

addEventListener('message', e =>
{
    if (e.data === 'skipWaiting') return skipWaiting();
});

addEventListener('fetch', event =>
{
    (async () =>
    {
        if (event.request.mode === 'navigate' &&
            event.request.method === 'GET' &&
            registration.waiting &&
            (await clients.matchAll()).length < 2)
        {
            registration.waiting.postMessage('skipWaiting');
            return new Response('', { headers: { 'Refresh': '0' } });
        }

        return await caches.match(event.request) || fetch(event.request);
    })()
        .then((result) => event.respondWith(result))
        .catch(e => {/* If it doesn't succeed... just give up. */});
});

/** Setup workbox options */
workbox.core.setCacheNameDetails({
    prefix: 'flapjs'
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * 
 * @see {@link https://goo.gl/S9QRab}
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/, new workbox.strategies.CacheFirst());
workbox.routing.registerRoute(/.*/, new workbox.strategies.NetworkFirst());
