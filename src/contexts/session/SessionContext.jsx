import React from 'react';
import PropTypes from 'prop-types';

// Behold...the session context (does not have a reducer).
const SessionContext = React.createContext();

// ...and it's provider...
class SessionProvider extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;
        return (
            <SessionContext.Provider value={props.session}>
                {props.children}
            </SessionContext.Provider>
        );
    }
}
SessionProvider.propTypes = {
    children: PropTypes.node.isRequired,
    session: PropTypes.object.isRequired,
};

function SessionConsumer(props)
{
    return (
        <SessionContext.Consumer>
            {
                context =>
                {
                    if (!context) throw new Error('Context consumer missing parent provider.');
                    return props.children(context);
                }
            }
        </SessionContext.Consumer>
    );
}
SessionConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

// ...together as a family at last.
export {
    SessionProvider,
    SessionConsumer,
    SessionContext,
};
