import React from 'react';
import PropTypes from 'prop-types';
import Style from './ThemeStyleGroup.module.css';

function ThemeStyleGroup(props)
{
    return (
        <div className={Style.container + ' ' + (props.className || '')}>
            <label className={Style.title}>{props.title}</label>
            <div className={Style.children}>
                {props.children}
            </div>
        </div>
    );
}
ThemeStyleGroup.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
};

export default ThemeStyleGroup;
