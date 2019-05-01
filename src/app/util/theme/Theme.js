import StyleEntry from './StyleEntry.js';

const BASE_URL = 'color/';

class Theme
{
    constructor(themeName)
    {
        this._name = themeName;

        this._styles = new Map();
    }

    static fetchThemeFile(themeName, callback)
    {
        console.log('[Theme] Fetching theme file \'' + themeName + '\'...');
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() 
        {
            if (request.readyState === 4/* READY */ &&
        request.status === 200/* GOT REPONSE */)
            {
                const result = request.responseText;
                callback(result);
            }
        };
        request.onerror = function() 
        {
            console.log('[Theme] Unable to find theme file for \'' + themeName + '\'.');
        };
        request.open('GET', BASE_URL + themeName + '.theme', true);
        request.setRequestHeader('Content-Type', 'text/strings');
        request.send();
    }

    static loadThemeFile(themeName, themeData, callback)
    {
        console.log('[Theme] Loading theme file \'' + themeName + '\'...');

        const result = new Theme(themeName);

        //Load theme file
        let separator, key, value;
        const lines = themeData.split('\n');
        for(let line of lines)
        {
            line = line.trim();
            if (line.startsWith('//')) continue;
            if (line.startsWith('//TODO:'))
            {
                console.log('[Theme] Warning - found incomplete theme file: ' + line.substring('//'.length).trim());
            }

            separator = line.indexOf('=');
            if (separator < 0) continue;

            key = line.substring(0, separator).trim();
            value = line.substring(separator + 1).trim();
            if (key.length == 0) continue;

            result._styles.set(key, new StyleEntry(key, value));
        }

        console.log('[Theme] Theme file \'' + themeName + '\' loaded.');

        callback(result);
    }

    getStyles() { return this._styles.values(); }
    getStyle(variableName) { return this._styles.get(variableName); }
    getName() { return this._name; }
}

export default Theme;
