import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';

import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import Workspace from '../workspace/Workspace.jsx';
import { WrenchIcon, RunningManIcon, BarChartIcon } from '../icons/Icons.js';

/**
 * A React component that can do anything you want. :D
 */
class App extends React.Component
{
    constructor(props)
    {
        super(props);
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
                    </nav>
                    <div className={Style.appcontent}>
                        <Workspace
                            renderSideBar={workspace =>
                                <div className={Style.sidetab}>
                                    <button className={Style.tab} onClick={() => workspace.openDrawer()}>
                                        <RunningManIcon className="icon" color="#FFFFFF"/>
                                    </button>
                                    <button className={Style.tab} onClick={() => workspace.openDrawer()}>
                                        <BarChartIcon className="icon" color="#FFFFFF"/>
                                    </button>
                                    <button className={Style.tab} onClick={() => workspace.openDrawer()}>
                                        <WrenchIcon className="icon" color="#FFFFFF"/>
                                    </button>
                                    <div className={Style.divider}></div>
                                    <button className={Style.tab} onClick={() => workspace.openDrawer()}>
                                        <BarChartIcon className="icon" color="#FFFFFF"/>
                                    </button>
                                </div>
                            }>
                        </Workspace>
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
