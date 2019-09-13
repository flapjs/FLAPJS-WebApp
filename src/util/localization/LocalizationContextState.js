import * as LocalizationHandler from './LocalizationHandler.js';

/** Creates a context state. This helps maintain a consistant shape for all localization contexts. */
export function createContextState(provider, defaultLocaleCode = '???')
{
    return {
        localeCode: defaultLocaleCode,
        getLocaleString: LocalizationHandler.getLocaleString.bind(null, provider),
        hasLocaleString: LocalizationHandler.hasLocaleString.bind(null, provider),
        changeLocale: LocalizationHandler.changeLocale.bind(null, provider),
    };
}
