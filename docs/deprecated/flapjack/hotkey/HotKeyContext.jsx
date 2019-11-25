import React from 'react';
import PropTypes from 'prop-types';

import { createContextState } from './HotKeyContextState.js';

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = createContextState(null);

// Behold...the hotkey context.
const HotKeyContext = React.createContext(DEFAULT_CONTEXT_VALUE);

class HotKeyProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateAsync = true;

        // This should match the expected shape for the consumers.
        this.state = createContextState(this, props.manager);
    }

    /** @override */
    componentDidMount()
    {
        // Do nothing.
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
            <HotKeyContext.Provider value={this.state}>
                {this.props.children}
            </HotKeyContext.Provider>
        );
    }
}
HotKeyProvider.propTypes = {
    children: PropTypes.node.isRequired,
    //TODO: Fix the type
    manager: PropTypes.any,
};
HotKeyProvider.defaultProps = {
};

// ...and it's provider...
export { HotKeyProvider };
// ...and its consumers...
export const HotKeyConsumer = HotKeyContext.Consumer;
// Not much use for the context, so it's just a default export.
export default HotKeyContext;
