import React from 'react';
import PropTypes from 'prop-types';

function TabbedPanel(props)
{
    return (
        <></>
    );
}
TabbedPanel.propTypes = {
    title: PropTypes.string.isRequired,
    renderTab: PropTypes.func.isRequired,
};

export default TabbedPanel;
