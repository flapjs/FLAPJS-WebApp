import React from 'react';
import PropTypes from 'prop-types';

/**
 * SessionContext is only the interface "holder" of the information.
 * It should not manage, handle, or keep any of the data. That should
 * be delegated elsewhere. Hence, why SessionProvider only takes a
 * 'state' as a prop to begin as the initial state for the session and
 * 'reducer' as a function to change the state (that will cause a re-render).
 * 
 * Ideally, this should only be changed at the start and end of a module.
 * Any changes within a module, such as a graph or a drawer, should be delegated
 * to another provider nested under this one. It could even be dependent on this.
 * 
 * This way, SessionProvider is only an interface between the data and
 * rendering model for a module.
 */

// Behold...the session context.
const SessionStateContext = React.createContext();
const SessionDispatchContext = React.createContext();

// ...and it's provider...
class SessionProvider extends React.Component
{
    /** @override */
    static getDerivedStateFromProps(props, state)
    {
        return { ...props.state };
    }

    constructor(props)
    {
        super(props);

        // This should match the expected shape for the consumers.
        this.state = { ...props.state };

        // This should match the expected interface for the consumers.
        this.dispatch = this.dispatch.bind(this);
    }

    dispatch(action)
    {
        let result;
        switch(action.type)
        {
            case 'changeSessionName':
                result = { sessionName: action.value };
                break;
            case 'setState':
                result = action.value;
                break;
            default:
                result = this.props.reducer(this.state, action);
        }

        if (result)
        {
            this.setState(result);
        }
    }

    /** @override */
    render()
    {
        return (
            <SessionStateContext.Provider value={this.state}>
                <SessionDispatchContext.Provider value={this.dispatch}>
                    {this.props.children}
                </SessionDispatchContext.Provider>
            </SessionStateContext.Provider>
        );
    }
}
SessionProvider.propTypes = {
    children: PropTypes.node.isRequired,
    state: PropTypes.object,
    reducer: PropTypes.func,
};
SessionProvider.defaultProps = {
    state: {},
    reducer: fallbackReducer
};

// ...and it's fallback reducer (for the one ALWAYS used, refer below)...
function fallbackReducer(state, action)
{
    return { [action.type]: action.value };
}

// ...and it's consumers...
function SessionConsumer(props)
{
    return (
        <SessionStateConsumer>
            {
                stateContext =>
                    <SessionDispatchConsumer>
                        {
                            dispatchContext => props.children(stateContext, dispatchContext)
                        }
                    </SessionDispatchConsumer>
            }
        </SessionStateConsumer>
    );
}
SessionConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

function SessionStateConsumer(props)
{
    return (
        <SessionStateContext.Consumer>
            {
                context =>
                {
                    if (!context) throw new Error('Context consumer missing parent provider.');
                    return props.children(context);
                }
            }
        </SessionStateContext.Consumer>
    );
}
SessionStateConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

function SessionDispatchConsumer(props)
{
    return (
        <SessionDispatchContext.Consumer>
            {
                context =>
                {
                    if (!context) throw new Error('Context consumer missing parent provider.');
                    return props.children(context);
                }
            }
        </SessionDispatchContext.Consumer>
    );
}
SessionDispatchConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

// ...together as a family at last.
export {
    SessionProvider,
    SessionConsumer,
    SessionStateConsumer,
    SessionDispatchConsumer,
    SessionStateContext,
    SessionDispatchContext,
};
