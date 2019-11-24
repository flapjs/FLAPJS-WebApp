import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { PinpointIcon } from '@flapjs/components/icons/Icons.js';

const OFFSET_EPSILON = 0.1;

class FocusCenterWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        this.props.viewportAdapter.setOffset(0, 0);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const viewportAdapter = props.viewportAdapter;
        const disabled = Math.abs(viewportAdapter.getOffsetX()) < OFFSET_EPSILON
            && Math.abs(viewportAdapter.getOffsetY()) < OFFSET_EPSILON;

        return (
            <IconButton
                className={props.className}
                style={props.style}
                title={'Center Workspace'}
                disabled={disabled}
                onClick={this.onClick}
                iconClass={PinpointIcon} />
        );
    }
}
FocusCenterWidget.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    viewportAdapter: PropTypes.object.isRequired,
};

export default FocusCenterWidget;
