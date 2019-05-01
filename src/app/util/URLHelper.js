export function getCurrentURL()
{
    return window.location.href;
}

//https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
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
