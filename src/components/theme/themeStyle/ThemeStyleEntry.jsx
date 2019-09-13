import React from 'react';
import PropTypes from 'prop-types';
import Style from './ThemeStyleEntry.module.css';

function ThemeStyleEntry(props)
{
    return (
        <div className={Style.container + ' ' + (props.className || '')}>
            <label className={Style.title}>{props.title}</label>
            {props.children}
        </div>
    );
}
ThemeStyleEntry.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
};

export default ThemeStyleEntry;
