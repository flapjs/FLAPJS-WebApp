import React from 'react';
import PropTypes from 'prop-types';

import FlexibleOrientationLayout from '../FlexibleOrientationLayout.jsx';
import WorkspaceLayout from '../../workspace/WorkspaceLayout.jsx';
import SideBarLayout from '../../sidebar/SideBarLayout.jsx';
import DrawerLayout from '../../drawer/DrawerLayout.jsx';

function AppWorkspace(props)
{
    const drawerOpen = props.drawerOpen;
    const renderPlayground = props.renderPlayground;
    const renderViewport = props.renderViewport;
    const renderSideBar = props.renderSideBar;
    const renderDrawer = props.renderDrawer;

    return (
        <FlexibleOrientationLayout>
            {orientation =>
            {
                const side = orientation === 'row' ? 'right' : 'bottom';
                const direction = orientation === 'row' ? 'horizontal' : 'vertical';

                const renderProps = {
                    direction,
                    side,
                    orientation,
                };

                return (
                    <WorkspaceLayout
                        renderBackground={() => renderPlayground(renderProps)}
                        renderForeground={() =>
                            <SideBarLayout
                                side={side}
                                renderSideBar = {() => renderSideBar(renderProps)}>
                                <DrawerLayout
                                    side={side}
                                    open={drawerOpen}
                                    renderDrawer = {() => renderDrawer(renderProps)}>
                                    {renderViewport(renderProps)}
                                </DrawerLayout>
                            </SideBarLayout>
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
    renderDrawer: PropTypes.func,
    renderSideBar: PropTypes.func,
    renderPlayground: PropTypes.func,
    drawerOpen: PropTypes.bool,
};

export default AppWorkspace;
