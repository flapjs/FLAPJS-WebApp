import React from 'react';
import PropTypes from 'prop-types';

import LanguageMap from './LanguageMap.js';
import Logger from '../Logger.js';

const LOGGER_TAG = 'Localization';

/**
 * This serves as a transition state for any language map switching.
 */
const DEFAULT_LANGUAGE_MAP = new LanguageMap(new Map(), '...');
const FALLBACK_LOCALE_CODE = 'en';

/**
 * This stores all locale to language mapppings. This is a module-scoped variable
 * instead of living in a global store because this is all static data. There
 * is no reason to change this outside of this component. And since it is used
 * everywhere, by multiple instances of the same provider context as well, you can
 * treat this as a global session cache of sorts.
 */
const LOCALE_MAPPING = new Map();

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = {
    localeCode: 'default',
    getLocaleString: (entityName, ...args) =>
    {
        return DEFAULT_LANGUAGE_MAP.getTranslatedString(entityName, ...args);
    },
    changeLocale: (localeCode) =>
    {
        throw new Error(`No localization provider found for locale '${localeCode}'.`);
    }
};

const LocalizationContext = React.createContext(DEFAULT_CONTEXT_VALUE);

class LocalizationProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateLocale = true;

        // This should match the expected shape for the consumers.
        this.state = {
            localeCode: 'default',
            getLocaleString: (entityName, ...args) =>
            {
                const localeCode = this.state.localeCode;
                // None found...
                if (!LOCALE_MAPPING.has(localeCode))
                {
                    // At least you can see what options were given...
                    return getDefaultEntityTranslation(entityName, args);
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
                                return getDefaultEntityTranslation(entityName, args);
                            }
                        }
                        else
                        {
                            // No fallback exists. This probably means we want to report this. So just return null...
                            return null;
                        }
                    }
                }
            },
            changeLocale: (localeCode) =>
            {
                if (this.state.localeCode === localeCode) return;
                
                loadLocale(localeCode).then(result =>
                {
                    if (!this.shouldUpdateLocale) return;

                    // When it is done, force a re-render...
                    if (!result)
                    {
                        this.setState({ localeCode: DEFAULT_CONTEXT_VALUE.localeCode });
                    }
                    else
                    {
                        this.setState({ localeCode });
                    }
                });
                
                // Force a re-render to show the transition strings...
                if (!this.shouldUpdateLocale) return;
                this.setState({ localeCode });
            }
        };
    }

    /** @override */
    componentDidMount()
    {
        this.state.changeLocale(this.props.localeCode);
    }

    /** @override */
    componentWillUnmount()
    {
        // Don't update this component anymore, cause IT'S DEAD!
        this.shouldUpdateLocale = false;
    }

    /** @override */
    render()
    {
        return (
            <LocalizationContext.Provider value={this.state}>
                {this.props.children}
            </LocalizationContext.Provider>
        );
    }
}
LocalizationProvider.propTypes = {
    localeCode: PropTypes.string,
    children: PropTypes.node.isRequired,
};
LocalizationProvider.defaultProps = {
    localeCode: DEFAULT_CONTEXT_VALUE.localeCode,
};

function getDefaultEntityTranslation(entityName, args)
{
    if (args.length > 0)
    {
        return entityName + JSON.stringify(args);
    }
    else
    {
        return entityName;
    }
}

function getLanguageAssetURL(localeCode)
{
    return 'langs/' + localeCode + '.lang';
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
function loadLocale(localeCode)
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

export { LocalizationProvider };
export const LocalizationConsumer = LocalizationContext.Consumer;
export default LocalizationContext;
