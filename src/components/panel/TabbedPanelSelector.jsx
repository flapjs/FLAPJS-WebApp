import React from 'react';
import PropTypes from 'prop-types';

// import TabbedList from './TabbedList.jsx';

function TabbedPanelSelector(props)
{
    const { panels, tabIndex, setTabIndex } = props;

    // Get all tabs from the panels...
    const renderTabs = () =>
    {
        const result = [];
        React.Children.forEach(panels, (child, index) =>
        {
            result.push(
                <button
                    key={index + ':' + child.props.title}
                    onClick={() => setTabIndex(index)}>
                    {
                        child.props.renderTab
                            ? child.props.renderTab()
                            : child.props.title
                    }
                </button>
            );
        });
        return (
            <div>
                {result}
            </div>
        );
    };

    // Get the current panel from all the others...
    const renderPanels = () =>
    {
        const children = React.Children.toArray(panels);

        if (tabIndex >= 0 && tabIndex < children.length)
        {
            return children[tabIndex];
        }

        return null;
    };

    // Give the render functions to someone else to draw...
    return props.children.call(null, renderTabs, renderPanels);
}
TabbedPanelSelector.propTypes = {
    children: PropTypes.func,
    panels: PropTypes.arrayOf(PropTypes.element),
    tabIndex: PropTypes.number,
    setTabIndex: PropTypes.func,
};

export default TabbedPanelSelector;
