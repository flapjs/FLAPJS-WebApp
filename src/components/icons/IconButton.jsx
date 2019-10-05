import React from 'react';
import PropTypes from 'prop-types';
import Style from './IconButton.module.css';

function IconButton(props)
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
IconButton.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    iconClass: PropTypes.elementType,
};

export default IconButton;
