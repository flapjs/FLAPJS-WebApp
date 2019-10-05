import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import SideBarLayout from '@flapjs/components/sidebar/SideBarLayout.jsx';
import DrawerLayout from '@flapjs/components/drawer/layout/DrawerLayout.jsx';
import DrawerExpander from '@flapjs/components/drawer/expander/DrawerExpander.jsx';

import { DropdownIcon } from '@flapjs/components/icons/Icons.js';
import IconButton from '@flapjs/components/icons/IconButton.jsx';

import { DrawerConsumer } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function AppDrawer(props)
{
    const {renderViewport, tabbedPanels, side, direction} = props;

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
    tabbedPanels: PropTypes.arrayOf(PropTypes.element),
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
        return tabbedPanels[tabIndex].props.renderPanel();
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
        // NOTE: Currently, there are no props to be give to tabbed panel...
        const tabbedPanelProps = {};
        const tabbedPanelCallback = tabCallback.bind(null, index, tabbedPanelProps);
        return tabbedPanel.props.renderTab(tabbedPanelCallback);
    });
}
