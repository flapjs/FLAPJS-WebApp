import React from 'react';
import PropTypes from 'prop-types';

import * as LocalizationHandler from './LocalizationHandler.js';

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = createLocalizationContextState(null);

// Behold...the localization context.
const LocalizationContext = React.createContext(DEFAULT_CONTEXT_VALUE);

// ...and it's provider...
class LocalizationProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateLocale = true;

        // This should match the expected shape for the consumers.
        this.state = createLocalizationContextState(this);
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

/** Creates a context state. This helps maintain a consistant shape for all localization contexts. */
function createLocalizationContextState(provider, defaultLocaleCode = '???')
{
    return {
        localeCode: defaultLocaleCode,
        getLocaleString: LocalizationHandler.getLocaleString.bind(null, provider),
        hasLocaleString: LocalizationHandler.hasLocaleString.bind(null, provider),
        changeLocale: LocalizationHandler.changeLocale.bind(null, provider),
    };
}

export { LocalizationProvider };
// ...and its consumers...
export const LocalizationConsumer = LocalizationContext.Consumer;
// Not much use for the context, so it's just a default export.
export default LocalizationContext;
