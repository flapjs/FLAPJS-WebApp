import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import { WrenchIcon, RunningManIcon, BarChartIcon } from '../../icons/Icons.js';

function AppSideBar(props)
{
    const direction = props.direction;

    return (
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
    );
}
AppSideBar.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    // TODO: Fix type.
    direction: PropTypes.string,
    // TODO: Fix type.
    app: PropTypes.any,
};

export default AppSideBar;
