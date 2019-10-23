import React from 'react';
import PropTypes from 'prop-types';
// import Style from '../App.module.css';

import FlexibleOrientationLayout from '@flapjs/components/layout/FlexibleOrientationLayout.jsx';
import WorkspaceLayout from '@flapjs/components/workspace/layout/WorkspaceLayout.jsx';

function AppWorkspace(props)
{
    const {renderPlayground, renderViewport, renderDrawer, ...otherProps} = props;

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
                        renderForeground={() => renderDrawer({
                            renderViewport: renderViewport.bind(null, newProps),
                            ...newProps
                        })}>
                        {props.children}
                    </WorkspaceLayout>
                );
            }}
        </FlexibleOrientationLayout>
    );
}
AppWorkspace.propTypes = {
    children: PropTypes.node,
    renderViewport: PropTypes.func.isRequired,
    renderPlayground: PropTypes.func.isRequired,
    renderDrawer: PropTypes.func.isRequired,
};

export default AppWorkspace;
