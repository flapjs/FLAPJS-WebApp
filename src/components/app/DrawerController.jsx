import React from 'react';
import PropTypes from 'prop-types';

import TabbedPanelSelector from '../panel/TabbedPanelSelector.jsx';

function DrawerController(props)
{
    const panels = props.panels;
    const [tabIndex, setTabIndex] = React.useState(0);

    return (
        <TabbedPanelSelector
            panels={panels}
            tabIndex={tabIndex}
            setTabIndex={(tabIndex) =>
            {
                setTabIndex(tabIndex);
            }}>
            {props.children}
        </TabbedPanelSelector>
    );
}
DrawerController.propTypes = {
    children: PropTypes.func,
    panels: PropTypes.arrayOf(PropTypes.element),
};

export default DrawerController;
