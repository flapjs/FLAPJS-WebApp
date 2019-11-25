import React from 'react';
import PropTypes from 'prop-types';

import { createContextState } from './NotificationContextState.js';

// These options serves as a fallback if no provider is created...
const DEFAULT_CONTEXT_VALUE = createContextState(null);

// Behold...the notification context.
const NotificationContext = React.createContext(DEFAULT_CONTEXT_VALUE);

class NotificationProvider extends React.Component
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
            <NotificationContext.Provider value={this.state}>
                {this.props.children}
            </NotificationContext.Provider>
        );
    }
}
NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
    //TODO: Fix the type
    manager: PropTypes.any,
};
NotificationProvider.defaultProps = {
};

// ...and it's provider...
export { NotificationProvider };
// ...and its consumers...
export const NotificationConsumer = NotificationContext.Consumer;
// Not much use for the context, so it's just a default export.
export default NotificationContext;
