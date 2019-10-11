import React from 'react';
import PropTypes from 'prop-types';
import Style from './IconButton.module.css';

function IconButton(props)
{
    const IconClass = props.iconClass;

    return (
        <button
            className={Style.container + ' ' + (props.className || '')}
            style={props.style}
            title={props.title}
            disabled={props.disabled}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
            <IconClass className={Style.icon}/>
        </button>
    );
}
IconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    iconClass: PropTypes.elementType.isRequired,
};

export default IconButton;
