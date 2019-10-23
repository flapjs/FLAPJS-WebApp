import React from 'react';
import PropTypes from 'prop-types';

import { uuid } from '@flapjs/util/MathHelper.js';

import Logger from '@flapjs/util/Logger.js';
const LOGGER_TAG = 'SessionContext';

// Behold...the session context.
const SessionStateContext = React.createContext();
const SessionDispatchContext = React.createContext();

// ...and it's fallback reducer (for the one ALWAYS used, refer below)...
function fallbackReducer(state, action)
{
    switch(action.type)
    {
        case 'set':
            return { [action.key]: action.value };
        default:
            throw new Error(`Unsupported reducer action '${action}'.`);
    }
}

// ...and it's provider...
class SessionProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        const currentModule = props.module;

        let initialState = {};
        let currentReducer = fallbackReducer;

        if (currentModule)
        {
            try
            {
                if (typeof currentModule.load === 'function')
                {
                    initialState = currentModule.load(initialState) || initialState;
                }
            }
            catch(e)
            {
                initialState = {};
                Logger.error(LOGGER_TAG, 'Module failed initialize state.', e);
            }

            if (typeof currentModule.reducer === 'function')
            {
                currentReducer = currentModule.reducer;
            }
        }

        // This should match the expected shape for the consumers.
        this.state = {
            module: currentModule,
            moduleID: currentModule ? currentModule.id : null,
            sessionName: 'Untitled',
            sessionID: uuid(),
            ...initialState
        };

        // This should match the expected interface for the consumers.
        this.reducer = currentReducer;
        this.dispatch = this.dispatch.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        const currentModule = this.props.module;
        if (currentModule && typeof currentModule.onSessionDidMount === 'function')
        {
            currentModule.onSessionDidMount(this);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        const currentModule = this.props.module;
        if (currentModule && typeof currentModule.onSessionWillUnmount === 'function')
        {
            currentModule.onSessionWillUnmount(this);
        }

        if (currentModule && typeof currentModule.unload === 'function')
        {
            currentModule.unload(this.state);
        }
    }

    dispatch(action)
    {
        switch(action.type)
        {
            case 'changeSessionName':
                this.setState({ sessionName: action.value });
                break;
            case 'changeModuleByID':
                this.props.changeModule(action.value);
                break;
            default:
                this.setState(this.reducer(this.state, action));
        }
    }

    /** @override */
    render()
    {
        const { renderChildren, ...otherProps } = this.props;
        return (
            <SessionStateContext.Provider value={this.state}>
                <SessionDispatchContext.Provider value={this.dispatch}>
                    {renderChildren(otherProps)}
                </SessionDispatchContext.Provider>
            </SessionStateContext.Provider>
        );
    }
}
SessionProvider.propTypes = {
    children: PropTypes.node.isRequired,
    renderChildren: PropTypes.func,
    changeModule: PropTypes.func,
    module: PropTypes.object,
};
SessionProvider.defaultProps = {
    renderChildren: props => props.children,
    changeModule: nextModuleID => Logger.error(LOGGER_TAG, `Unable to change module to '${nextModuleID}'- Missing changeModule() callback.`)
};

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
