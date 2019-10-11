import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';
import './setup/Theme.css';

import AppServiceProviders from './structure/AppServiceProviders.jsx';
import AppBar from './structure/AppBar.jsx';

import DeprecatedServiceProviders from '@flapjs/deprecated/DeprecatedServiceProviders.jsx';
import * as DeprecatedAppHandler from '@flapjs/deprecated/DeprecatedAppHandler.jsx';

import AppWorkspace from '@flapjs/components/app/structure/AppWorkspace.jsx';
import AppViewport from '@flapjs/components/app/structure/AppViewport.jsx';
import AppPlayground from '@flapjs/components/app/structure/AppPlayground.jsx';
import AppDrawer from '@flapjs/components/app/structure/AppDrawer.jsx';
import { SessionProvider } from '@flapjs/contexts/session/SessionContext.jsx';

import Logger from '@flapjs/util/Logger';
const LOGGER_TAG = 'App';

/*
import ColorPane from '../panel/colorPane/ColorPane.jsx';
import { STYLE_REGISTRY } from '../theme/ThemeContext.jsx';
import ThemeStyleList from '../theme/themeStyle/ThemeStyleList.jsx';
import * as Theme from './Theme.js';
*/

/**
 * A React component that can do anything you want.
 */
class App extends React.Component
{
    constructor(props)
    {
        super(props);

        // Theme.register(STYLE_REGISTRY);
        DeprecatedAppHandler.initialize(this);
    }

    /** @override */
    componentDidMount()
    {
        DeprecatedAppHandler.componentDidMount(this);
    }

    /** @override */
    componentWillUnmount()
    {
        DeprecatedAppHandler.componentWillUnmount(this);
    }

    renderModuleLayer(currentModule, layerID, renderProps = {})
    {
        if (!currentModule || !('renders' in currentModule)) return null;

        const renders = currentModule.renders;
        if (layerID in renders)
        {
            const renderLayer = renders[layerID];
            if (Array.isArray(renderLayer))
            {
                const result = [];
                for(const layer of renderLayer)
                {
                    result.push(React.createElement(layer, renderProps));
                }

                if (result.length <= 1)
                {
                    return result[0];
                }
                else
                {
                    return result;
                }
            }
            else
            {
                return React.createElement(renderLayer, renderProps);
            }
        }

        return null;
    }
    
    /** @override */
    render()
    {
        const props = this.props;
        const currentModule = props.module;
        const changeModule = props.changeModule;

        return (
            <div className={Style.container + (props.className || '')}>
                {/** All service providers. */}
                <SessionProvider module={currentModule} changeModule={changeModule}>
                    <AppServiceProviders appProps={props}>
                        <DeprecatedServiceProviders app={this}>
                            {/** The navigation bar at the top. */}
                            <AppBar></AppBar>
                            {/** The entire workspace, including drawers, viewports, playgrounds, etc. */}
                            <AppWorkspace
                                // The playground the user can edit. This is usually the graph.
                                renderPlayground={props =>
                                    <AppPlayground {...props}>
                                        {this.renderModuleLayer(currentModule, 'playground')}
                                    </AppPlayground>}
                                // The viewport over the playground. This is usually the overlays.
                                renderViewport={props =>
                                    <AppViewport {...props}>
                                        {/*DeprecatedAppHandler.renderViewport(this)*/}
                                        {this.renderModuleLayer(currentModule, 'viewport')}
                                    </AppViewport>}
                                // The drawer in the workspace. This is usually the side drawer.
                                renderDrawer={props =>
                                    <AppDrawer {...props}>
                                        {this.renderModuleLayer(currentModule, 'drawer')}
                                    </AppDrawer>}>
                            </AppWorkspace>
                        </DeprecatedServiceProviders>
                    </AppServiceProviders>
                </SessionProvider>
            </div>
        );
    }
}

App.propTypes = {
    className: PropTypes.string,
    module: PropTypes.object,
    changeModule: PropTypes.func,
};
App.defaultProps = {
    module: null,
    changeModule: () => Logger.error(LOGGER_TAG, 'Cannot change module - changeModule() is not defined.')
};

export default App;
