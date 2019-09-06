/* global module */
/* global NODE_ENV */

import React from 'react';
import ReactDOM from 'react-dom';
import Logger from './util/Logger.js';
import App from './components/app/App.jsx';

const LOGGER_TAG = 'Main';

// NOTE: NODE_ENV is defined in `template.html` as a global.
Logger.out(LOGGER_TAG, `Loading app in ${NODE_ENV} environment...`);

function render(Component)
{
    ReactDOM.render(React.createElement(Component), document.getElementById('root'));
}

render(App);

if (module.hot)
{
    module.hot.accept('./components/app/App.jsx', () => render(App));
}
