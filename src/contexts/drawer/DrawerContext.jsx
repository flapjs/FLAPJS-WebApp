import React from 'react';
import PropTypes from 'prop-types';

// Behold...the drawer context.
const DrawerStateContext = React.createContext();
const DrawerDispatchContext = React.createContext();

// ...and it's reducer...
function reducer(state, action)
{
    switch(action.type)
    {
        case 'open':
            return { open: true };
        case 'close':
            return { open: false };
        case 'toggle':
            return { open: !state.open };
        case 'change-tab':
            return { open: true, tabIndex: action.value };
        default:
            throw new Error(`Unhandled reducer action '${action}'.`);
    }
}

// ...and it's provider...
class DrawerProvider extends React.Component
{
    constructor(props)
    {
        super(props);

        // This makes sure that async calls do not modify component after it has been unmounted.
        this.shouldUpdateAsync = true;

        // This should match the expected shape for the consumers.
        this.state = {
            open: false,
            tabIndex: 0,
        };

        // This should match the expected interface for the consumers.
        this.dispatch = (action) => this.setState(reducer(this.state, action));
    }

    /** @override */
    componentDidMount()
    {

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
        const props = this.props;
        return (
            <DrawerStateContext.Provider value={this.state}>
                <DrawerDispatchContext.Provider value={this.dispatch}>
                    {props.children}
                </DrawerDispatchContext.Provider>
            </DrawerStateContext.Provider>
        );
    }
}
DrawerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// ...and it's consumers...
function DrawerConsumer(props)
{
    return (
        <DrawerStateConsumer>
            {
                stateContext =>
                    <DrawerDispatchConsumer>
                        {
                            dispatchContext => props.children(stateContext, dispatchContext)
                        }
                    </DrawerDispatchConsumer>
            }
        </DrawerStateConsumer>
    );
}
DrawerConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

function DrawerStateConsumer(props)
{
    return (
        <DrawerStateContext.Consumer>
            {
                context =>
                {
                    if (!context) throw new Error('Context consumer missing parent provider.');
                    return props.children(context);
                }
            }
        </DrawerStateContext.Consumer>
    );
}
DrawerStateConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

function DrawerDispatchConsumer(props)
{
    return (
        <DrawerDispatchContext.Consumer>
            {
                context =>
                {
                    if (!context) throw new Error('Context consumer missing parent provider.');
                    return props.children(context);
                }
            }
        </DrawerDispatchContext.Consumer>
    );
}
DrawerDispatchConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};

// ...together as a family at last.
export {
    DrawerProvider,
    DrawerConsumer,
    DrawerStateConsumer,
    DrawerDispatchConsumer,
    DrawerStateContext,
    DrawerDispatchContext,
    reducer,
};
