import React from 'react';
import PropTypes from 'prop-types';
import Style from './App.module.css';

import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import WorkspaceLayout from '../workspace/WorkspaceLayout.jsx';
import DrawerLayout from '../drawer/DrawerLayout.jsx';
import SideBarLayout from '../sidebar/SideBarLayout.jsx';
import { WrenchIcon, RunningManIcon, BarChartIcon } from '../icons/Icons.js';

/*
import StyleInput from '../theme/sourceStyle/StyleInput.jsx';
import ComputedStyleInput from '../theme/computedStyle/ComputedStyleInput.jsx';
<StyleInput ref={this.sourceColor} source={() => this.drawer.current.container.current} name="--drawer-layout-handle" />
<ComputedStyleInput
    source={() => this.drawer.current.container.current}
    name="--drawer-layout-background"
    compute={this.sourceColor}
    computeFunction="darken" />
*/

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
            resize: false,
        };
        
        this.drawer = React.createRef();

        this.sourceColor = React.createRef();

        //Used to manage resize updates
        this._resizeTimeout = null;

        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        window.addEventListener('resize', this.onWindowResize, false);
    }

    /** @override */
    componentWillUnmount()
    {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize(e)
    {
        if (!this._resizeTimeout)
        {
            this.setState({ resize: true });
            this._resizeTimeout = setTimeout(() =>
            {
                this._resizeTimeout = null;
                this.setState({ resize: false });
            }, 300);
        }

        if (window.matchMedia('(max-width: 500px)').matches)
        {
            if (this.state.side !== 'bottom')
            {
                this.setState({ side: 'bottom' });
            }
        }
        else
        {
            if (this.state.side === 'bottom')
            {
                this.setState({ side: 'right' });
            }
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        const state = this.state;

        const horizontal = state.side === 'left' || state.side === 'right';
        const resizing = this.state.resize;

        return (
            <div className={Style.container
                + (props.className || '')
                + (resizing ? ' resizing' : '')}>
                <LocalizationProvider localeCode="en">
                    <nav className={Style.appbar}>
                        <h2>Flap.js</h2>
                        <p><LocaleString entity="hi"/></p>
                        <button onClick={() => this.setState(prev =>
                        {
                            return { open: !prev.open };
                        })}>
                            OPEN
                        </button>
                    </nav>
                    <div className={Style.appcontent}>
                        <WorkspaceLayout
                            renderBackground={() =>
                                <div style={{background: 'dodgerblue', width: '100%', height: '100%'}}>
                                </div>}
                            renderForeground={() =>
                                <SideBarLayout
                                    side={this.state.side}
                                    renderSideBar = {() =>
                                        <div className={Style.sidetab + ' ' + (horizontal ? ' horizontal' : ' vertical')}>
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
                                        side={this.state.side}
                                        open={this.state.open}
                                        renderDrawer = {() =>
                                            <div style={{color: 'white', width: '100%', height: '100%'}}>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in sem magna. Aliquam ultrices convallis cursus. In hac habitasse platea dictumst. Quisque eu tellus magna. Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt non sapien quis, finibus vestibulum ante. Curabitur vulputate et ligula in congue. Phasellus ac imperdiet libero, sagittis interdum elit. Suspendisse potenti.
                                            </div>
                                        }>
                                        <div style={{color: 'white', width: '100%', height: '100%'}}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in sem magna. Aliquam ultrices convallis cursus. In hac habitasse platea dictumst. Quisque eu tellus magna. Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt non sapien quis, finibus vestibulum ante. Curabitur vulputate et ligula in congue. Phasellus ac imperdiet libero, sagittis interdum elit. Suspendisse potenti.
                                        </div>
                                    </DrawerLayout>
                                </SideBarLayout>
                            }>
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
