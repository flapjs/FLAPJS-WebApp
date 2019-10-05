import React from 'react';
import PropTypes from 'prop-types';
import Style from './IconTab.module.css';

function IconTab(props)
{
    const IconClass = props.iconClass;

    return (
        <button
            className={Style.container + ' ' + (props.className || '')}
            onClick={props.onClick}>
            <IconClass className={Style.icon}/>
        </button>
    );
}
IconTab.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    iconClass: PropTypes.elementType,
};

export default IconTab;
