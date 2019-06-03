import React from 'react';
import ReactDOM from 'react-dom';

import Logger from 'util/logger/Logger.js';
const LOGGER_TAG = 'App';

import App from 'experimental/App.js';
import Changelog from 'changelog.js';

import LocalStorage from 'util/storage/LocalStorage.js';

const SHOULD_WARN_USERS_ON_EXIT = true;

//Setup app
window.addEventListener('load', (event) => 
{
    Logger.out(LOGGER_TAG, `Preparing for '${process.env.NODE_ENV}' environment...'`);
    Logger.out(LOGGER_TAG, `Loading app version '${process.env.VERSION}'...`);

    try
    {
        loadApplication();
    }
    catch (e)
    {
        throw e;
    }

    //Warn user before exit
    window.addEventListener('beforeunload', (event) => 
    {
        if (SHOULD_WARN_USERS_ON_EXIT && LocalStorage.getData('disableExitWarning') !== 'true')
        {
            const message = I18N.toString('alert.window.exit');
            event = event || window.event;
            // For IE and Firefox
            if (event) event.returnValue = message;
            //For Safari
            return message;
        }
    });

    //Cleanup app
    window.addEventListener('unload', (event) => 
    {
        Logger.out(LOGGER_TAG, 'Unloading app...');
        unloadApplication();
    });

    //Start app
    window.requestAnimationFrame(updateApplication);
});

//Tell the client that an update is available
if (typeof window['isUpdateAvailable'] === 'function')
{
    window.isUpdateAvailable.then(hasUpdate => 
    {
        if (hasUpdate)
        {
            let message = '';
            if (Changelog && Changelog['show'])
            {
                message += Changelog['log'];
            }
    
            Logger.out(LOGGER_TAG, `Found update for version ${process.env.VERSION}...`);
            window.alert('*** New update available! *** \n Please restart the browser.' +
                (message ? '\n' + message : ''));
        }
    });
}

//Setup application
var root;

//Load application
function loadApplication()
{
    root = document.getElementById('root');

    if (App['onWindowLoad'])
    {
        App.onWindowLoad.call(App);
    }
}

//Update application
function updateApplication(time)
{
    ReactDOM.render(React.createElement(App), root);
    window.requestAnimationFrame(updateApplication);
}

//Unload application
function unloadApplication()
{
    if (App['onWindowUnload'])
    {
        App.onWindowUnload.call(App);
    }
}
