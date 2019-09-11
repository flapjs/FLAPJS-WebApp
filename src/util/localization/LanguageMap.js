class LanguageMap
{
    /**
     * Creates a LanguageMap from the language file at the url.
     * @param {String} url The url to fetch the language file from.
     * @returns {LanguageMap} The created language map with the parsed file contents.
     */
    static fetchFromURL(url)
    {
        return fetch(url)
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error(response.statusText);
                }

                return response.text().then(result =>
                {
                    return LanguageMap.parse(result);
                });
            });
    }

    /**
     * Creates a LanguageMap from the file contents.
     * @param {String} languageFileData The entire language file content data.
     * @returns {LanguageMap} The created language map with the parsed file contents.
     */
    static parse(languageFileData)
    {
        const entityMapping = new Map();
        const lines = languageFileData.split('\n');
        let lineCount = 0;
        for(let line of lines)
        {
            ++lineCount;
            line = line.trim();
            // Allow comments...
            if (line.startsWith('//')) continue;
            // Skip empty lines...
            if (line.length <= 0) continue;

            const index = line.indexOf('=');
            if (index < 0)
            {
                throw new Error(`Invalid language file format - cannot find assignment for line ${lineCount}.`);
            }

            const entityName = line.substring(0, index).trim();
            if (entityName.length <= 0)
            {
                throw new Error('Invalid language entity name format - cannot be empty string.');
            }
            else if (/[^-_.A-Za-z0-9]/.test(entityName))
            {
                throw new Error('Invalid language entity name format - entity name must only use alphanumeric characters, periods, hyphens, and dashes.');
            }

            const translation = line.substring(index + 1).trim();
            entityMapping.set(entityName, translation);
        }
        return new LanguageMap(entityMapping);
    }

    /**
     * @param {Map<String, String>} entityMapping The entity mapping of entity names to translated strings.
     * @param {String|Function} defaultValue The default value if no entity could be found.
     */
    constructor(entityMapping = new Map(), defaultValue = null)
    {
        this.entities = entityMapping;
        this.defaultValue = defaultValue;
    }

    /**
     * Whether there exists a entity to translated string entry in the map.
     * @param {String} entityName The entity name to look for.
     * @returns {Boolean} Whether the entity exists in the map.
     */
    hasEntityName(entityName)
    {
        return this.entities.has(entityName);
    }

    /**
     * Gets the translated string for the given entity name and parameters.
     * @param {String} entityName The name of the entity to be translated.
     * @param  {...any} args Any parameters for the translated entity. 
     * @returns {String} The translated string, or null if unable to translate.
     */
    getTranslatedString(entityName, ...args)
    {
        if (this.entities.has(entityName))
        {
            const translationTemplate = this.entities.get(entityName);
            return parameterizeString(translationTemplate, args);
        }
        else if (typeof this.defaultValue === 'function')
        {
            return this.defaultValue.call(null, entityName, ...args);
        }
        else
        {
            return this.defaultValue;
        }
    }
}

/**
 * Replaces all instances of '$#', where # is a number, in the string to the
 * corresponding parameter element. The number corresponds directly to the index
 * in the parameter array, therefore it starts at 0.
 * @param {String} string The string to parameterize.
 * @param {Array<String>} params The parameters to insert into the string.
 */
function parameterizeString(string, params)
{
    return string.replace(/\$(\d+)/g, (substring, param1) =>
    {
        const paramValue = Number(param1);
        if (params.length > paramValue)
        {
            return params[paramValue];
        }
        else
        {
            return '$' + paramValue;
        }
    });
}

export default LanguageMap;
