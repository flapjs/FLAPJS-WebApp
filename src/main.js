/* global module */
/* global NODE_ENV */
/* global __VERSION__ */

// NOTE: This is for polyfill
// eslint-disable-next-line import/no-unassigned-import
import 'core-js/stable';
// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime';

import Logger from './util/Logger.js';
import FlapJSApplication from './FlapJSApplication.js';

// NOTE: NODE_ENV is defined in `template.html` as a global.
Logger.out('Main', `Preparing app for ${NODE_ENV} environment...`);
// NOTE: __VERSION__ is defined by Webpack with the DefinePlugin.
Logger.out('Main', `Loading app version '${__VERSION__}'...`);

// Initial rendering...
FlapJSApplication.start();

// Debug rendering...
if (module.hot)
{
    Logger.out('Main', '...in debug mode for hot-reload...');
    module.hot.accept('./FlapJSApplication.js', () => FlapJSApplication.render());
}
