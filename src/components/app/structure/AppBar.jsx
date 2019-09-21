import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';
import { DrawerDispatchConsumer } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function AppBar(props)
{
    return (
        <nav className={Style.appbar + ' ' + (props.className || '')}>
            <h2>Flap.js</h2>
            <p><LocaleString entity="hi"/></p>
            <DrawerDispatchConsumer>
                {
                    dispatch =>
                        <button onClick={() => dispatch({ type: 'toggle' })}>
                            OPEN
                        </button>
                }
            </DrawerDispatchConsumer>
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
