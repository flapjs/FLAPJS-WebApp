import React from 'react';
import PropTypes from 'prop-types';

export function createServiceContext(name, service)
{
    return createContext(
        name,
        service.reducer && service.reducer.bind(service),
        service.onServiceLoad && service.onServiceLoad.bind(service),
        service.onServiceUnload && service.onServiceUnload.bind(service),
        service.onServiceMount && service.onServiceMount.bind(service),
        service.onServiceUnmount && service.onServiceUnmount.bind(service),
        service.setProvider.bind(service)
    );
}

function createContext(name,
    reducer,
    loadCallback,
    unloadCallback,
    mountCallback,
    unmountCallback,
    providerCallback)
{
    // Behold...the generic service context...
    const StateContext = React.createContext();
    const DispatchContext = React.createContext();

    // ...and it's provider...
    class ContextProvider extends React.Component
    {
        constructor(props)
        {
            super(props);

            this.state = this.props.state;
            if (providerCallback) providerCallback(this);
            if (loadCallback) loadCallback(this.state);
            
            this.dispatch = this.dispatch.bind(this);
        }

        /** @override */
        componentDidMount()
        {
            if (mountCallback) mountCallback(this);
        }

        /** @override */
        componentWillUnmount()
        {
            if (unmountCallback) unmountCallback(this);
            if (unloadCallback) unloadCallback(this.state);
        }

        dispatch(action)
        {
            let result;
            switch(action.type)
            {
                case 'setState':
                    result = action.value;
                    break;
                default:
                    if (reducer)
                    {
                        result = reducer(this.state, action);
                    }
                    else
                    {
                        result = action;
                    }
            }
    
            if (result)
            {
                this.setState(result);
            }
        }

        /** @override */
        render()
        {
            const props = this.props;
            return React.createElement(
                StateContext.Provider, { value: this.state },
                React.createElement(
                    DispatchContext.Provider, { value: this.dispatch },
                    props.children
                )
            );
        }
    }
    ContextProvider.propTypes = {
        children: PropTypes.node.isRequired,
        state: PropTypes.object
    };
    ContextProvider.defaultProps = {
        state: {}
    };
    ContextProvider.displayName = name + 'Provider';

    // ...and it's consumers...
    function ContextConsumer(props)
    {
        return React.createElement(
            StateConsumer, {},
            stateContext => React.createElement(
                DispatchConsumer, {},
                dispatchContext => props.children(stateContext, dispatchContext)
            )
        );
    }
    ContextConsumer.propTypes = {
        children: PropTypes.func.isRequired,
    };
    ContextConsumer.displayName = name + 'Consumer';

    function StateConsumer(props)
    {
        return React.createElement(StateContext.Consumer, {}, context =>
        {
            if (!context) throw new Error('Context consumer missing parent provider.');
            return props.children(context);
        });
    }
    StateConsumer.propTypes = {
        children: PropTypes.func.isRequired,
    };
    StateConsumer.displayName = name + 'StateConsumer';

    function DispatchConsumer(props)
    {
        return React.createElement(DispatchContext.Consumer, {}, context =>
        {
            if (!context) throw new Error('Context consumer missing parent provider.');
            return props.children(context);
        });
    }
    DispatchConsumer.propTypes = {
        children: PropTypes.func.isRequired,
    };
    DispatchConsumer.displayName = name + 'DispatchConsumer';

    // ...together as a family at last.
    return {
        StateContext,
        DispatchContext,
        Provider: ContextProvider,
        Consumer: ContextConsumer,
        StateConsumer: StateConsumer,
        DispatchConsumer: DispatchConsumer,
    };
}
