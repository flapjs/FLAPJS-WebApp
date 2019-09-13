import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';
import './Theme.css';

import AppServiceProviders from './structure/AppServiceProviders.jsx';
import AppBar from './structure/AppBar.jsx';
import AppWorkspace from './structure/AppWorkspace.jsx';
import AppDrawer from './structure/AppDrawer.jsx';
import AppSideBar from './structure/AppSideBar.jsx';
import AppViewport from './structure/AppViewport.jsx';
import AppPlayground from './structure/AppPlayground.jsx';

import DeprecatedServiceProviders from '@flapjs/deprecated/DeprecatedServiceProviders.jsx';
import * as DeprecatedAppHandler from '@flapjs/deprecated/DeprecatedAppHandler.jsx';

/*
import ColorPane from '../panel/colorPane/ColorPane.jsx';
import { STYLE_REGISTRY } from '../theme/ThemeContext.jsx';
import ThemeStyleList from '../theme/themeStyle/ThemeStyleList.jsx';
import * as Theme from './Theme.js';
*/

/**
 * A React component that can do anything you want. :D
 */
class App extends React.Component
{
    constructor(props)
    {
        super(props);

        // Theme.register(STYLE_REGISTRY);
        DeprecatedAppHandler.initialize(this);

        this.state = {
            //TODO: This should not be here. It re-renders the ENTIRE app each time...
            open: true
        };
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
    
    /** @override */
    render()
    {
        const props = this.props;

        return (
            <div className={Style.container + (props.className || '')}>
                {/** All service providers. */}
                <AppServiceProviders>
                    <DeprecatedServiceProviders app={this}>
                        {/** The navigation bar at the top. */}
                        <AppBar app={this}></AppBar>
                        {/** The entire workspace, including drawers, viewports, playgrounds, etc. */}
                        <AppWorkspace
                            /** This shouldn't be here... */
                            drawerOpen={this.state.open}
                            /** The playground the user can edit. This is usually the graph. */
                            renderPlayground={props => <AppPlayground {...props}></AppPlayground>}
                            /** The viewport over the playground. This is usually the overlays. */
                            renderViewport={props => <AppViewport {...props}> {DeprecatedAppHandler.renderViewport(this)} </AppViewport>}
                            /** The sidebar next to the drawer. This is usually the panel tabs. */
                            renderSideBar={props => <AppSideBar {...props}></AppSideBar>}
                            /** The drawer. This is usually the drawer panels. */
                            renderDrawer={props => <AppDrawer {...props}></AppDrawer>}>
                        </AppWorkspace>
                    </DeprecatedServiceProviders>
                </AppServiceProviders>
            </div>
        );
    }
}

App.propTypes = {
    className: PropTypes.string,
};
App.defaultProps = {
};

export default App;
