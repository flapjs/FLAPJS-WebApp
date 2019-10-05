import React from 'react';
import PropTypes from 'prop-types';

import { DrawerDispatchConsumer } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function DrawerExpander(props)
{
    return (
        <DrawerDispatchConsumer>
            {
                dispatch => props.children(() => dispatch({ type: 'toggle' }))
            }
        </DrawerDispatchConsumer>
    );
}
DrawerExpander.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DrawerExpander;
