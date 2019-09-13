import React from 'react';
import PropTypes from 'prop-types';

function AppViewport(props)
{
    return (
        <div style={{color: 'white', width: '100%', height: '100%'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in sem magna. Aliquam ultrices convallis cursus. In hac habitasse platea dictumst. Quisque eu tellus magna. Curabitur aliquam luctus ex. Maecenas purus arcu, tincidunt non sapien quis, finibus vestibulum ante. Curabitur vulputate et ligula in congue. Phasellus ac imperdiet libero, sagittis interdum elit. Suspendisse potenti.
            {props.children}
        </div>
    );
}
AppViewport.propTypes = {
    children: PropTypes.node,
};

export default AppViewport;
