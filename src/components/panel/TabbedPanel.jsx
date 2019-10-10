import React from 'react';
import PropTypes from 'prop-types';

function TabbedPanel(props)
{
    return (
        <></>
    );
}
TabbedPanel.propTypes = {
    renderTab: PropTypes.func.isRequired,
    renderPanel: PropTypes.func.isRequired,
};

export default TabbedPanel;
