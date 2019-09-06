/* global NODE_ENV */

// NOTE: NODE_ENV is defined in `template.html` as a global.
if (NODE_ENV === 'production' && 'serviceWorker' in navigator)
{
    window.addEventListener('load', function() 
    {
        navigator.serviceWorker.register('/service-worker.js').then(registration =>
        {
            // https://redfin.engineering/service-workers-break-the-browsers-refresh-button-by-default-here-s-why-56f9417694
            // https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68

            function listenForWaitingServiceWorker(reg, callback)
            {
                function awaitStateChange()
                {
                    reg.installing.addEventListener('statechange', function()
                    {
                        if (this.state === 'installed') callback(reg);
                    });
                }
                if (!reg) return;
                if (reg.waiting) return callback(reg);
                if (reg.installing) awaitStateChange();
                reg.addEventListener('updatefound', awaitStateChange);
            }

            // Reload once when the new service worker starts activating...
            var refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', function()
            {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });

            function promptUserToRefresh(reg)
            {
                // TODO: This is just an example, please do something better...
                if (window.confirm('New version available! OK to refresh?'))
                {
                    reg.waiting.postMessage('skipWaiting');
                }
            }

            listenForWaitingServiceWorker(registration, promptUserToRefresh);
        });
    });
}
