import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';

import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import WorkspaceLayout from '../workspace/WorkspaceLayout.jsx';
import DrawerLayout from '../drawer/DrawerLayout.jsx';
import SideBarLayout from '../sidebar/SideBarLayout.jsx';
import { WrenchIcon, RunningManIcon, BarChartIcon } from '../icons/Icons.js';

/**
 * A React component that can do anything you want. :D
 */
class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            open: false,
            side: 'right',
        };
    }

    /** @override */
    render()
    {
        const props = this.props;

        return (
            <div className={Style.container + (props.className || '')}>
                <LocalizationProvider localeCode="en">
                    <nav className={Style.appbar}>
                        <h2>Flap.js</h2>
                        <p><LocaleString entity="hi"/></p>
                        <button onClick={() => this.setState(prev =>
                        {
                            return { open: !prev.open };
                        })}></button>
                    </nav>
                    <div className={Style.appcontent}>
                        <WorkspaceLayout
                            renderBackground={() =>
                                <div style={{background: 'dodgerblue', width: '100%', height: '100%'}}>
                                </div>}>
                            <SideBarLayout side={this.state.side}
                                renderSideBar = {() =>
                                    <div className={Style.sidetab}>
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
                                <DrawerLayout side={this.state.side}
                                    open={this.state.open}
                                    renderDrawer = {() =>
                                        <div style={{width: '100%', height: '100%'}}>
                                            I am content
                                        </div>
                                    }>
                                    <div style={{background: 'white', width: '100%', height: '100%'}}>
                                        I am content
                                    </div>
                                </DrawerLayout>
                            </SideBarLayout>
                        </WorkspaceLayout>
                    </div>
                </LocalizationProvider>
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
