import Logger from 'util/logger/Logger.js';
import StyleEntry from './style/StyleEntry.js';

const LOGGER_TAG = 'Theme';
//TODO: this should be only lang/ when have server
const BASE_URL = 'dist/theme/';

class Theme
{
    constructor(themeName, styleMapping = new Map())
    {
        this._name = themeName;
        this._styles = styleMapping;
    }

    static fetchThemeFile(themeName, callback)
    {
        Logger.out(LOGGER_TAG, `Fetching theme file '${themeName}'...`);
        const request = new XMLHttpRequest();
        request.onreadystatechange = function () 
        {
            if (request.readyState === 4/* READY */ &&
                request.status === 200/* GOT REPONSE */)
            {
                const result = request.responseText;
                callback(result);
            }
        };
        request.onerror = function () 
        {
            Logger.out(LOGGER_TAG, `Unable to find theme file for '${themeName}'.`);
        };
        request.open('GET', BASE_URL + themeName + '.theme', true);
        request.setRequestHeader('Content-Type', 'text/strings');
        request.send();
    }

    static loadThemeFile(themeName, themeData, callback)
    {
        Logger.out(LOGGER_TAG, `Loading theme file '${themeName}'...`);

        const result = new Theme(themeName);

        //Load theme file
        let separator, key, value;
        const lines = themeData.split('\n');
        for (let line of lines)
        {
            line = line.trim();
            if (line.startsWith('//')) continue;
            if (line.startsWith('//TODO:'))
            {
                Logger.out(LOGGER_TAG, `Warning - found incomplete theme file: theme file '${line.substring('//'.length).trim()}'.`);
            }

            separator = line.indexOf('=');
            if (separator < 0) continue;

            key = line.substring(0, separator).trim();
            value = line.substring(separator + 1).trim();
            if (key.length == 0) continue;

            result._styles.set(key, new StyleEntry(key, value));
        }

        Logger.out(LOGGER_TAG, `Theme file '${themeName}' loaded.`);

        callback(result);
    }

    addStyle(variableName, value)
    {
        this._styles.set(variableName, new StyleEntry(variableName, value));
        return this;
    }

    removeStyle(variableName)
    {
        this._styles.delete(variableName);
        return this;
    }

    getStyles() { return this._styles.values(); }
    getStyleByName(variableName) { return this._styles.get(variableName); }
    getName() { return this._name; }
}

export default Theme;