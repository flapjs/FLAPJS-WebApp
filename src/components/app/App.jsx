import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';
import './Theme.css';

import AppServiceProviders from './structure/AppServiceProviders.jsx';
import AppBar from './structure/AppBar.jsx';
import AppWorkspace from './structure/AppWorkspace.jsx';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import { WrenchIcon, RunningManIcon, BarChartIcon } from '../icons/Icons.js';

import Pane from '../panel/pane/Pane.jsx';
// import ColorPane from '../panel/colorPane/ColorPane.jsx';

/*
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

        this.state = {
            open: true
        };
    }

    /** @override */
    render()
    {
        const props = this.props;

        return (
            <div className={Style.container + (props.className || '')}>
                <AppServiceProviders>
                    <AppBar className={Style.appbar}>
                        <h2>Flap.js</h2>
                        <p><LocaleString entity="hi"/></p>
                        <button onClick={() => this.setState(prev => { return { open: !prev.open }; })}>
                            OPEN
                        </button>
                    </AppBar>
                    <AppWorkspace
                        drawerOpen={this.state.open}
                        renderPlayground={() =>
                            <div style={{background: 'dodgerblue', width: '100%', height: '100%'}}>
                            </div>
                        }
                        renderViewport={() =>
                            <div style={{color: 'white', width: '100%', height: '100%'}}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in sem magna. Aliquam ultrices convallis cursus. In hac habitasse platea dictumst. Quisque eu tellus magna. Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt non sapien quis, finibus vestibulum ante. Curabitur vulputate et ligula in congue. Phasellus ac imperdiet libero, sagittis interdum elit. Suspendisse potenti.
                            </div>
                        }
                        renderSideBar={({ direction }) =>
                            <div className={Style.sidetab + ' ' + direction}>
                                <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                    <RunningManIcon className="icon" color="#FFFFFF"/>
                                </button>
                                <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                    <BarChartIcon className="icon" color="#FFFFFF"/>
                                </button>
                                <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                    <WrenchIcon className="icon" color="#FFFFFF"/>
                                </button>
                                <div className={Style.divider}></div>
                                <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                    <BarChartIcon className="icon" color="#FFFFFF"/>
                                </button>
                            </div>
                        }
                        renderDrawer={() =>
                            <div style={{color: 'white', width: '100%', height: '100%'}}>
                                {
                                    /*
                                        <ColorPane source={() => document.querySelector('#root')}>
                                        </ColorPane>
                                        <Pane title="About" open={true}>
                                            <p>I am content :D</p>
                                            <ThemeStyleList/>
                                        </Pane>
                                     */
                                }
                                <Pane title="Hello World" open={true}>
                                    <p>I am content :D</p>
                                    <p>
                                        Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                                    </p>
                                    <p>
                                        Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                                    </p>
                                </Pane>
                                <Pane title="Nothing To See Here" open={true}>
                                    <p>I am content :D</p>
                                    <p>
                                        Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                                    </p>
                                    <p>
                                        Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                                    </p>
                                </Pane>
                            </div>
                        }>
                    </AppWorkspace>
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

/**
 * 
                    <FlexibleOrientationLayout>
                        {
                            orientation =>
                            {
                                const side = orientation === 'row' ? 'right' : 'bottom';
                                const direction = orientation === 'row' ? 'horizontal' : 'vertical';
                                
                                return (
                                    <WorkspaceLayout
                                        renderBackground={() =>
                                            <div style={{background: 'dodgerblue', width: '100%', height: '100%'}}>
                                            </div>}
                                        renderForeground={() =>
                                            <SideBarLayout
                                                side={side}
                                                renderSideBar = {() =>
                                                    <div className={Style.sidetab + ' ' + direction}>
                                                        <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                                            <RunningManIcon className="icon" color="#FFFFFF"/>
                                                        </button>
                                                        <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                                            <BarChartIcon className="icon" color="#FFFFFF"/>
                                                        </button>
                                                        <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                                            <WrenchIcon className="icon" color="#FFFFFF"/>
                                                        </button>
                                                        <div className={Style.divider}></div>
                                                        <button className={Style.tab} onClick={() => this.setState({open: true})}>
                                                            <BarChartIcon className="icon" color="#FFFFFF"/>
                                                        </button>
                                                    </div>
                                                }>
                                                <DrawerLayout
                                                    ref={this.drawer}
                                                    side={side}
                                                    open={state.open}
                                                    renderDrawer = {() =>
                                                        <div style={{color: 'white', width: '100%', height: '100%'}}>
                                                            <ColorPane source={() => document.querySelector('#root')}>
                                                            </ColorPane>
                                                            <Pane title="About" open={true}>
                                                                <p>I am content :D</p>
                                                                <ThemeStyleList/>
                                                            </Pane>
                                                            <Pane title="Hello World" open={true}>
                                                                <p>I am content :D</p>
                                                                <p>
                                                                    Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                                                                </p>
                                                                <p>
                                                                    Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                                                                </p>
                                                            </Pane>
                                                            <Pane title="Nothing To See Here" open={true}>
                                                                <p>I am content :D</p>
                                                                <p>
                                                                    Aenean libero orci, mattis ut ullamcorper eu, scelerisque et augue. Nam egestas vestibulum interdum. Integer ligula nunc, efficitur vitae velit sed, tristique cursus ligula. Aliquam est est, consectetur quis turpis a, luctus ultrices odio. Morbi a feugiat mi. Fusce orci dolor, maximus quis eros non, placerat accumsan tellus. Nam a lectus vitae nisl scelerisque ultrices in vitae erat.
                                                                </p>
                                                                <p>
                                                                    Sed auctor, augue non sodales euismod, metus nulla congue ex, sit amet rhoncus metus turpis ut elit. Sed vitae rutrum augue. Etiam dictum ornare tortor sed tristique. Cras quis velit nisl. Nulla rhoncus lacus sit amet interdum consectetur. Pellentesque aliquam consequat vehicula. Sed eu dignissim eros. Donec rhoncus consectetur ante, sit amet pharetra urna tempor sed. In scelerisque ligula mi. Nam gravida maximus ex, consequat ultricies nisi molestie non. Maecenas id semper eros.
                                                                </p>
                                                            </Pane>
                                                        </div>
                                                    }>
                                                    <div style={{color: 'white', width: '100%', height: '100%'}}>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in sem magna. Aliquam ultrices convallis cursus. In hac habitasse platea dictumst. Quisque eu tellus magna. Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt non sapien quis, finibus vestibulum ante. Curabitur vulputate et ligula in congue. Phasellus ac imperdiet libero, sagittis interdum elit. Suspendisse potenti.
                                                    </div>
                                                </DrawerLayout>
                                            </SideBarLayout>
                                        }>
                                    </WorkspaceLayout>
                                );
                            }
                        }
                    </FlexibleOrientationLayout>
 */

export default App;
