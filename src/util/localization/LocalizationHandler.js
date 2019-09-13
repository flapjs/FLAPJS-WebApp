import Logger from '@flapjs/util/Logger.js';
import LanguageMap from './LanguageMap.js';

const LOGGER_TAG = 'Localization';
const BASE_URL = 'langs/';

/**
 * This stores all locale to language mapppings. This is a module-scoped variable
 * instead of living in a global store because this is all static data. There
 * is no reason to change this outside of this component. And since it is used
 * everywhere, by multiple instances of the same provider context as well, you can
 * treat this as a global session cache of sorts.
 */
const LOCALE_MAPPING = new Map();
const FALLBACK_LOCALE_CODE = 'en_us';

/**
 * This serves as a transition state for any language map switching.
 */
const DEFAULT_LANGUAGE_MAP = new LanguageMap(new Map(), '...');

/**
 * This is usually helpful for debugging.
 */
const IDENTITY_LANGUAGE_MAP = new LanguageMap(new Map(), (entityName) => entityName);

/**
 * Checks whether there exists a translated string for the entity in the current locale.
 * @param {LocalizationProvider} provider The localization provider to check the locale for. Usually this is bound by the context.
 * @param {String} entityName The unlocalized name to be translated.
 * @returns {Boolean} Whether the entity exists for the current locale.
 */
export function hasLocaleString(provider, entityName)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        return false;
    }

    const localeCode = provider.state.localeCode;

    if (LOCALE_MAPPING.has(localeCode))
    {
        return LOCALE_MAPPING.get(localeCode).hasEntityName(entityName);
    }
    else
    {
        return false;
    }
}

/**
 * Get the translated string for the entity name given the current locale.
 * @param {LocalizationProvider} provider The localization provider to check the locale for. Usually this is bound by the context.
 * @param {String} entityName The unlocalized name to be translated.
 * @param {...String} args Parameters for the translated string.
 * @returns {String} The translated string.
 */
export function getLocaleString(provider, entityName, ...args)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        return DEFAULT_LANGUAGE_MAP.getTranslatedString(entityName, ...args);
    }
    
    const localeCode = provider.state.localeCode;

    // None found...
    if (!LOCALE_MAPPING.has(localeCode))
    {
        // At least you can see what options were given...
        return IDENTITY_LANGUAGE_MAP.getTranslatedString(entityName, ...args);
    }
    else
    {
        const languageMap = LOCALE_MAPPING.get(localeCode);
        if (languageMap.hasEntityName(entityName))
        {
            return languageMap.getTranslatedString(entityName, ...args);
        }
        else
        {
            // Couldn't find a translation entry...try the fallback locale...
            if (LOCALE_MAPPING.has(FALLBACK_LOCALE_CODE))
            {
                const fallbackLanguageMap = LOCALE_MAPPING.get(localeCode);
                if (fallbackLanguageMap.hasEntityName(entityName))
                {
                    return fallbackLanguageMap.getTranslatedString(entityName, ...args);
                }
                else
                {
                    // Couldn't find a fallback translation entry...just give them the default...
                    return IDENTITY_LANGUAGE_MAP.getTranslatedString(entityName, ...args);
                }
            }
            else
            {
                // No fallback exists. This probably means we want to report this. So just return null...
                return null;
            }
        }
    }
}

/**
 * Change the current locale.
 * @param {LocalizationProvider} provider The localization provider to change. Usually this is bound by the context.
 * @param {String} localeCode The locale code to change to.
 */
export function changeLocale(provider, localeCode)
{
    // No provider was given, this is probably an error.
    if (!provider)
    {
        throw new Error(`No localization provider found for locale '${localeCode}'.`);
    }

    if (provider.state.localeCode === localeCode) return;
    
    loadLocale(localeCode).then(result =>
    {
        if (!provider.shouldUpdateAsync) return;

        // When it is done, force a re-render...
        if (!result)
        {
            provider.setState({ localeCode: DEFAULT_LANGUAGE_MAP.localeCode });
        }
        else
        {
            provider.setState({ localeCode });
        }
    });
    
    // Force a re-render to show the transition strings...
    if (!provider.shouldUpdateAsync) return;
    provider.setState({ localeCode });
}

/**
 * Loads the locale mapping for the code if not yet loaded.
 * If the language file for the locale is not found, it will
 * resolve to null. Otherwise, it will resolve to the locale
 * code loaded. In other words, it will not throw if an error
 * occurs.
 * @param {String} localeCode The locale code to load the language file for.
 * @returns {Promise<String>} The promise callback when loading is finished.
 */
export function loadLocale(localeCode)
{
    if (!LOCALE_MAPPING.has(localeCode))
    {
        // Prep the component with an empty lang map...
        LOCALE_MAPPING.set(localeCode, DEFAULT_LANGUAGE_MAP);

        // Load the locale file...
        return LanguageMap.fetchFromURL(getLanguageAssetURL(localeCode))
            .then(languageMap =>
            {
                // Then update the mapping...
                LOCALE_MAPPING.set(localeCode, languageMap);

                return localeCode;
            })
            .catch(error =>
            {
                Logger.error(LOGGER_TAG, `Could not find language file for locale '${localeCode}'.`, error);

                // Reset back to default...
                LOCALE_MAPPING.delete(localeCode);

                return null;
            });
    }
    else
    {
        return Promise.resolve(localeCode);
    }
}

export function getLanguageAssetURL(localeCode)
{
    return BASE_URL + '/' + localeCode + '.lang';
}
