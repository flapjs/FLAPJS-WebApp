import React from 'react';
import PropTypes from 'prop-types';
import Style from '../App.module.css';

import FlexibleOrientationLayout from '../FlexibleOrientationLayout.jsx';
import WorkspaceLayout from '../../workspace/WorkspaceLayout.jsx';
import SideBarLayout from '../../sidebar/SideBarLayout.jsx';
import DrawerLayout from '../../drawer/DrawerLayout.jsx';

import TabbedPanelSelector from '../../panel/TabbedPanelSelector.jsx';
import { DrawerConsumer } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function AppWorkspace(props)
{
    const {renderPlayground, renderViewport, panels, ...otherProps} = props;

    return (
        <FlexibleOrientationLayout>
            {orientation =>
            {
                const side = orientation === 'row' ? 'right' : 'bottom';
                const direction = orientation === 'row' ? 'horizontal' : 'vertical';

                const newProps = {
                    direction,
                    side,
                    orientation,
                    ...otherProps
                };

                return (
                    <WorkspaceLayout
                        renderBackground={() => renderPlayground(newProps)}
                        renderForeground={() =>
                            <DrawerConsumer>
                                {
                                    (state, dispatch) =>
                                    {
                                        return (
                                            <TabbedPanelSelector
                                                panels={panels}
                                                tabIndex={state.tabIndex}
                                                setTabIndex={tabIndex => dispatch({ type: 'change-tab', value: tabIndex })}>
                                                {
                                                    (renderTabs, renderPanels) =>
                                                        <SideBarLayout
                                                            side={side}
                                                            renderSideBar = {() =>
                                                                <div className={Style.sidetab + ' ' + direction}>
                                                                    {renderTabs(newProps)}
                                                                </div>
                                                            }>
                                                            <DrawerLayout
                                                                side={side}
                                                                open={state.open}
                                                                renderDrawer = {() => renderPanels(newProps)}>
                                                                {renderViewport(newProps)}
                                                            </DrawerLayout>
                                                        </SideBarLayout>
                                                }
                                            </TabbedPanelSelector>
                                        );
                                    }
                                }
                            </DrawerConsumer>
                        }>
                        {props.children}
                    </WorkspaceLayout>
                );
            }}
        </FlexibleOrientationLayout>
    );
}
AppWorkspace.propTypes = {
    children: PropTypes.node,
    renderViewport: PropTypes.func,
    renderPlayground: PropTypes.func,
    panels: PropTypes.arrayOf(PropTypes.element),
    drawerOpen: PropTypes.bool,
};

export default AppWorkspace;
