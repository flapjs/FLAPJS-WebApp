/* global module */
/* global NODE_ENV */
/* global __VERSION__ */

import React from 'react';
import ReactDOM from 'react-dom';
import Logger from './util/Logger.js';
import App from './components/app/App.jsx';

const LOGGER_TAG = 'Main';

// NOTE: NODE_ENV is defined in `template.html` as a global.
Logger.out(LOGGER_TAG, `Preparing app for ${NODE_ENV} environment...`);
// NOTE: __VERSION__ is defined by Webpack with the DefinePlugin.
Logger.out(LOGGER_TAG, `Loading app version '${__VERSION__}'...`);

function render(element)
{
    ReactDOM.render(element, document.getElementById('root'));
}

render(
    React.createElement(
        App, {}
    )
);

if (module.hot)
{
    Logger.out(LOGGER_TAG, '...in debug mode for hot-reload...');
    module.hot.accept('./components/app/App.jsx', () => render(App));
}
