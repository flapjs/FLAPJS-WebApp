import React from 'react';
import PropTypes from 'prop-types';

// import Pane from '@flapjs/components/drawer/pane/Pane.jsx';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { PageContentIcon } from '@flapjs/components/icons/Icons.js';

class OverviewPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <>
            <header>
                <h1>Overview</h1>
            </header>
            </>
        );
    }
}
OverviewPanel.Tab = Tab;

function Tab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton
            onClick={onClick}
            iconClass={PageContentIcon}
            {...otherProps}/>
    );
}
Tab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default OverviewPanel;
