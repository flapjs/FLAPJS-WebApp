import React from 'react';
import PropTypes from 'prop-types';
import Style from './ColorEntry.module.css';

function ColorEntry(props)
{
    return (
        <div className={Style.container}>
            <label className={Style.title}>{props.title}</label>
            {props.children}
        </div>
    );
}
ColorEntry.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
};

export default ColorEntry;
