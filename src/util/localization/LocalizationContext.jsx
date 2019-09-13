import React from 'react';
import PropTypes from 'prop-types';

import { createContextState } from './LocalizationContextState.js';

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = createContextState(null);

// Behold...the localization context.
const LocalizationContext = React.createContext(DEFAULT_CONTEXT_VALUE);

class LocalizationProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateAsync = true;

        // This should match the expected shape for the consumers.
        this.state = createContextState(this);
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
        this.shouldUpdateAsync = false;
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

// ...and it's provider...
export { LocalizationProvider };
// ...and its consumers...
export const LocalizationConsumer = LocalizationContext.Consumer;
// Not much use for the context, so it's just a default export.
export default LocalizationContext;
