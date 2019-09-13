import React from 'react';
import PropTypes from 'prop-types';

function AppPlayground(props)
{
    return (
        <div style={{background: 'dodgerblue', fontSize: '4rem', width: '100%', height: '100%'}}>
            I am background text :D
            {props.children}
        </div>
    );
}
AppPlayground.propTypes = {
    children: PropTypes.node,
};

export default AppPlayground;
