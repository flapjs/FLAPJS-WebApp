import React from 'react';
import PropTypes from 'prop-types';

import Style from './AppPlayground.module.css';

function AppPlayground(props)
{
    return (
        <div className={Style.container}>
            {props.children}
        </div>
    );
}
AppPlayground.propTypes = {
    children: PropTypes.node,
};

export default AppPlayground;
