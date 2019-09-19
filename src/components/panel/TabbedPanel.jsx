import React from 'react';
import PropTypes from 'prop-types';

function TabbedPanel(props)
{
    return (
        <>
            {props.children}
        </>
    );
}
TabbedPanel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    renderTab: PropTypes.func,
};
TabbedPanel.defaultProps = {
    renderTab: () => '???'
};

export default TabbedPanel;
