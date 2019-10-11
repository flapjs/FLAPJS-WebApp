import React from 'react';
import PropTypes from 'prop-types';
import Style from './IconButton.module.css';

class ControlledIconButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const IconClass = props.iconClass;

        return (
            <button
                ref={props.elementRef}
                className={Style.container + ' ' + (props.className || '')}
                style={props.style}
                title={props.title}
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}>
                <IconClass className={Style.icon}/>
            </button>
        );
    }
}
ControlledIconButton.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    title: PropTypes.string,
    elementRef: PropTypes.object,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    iconClass: PropTypes.elementType.isRequired,
};

export default ControlledIconButton;
