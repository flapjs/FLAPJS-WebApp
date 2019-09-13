import React from 'react';
import PropTypes from 'prop-types';

/**
 * A React component that switches between panels
 * depending on the tab index.
 */
class PanelSwitch extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const tabIndex = props.tabIndex;
        const children = React.Children.toArray(props.children);

        if (tabIndex < 0 || tabIndex >= children.length)
        {
            return null;
        }
        else
        {
            return children[tabIndex];
        }
    }
}

PanelSwitch.propTypes = {
    children: PropTypes.node,
    tabIndex: PropTypes.number,
};
PanelSwitch.defaultProps = {
    tabIndex: 0,
};

export default PanelSwitch;
