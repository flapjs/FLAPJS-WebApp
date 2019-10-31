import React from 'react';
import PropTypes from 'prop-types';
import Style from './ColorSubEntry.module.css';

function ColorSubEntry(props)
{
    return (
        <div className={Style.container}>
            <label className={Style.title}>{props.title}</label>
            {props.children}
        </div>
    );
}
ColorSubEntry.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
};

export default ColorSubEntry;
