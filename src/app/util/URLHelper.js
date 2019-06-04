/**
 * Contains utility functions for url-related actions.
 * @module URLHelper
 */

/**
 * Gets the current window's url,
 * 
 * @returns {String} the current url
 */
export function getCurrentURL()
{
    return window.location.href;
}

/**
 * Gets the parameters in the url.
 * Refer to {@link https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/} for more information.
 * 
 * @param {String} url the full url
 * @returns {Object} an object mapping from parameter name to value
 */
export function getURLParameters(url)
{
    const result = {};
    const parser = document.createElement('a');
    parser.href = url;
    const query = parser.search.substring(1);
    const vars = query.split('&');
    for(const v of vars)
    {
        const pair = v.split('=');
        result[pair[0]] = decodeURIComponent(pair[1]);
    }
    return result;
}
