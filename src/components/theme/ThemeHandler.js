import Logger from '@flapjs/util/Logger.js';
import StyleMap from './StyleMap.js';

const LOGGER_TAG = 'Theme';
const BASE_URL = 'themes/';

/**
 * This stores all theme to style mapppings. This is a module-scoped variable
 * instead of living in a global store because this is all static data. There
 * is no reason to change this outside of this component. And since it is used
 * everywhere, by multiple instances of the same provider context as well, you can
 * treat this as a global session cache of sorts.
 */
const THEME_MAPPING = new Map();

const DEFAULT_THEME_NAME = 'default';
const DEFAULT_STYLE_MAP = new StyleMap();
THEME_MAPPING.set(DEFAULT_THEME_NAME, DEFAULT_STYLE_MAP);

/**
 * Checks whether there exists a value for the style in the current theme.
 *
 * @param {ThemeProvider} provider The theme provider to check the theme for. Usually this is bound by the context.
 * @param {string} styleName The style name to look for.
 * @returns {boolean} Whether the style exists for the current theme.
 */
export function hasStyle(provider, styleName)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        return false;
    }

    const themeName = provider.state.themeName;

    if (THEME_MAPPING.has(themeName))
    {
        return THEME_MAPPING.get(themeName).hasStyleName(styleName);
    }
    else
    {
        return false;
    }
}

/**
 * Get the value for the style name given the current theme.
 *
 * @param {ThemeProvider} provider The theme provider to check the theme for. Usually this is bound by the context.
 * @param {string} styleName The style name to get the value for.
 * @returns {string} The style value.
 */
export function getStyle(provider, styleName)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        return DEFAULT_STYLE_MAP.getStyleValue(styleName);
    }
    
    const themeName = provider.state.themeName;
    if (THEME_MAPPING.has(themeName))
    {
        const styleMap = THEME_MAPPING.get(themeName);
        if (styleMap.hasStyleName(styleName))
        {
            return styleMap.getStyleValue(styleName);
        }
    }

    // Couldn't find a style entry...try the initial styles...
    const initialStyleMap = provider.state.initialStyleMap;
    if (initialStyleMap.hasStyleName(styleName))
    {
        return initialStyleMap.getStyleValue(styleName);
    }
    // Couldn't find an initial style entry...just give them the computed...
    else
    {
        const computedStyleMap = provider.state.computedStyleMap;
        return computedStyleMap.getStyleValue(styleName);
    }
}

/**
 * Change the current theme.
 *
 * @param {ThemeProvider} provider The theme provider to change. Usually this is bound by the context.
 * @param {string} themeName The theme name to change to.
 */
export function changeTheme(provider, themeName)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        throw new Error(`No theme provider found for theme '${themeName}'.`);
    }

    if (provider.state.themeName === themeName) return;
    
    loadTheme(themeName).then(result =>
    {
        if (!provider.shouldUpdateTheme) return;

        // When it is done, force a re-render...
        if (!result)
        {
            provider.setState({ themeName: DEFAULT_THEME_NAME });
        }
        else
        {
            provider.setState({ themeName });
        }
    });
    
    // Force a re-render to show the theme styles...
    if (!provider.shouldUpdateTheme) return;
    provider.setState({ themeName });
}

/**
 * Loads the style mapping for the code if not yet loaded.
 * If the theme file for the theme is not found, it will
 * resolve to null. Otherwise, it will resolve to the theme
 * name loaded. In other words, it will not throw if an error
 * occurs.
 *
 * @param {string} themeName The theme name to load the theme file for.
 * @returns {Promise<string>} The promise callback when loading is finished.
 */
export function loadTheme(themeName)
{
    if (!THEME_MAPPING.has(themeName))
    {
        // Prep the component with an empty lang map...
        THEME_MAPPING.set(themeName, DEFAULT_STYLE_MAP);

        // Load the theme file...
        return StyleMap.fetchFromURL(getThemeAssetURL(themeName))
            .then(styleMap =>
            {
                // Then update the mapping...
                THEME_MAPPING.set(themeName, styleMap);

                return themeName;
            })
            .catch(error =>
            {
                Logger.error(LOGGER_TAG, `Could not find theme file for theme '${themeName}'.`, error);

                // Reset back to default...
                THEME_MAPPING.delete(themeName);

                return null;
            });
    }
    else
    {
        return Promise.resolve(themeName);
    }
}

export function getInitialStyleMapForElement(element)
{
    if (!element) return DEFAULT_STYLE_MAP;
    return StyleMap.computeFromElement(element);
}

export function getComputedStyleMapForElement(element)
{
    if (!element) return DEFAULT_STYLE_MAP;
    return new StyleMap(new Map(), (styleName) =>
    {
        const computedStyle = window.getComputedStyle(element);
        const value = computedStyle.getPropertyValue(styleName);
        if (value)
        {
            return value.trim();
        }
        else
        {
            return null;
        }
    });
}

export function getThemeAssetURL(themeName)
{
    return BASE_URL + '/' + themeName + '.theme';
}
