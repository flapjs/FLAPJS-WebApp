import React from 'react';
import PropTypes from 'prop-types';

import { uuid } from '@flapjs/util/MathHelper.js';

// Behold...the session context.
const SessionStateContext = React.createContext();
const SessionDispatchContext = React.createContext();

// ...and it's provider...
class SessionProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // Load default app-defined state...
        if (typeof props.onLoad === 'function')
        {
            props.onLoad(props.state);
        }

        // This should match the expected shape for the consumers.
        this.state = {
            sessionName: 'Untitled',
            sessionID: uuid(),
            ...props.state
        };

        // This should match the expected interface for the consumers.
        this.dispatch = this.dispatch.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        if (typeof this.props.onDidMount === 'function')
        {
            this.props.onDidMount(this);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        if (typeof this.props.onWillUnmount === 'function')
        {
            this.props.onWillUnmount(this);
        }

        if (typeof this.props.onUnload === 'function')
        {
            this.props.onUnload(this.state);
        }
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
                return action.value;
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
    onLoad: PropTypes.func,
    onDidMount: PropTypes.func,
    onWillUnmount: PropTypes.func,
    onUnload: PropTypes.func,
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
