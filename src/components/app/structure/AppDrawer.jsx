import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import SideBarLayout from '@flapjs/components/sidebar/layout/SideBarLayout.jsx';
import DrawerLayout from '@flapjs/components/drawer/layout/DrawerLayout.jsx';
import DrawerExpander from '@flapjs/components/drawer/expander/DrawerExpander.jsx';

import { DropdownIcon } from '@flapjs/components/icons/Icons.js';
import IconButton from '@flapjs/components/icons/IconButton.jsx';

import { DrawerConsumer } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function AppDrawer(props)
{
    const {renderViewport, side, direction} = props;
    const tabbedPanels = React.Children.toArray(props.children);

    return (
        <DrawerConsumer>
            {
                (state, dispatch) =>
                {
                    const tabIndex = state.tabIndex;
                    const panels = renderPanels(tabbedPanels, tabIndex);
                    const tabs = renderTabs(tabbedPanels, tabIndex => dispatch({ type: 'change-tab', value: tabIndex }), tabIndex);
                    
                    return (
                        <SideBarLayout
                            side={side}
                            renderSideBar = {() =>
                                <div className={Style.sidetab + ' ' + direction}>
                                    <DrawerExpander>
                                        { callback => <IconButton onClick={callback} iconClass={DropdownIcon}/> }
                                    </DrawerExpander>
                                    {tabs}
                                </div>
                            }>
                            <DrawerLayout
                                side={side}
                                open={state.open}
                                renderDrawer = {() => panels}>
                                {renderViewport()}
                            </DrawerLayout>
                        </SideBarLayout>
                    );
                }
            }
        </DrawerConsumer>
    );
}
AppDrawer.propTypes = {
    children: PropTypes.node,
    renderViewport: PropTypes.func.isRequired,
    side: PropTypes.oneOf([
        'top',
        'left',
        'right',
        'bottom'
    ]),
    direction: PropTypes.oneOf([
        'vertical',
        'horizontal'
    ]),
    orientation: PropTypes.oneOf([
        'row',
        'column'
    ]),
};
AppDrawer.defaultProps = {
    tabbedPanels: [],
    side: 'right',
    direction: 'horizontal',
    orientation: 'row',
};

export default AppDrawer;

function renderPanels(tabbedPanels, tabIndex = 0)
{
    if (tabIndex >= 0 && tabIndex < tabbedPanels.length)
    {
        return tabbedPanels[tabIndex];
    }
    else
    {
        return null;
    }
}

function renderTabs(tabbedPanels, tabCallback, tabIndex = 0)
{
    return tabbedPanels.map((tabbedPanel, index) =>
    {
        // If not a custom element...
        if (!tabbedPanel.type || typeof tabbedPanel.type === 'string')
        {
            return;
        }
        // Has a custom tab renderer...
        else if ('Tab' in tabbedPanel.type)
        {
            const tabbedPanelCallback = tabCallback.bind(null, index);
            return React.createElement(tabbedPanel.type.Tab, { key: tabIndex, onClick: tabbedPanelCallback });
        }
        // Use default tab renderer...
        else
        {
            return tabbedPanel.type.name;
        }
    });
}
