import React from 'react';
import PropTypes from 'prop-types';

import Style from './AppViewport.module.css';

function AppViewport(props)
{
    return (
        <div className={Style.container}>
            {props.children}
        </div>
    );
}
AppViewport.propTypes = {
    children: PropTypes.node,
};

export default AppViewport;
