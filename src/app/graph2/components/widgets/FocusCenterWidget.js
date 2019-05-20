import React from 'react';
import Style from './FocusCenterWidget.css';

import IconButton from 'experimental/components/IconButton.js';
import PinpointIcon from 'components/iconset/PinpointIcon.js';

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
        const viewportAdapter = this.props.viewportAdapter;
        viewportAdapter.setOffset(0, 0);
    }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;

        return (
            <IconButton id={this.props.id}
                className={Style.center_focus_button +
                    ' ' + this.props.className}
                style={this.props.style}
                title={'Center Workspace'}
                disabled={Math.abs(viewportAdapter.getOffsetX()) < OFFSET_EPSILON &&
                    Math.abs(viewportAdapter.getOffsetY()) < OFFSET_EPSILON}
                onClick={this.onClick}>
                <PinpointIcon />
            </IconButton>
        );
    }
}

export default FocusCenterWidget;
