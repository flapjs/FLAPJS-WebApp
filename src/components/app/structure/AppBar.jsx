import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';

function AppBar(props)
{
    const app = props.app;

    return (
        <nav className={Style.appbar + ' ' + (props.className || '')}>
            <h2>Flap.js</h2>
            <p><LocaleString entity="hi"/></p>
            <button onClick={() => app.setState(prev => { return { open: !prev.open }; })}>
                OPEN
            </button>
            {props.children}
        </nav>
    );
}
AppBar.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    // TODO: fix type.
    app: PropTypes.any,
};

export default AppBar;
