import React from 'react';
import PropTypes from 'prop-types';

function AppBar(props)
{
    return (
        <nav className={props.className || ''}>
            {props.children}
        </nav>
    );
}
AppBar.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default AppBar;
