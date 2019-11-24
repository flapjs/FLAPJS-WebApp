import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';
import './setup/Theme.css';

import AppBar from '@flapjs/components/app/structure/AppBar.jsx';
import AppWorkspace from '@flapjs/components/app/structure/AppWorkspace.jsx';
import AppViewport from '@flapjs/components/app/structure/AppViewport.jsx';
import AppPlayground from '@flapjs/components/app/structure/AppPlayground.jsx';
import AppDrawer from '@flapjs/components/app/structure/AppDrawer.jsx';
import AppServices from '@flapjs/components/app/structure/AppServices.jsx';

import * as DeprecatedAppHandler from '@flapjs/deprecated/DeprecatedAppHandler.jsx';

import ModuleServices from '@flapjs/session/ModuleServices.jsx';
import { SessionProvider, SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

import Logger from '@flapjs/util/Logger.js';
const LOGGER_TAG = 'App';

/**
 * A React component that sets up all of the app's features.
 * This should only render once per session, because it instantiates
 * all state and related data. In other words, you should NEVER
 * call App.setState(), unless you want the entire session to be
 * recreated (same goes for changing the props).
 */
class App extends React.Component
{
    constructor(props)
    {
        super(props);

        /** These are used by ModuleManager to setup the provider's state. */
        this.sessionProvider = React.createRef();

        Logger.out(LOGGER_TAG, '...constructing app...');
        /**
         * Data should be managed outside of the render function. BEFORE the providers are created.
         * 
         * Data Store => Where data is instantiated, destroyed, and updated.
         * Context => The connection points between data and components.
         * 
         * That means, Stores should be created first. Then contexts should take a store as props.
         */
    }

    /** @override */
    componentDidMount()
    {
        Logger.out(LOGGER_TAG, '...did mount app...');
        if (this.props.onDidMount) this.props.onDidMount(this);
    }

    /** @override */
    componentWillUnmount()
    {
        Logger.out(LOGGER_TAG, '...will unmount app...');
        if (this.props.onWillUnmount) this.props.onWillUnmount(this);
    }
    
    /** @override */
    render()
    {
        const props = this.props;

        const currentModule = props.module;
        const currentState = props.session;
        const currentReducer = props.reducer;
        const changeModule = props.changeModule;

        Logger.out(LOGGER_TAG, '...rendering app...');
        return (
            <div className={Style.container + (props.className || '')}>
                {/** All service providers. */}
                <SessionProvider
                    ref={this.sessionProvider}
                    state={currentState}
                    reducer={currentReducer}>
                    <SessionStateConsumer>
                        {
                            session =>
                                <ModuleServices
                                    module={currentModule}
                                    session={session}>
                                    <AppServices app={this}>
                                        {/** The navigation bar at the top. */}
                                        <AppBar changeModule={changeModule}>
                                            {DeprecatedAppHandler.renderAppBar()}
                                            {ModuleServices.renderLayer(currentModule, 'appbar')}
                                        </AppBar>
                                        {/** The entire workspace, including drawers, viewports, playgrounds, etc. */}
                                        <AppWorkspace
                                            // The playground the user can edit. This is usually the graph.
                                            renderPlayground={props =>
                                                <AppPlayground {...props}>
                                                    {ModuleServices.renderLayer(currentModule, 'playground')}
                                                </AppPlayground>}
                                            // The viewport over the playground. This is usually the overlays.
                                            renderViewport={props =>
                                                <AppViewport {...props}>
                                                    {/*DeprecatedAppHandler.renderViewport(this)*/}
                                                    {ModuleServices.renderLayer(currentModule, 'viewport')}
                                                </AppViewport>}
                                            // The drawer in the workspace. This is usually the side drawer.
                                            renderDrawer={props =>
                                                <AppDrawer {...props}>
                                                    {ModuleServices.renderLayer(currentModule, 'drawer')}
                                                    {DeprecatedAppHandler.renderDrawer()}
                                                </AppDrawer>}>
                                        </AppWorkspace>
                                    </AppServices>
                                </ModuleServices>
                        }
                    </SessionStateConsumer>
                </SessionProvider>
            </div>
        );
    }
}

App.propTypes = {
    className: PropTypes.string,
    module: PropTypes.object,
    session: PropTypes.object,
    reducer: PropTypes.func,
    changeModule: PropTypes.func,
    onDidMount: PropTypes.func,
    onWillUnmount: PropTypes.func,
};
App.defaultProps = {
    module: null,
    session: {},
    reducer: () => ({}),
    changeModule: () => Logger.error(LOGGER_TAG, 'Cannot change module - changeModule() is not defined.'),
};

export default App;
