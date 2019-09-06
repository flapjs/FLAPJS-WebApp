/* eslint-env node */

/*
 * This will re-direct to the appropriate webpack config based on
 * the --env command line argument. This means that the --env value
 * MUST match the file extension, either 'development' or 'production'.
 * 
 * Although any further webpack configs may be in a different directory,
 * they will all be processed at the project directory, NOT at the config
 * file directory. This means that you can access the src folder at './src'.
 */
module.exports = (env) => require(`./.webpack/${env}.config.js`);
