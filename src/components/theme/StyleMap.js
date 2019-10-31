class StyleMap
{
    /**
     * Creates a StyleMap from the theme file at the url.
     *
     * @param {string} url The url to fetch the theme file from.
     * @returns {StyleMap} The created style map with the parsed file contents.
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
                    return StyleMap.parse(result);
                });
            });
    }

    /**
     * Creates a StyleMap from the file contents.
     *
     * @param {string} themeFileData The entire theme file content data.
     * @returns {StyleMap} The created style map with the parsed file contents.
     */
    static parse(themeFileData)
    {
        const styleMapping = new Map();
        const lines = themeFileData.split('\n');
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
                throw new Error(`Invalid theme file format - cannot find assignment for line ${lineCount}.`);
            }

            const styleName = line.substring(0, index).trim();
            if (styleName.length <= 0)
            {
                throw new Error('Invalid theme style name format - cannot be empty string.');
            }
            else if (/[^-_A-Za-z0-9]/.test(styleName))
            {
                throw new Error('Invalid theme style name format - style name must only use alphanumeric characters, hyphens, and dashes.');
            }

            const value = line.substring(index + 1).trim();
            styleMapping.set(styleName, value);
        }
        return new StyleMap(styleMapping);
    }

    /**
     * Creates a StyleMap of CSS variables from the element.
     *
     * @param {Element} element The DOM element to compute from.
     * @returns {StyleMap} The created style map with the parsed file contents.
     */
    static computeFromElement(element)
    {
        const styleMapping = new Map();
        const computedStyle = window.getComputedStyle(element);
        for(const key of Object.keys(computedStyle))
        {
            // Assumes this is a CSS variable...
            if (key.startsWith('--'))
            {
                const value = computedStyle.getPropertyValue(key);
                if (value)
                {
                    styleMapping.set(key, value.trim());
                }
            }
        }
        return new StyleMap(styleMapping);
    }

    /**
     * @param {Map<string, string>} entityMapping The entity mapping of entity names to translated strings.
     * @param styleMapping
     * @param {string|Function} defaultValue The default value if no entity could be found.
     */
    constructor(styleMapping = new Map(), defaultValue = null)
    {
        this.styles = styleMapping;
        this.defaultValue = defaultValue;
    }

    /**
     * Whether there exists a style for the current map.
     *
     * @param {string} styleName The style name to look for.
     * @returns {boolean} Whether the style exists in the map.
     */
    hasStyleName(styleName)
    {
        return this.styles.has(styleName);
    }

    /**
     * Gets the value for the style name.
     *
     * @param {string} styleName The name of the style to get the value for.
     * @returns {string} The mapped style value.
     */
    getStyleValue(styleName)
    {
        if (this.styles.has(styleName))
        {
            return this.styles.get(styleName);
        }
        else if (typeof this.defaultValue === 'function')
        {
            return this.defaultValue.call(null, styleName);
        }
        else
        {
            return this.defaultValue;
        }
    }
}

export default StyleMap;
