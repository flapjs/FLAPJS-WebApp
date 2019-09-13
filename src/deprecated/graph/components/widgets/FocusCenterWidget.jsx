import React from 'react';
import PropTypes from 'prop-types';
import Style from './FocusCenterWidget.module.css';

import IconButton from '../../../icon/IconButton.jsx';
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
FocusCenterWidget.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    // TODO: fix type.
    viewportAdapter: PropTypes.any,
};

export default FocusCenterWidget;
