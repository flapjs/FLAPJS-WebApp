import React from 'react';
import PropTypes from 'prop-types';
import Style from './ZoomWidget.module.css';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { ZoomInIcon, ZoomOutIcon } from '@flapjs/components/icons/Icons.js';

class ZoomWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onZoomIn = this.onZoomIn.bind(this);
        this.onZoomOut = this.onZoomOut.bind(this);
    }

    onZoomIn(e)
    {
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = -viewportAdapter.getScale() * 0.4;
        viewportAdapter.addScale(viewScale);
    }

    onZoomOut(e)
    {
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = viewportAdapter.getScale() * 0.75;
        viewportAdapter.addScale(viewScale);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const viewportAdapter = props.viewportAdapter;
        const viewScale = 'x' + (1 / (viewportAdapter.getScale() || 1)).toFixed(2);

        return (
            <div
                className={Style.container + ' ' + (props.className || '')}
                style={props.style}>
                <IconButton
                    className={Style.button}
                    title="Zoom In"
                    onClick={this.onZoomIn}
                    iconClass={ZoomInIcon} />
                <IconButton
                    className={Style.button}
                    title="Zoom Out"
                    onClick={this.onZoomOut}
                    iconClass={ZoomOutIcon} />
                <label className={Style.label}>
                    {viewScale}
                </label>
            </div>
        );
    }
}
ZoomWidget.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    viewportAdapter: PropTypes.object.isRequired,
};

export default ZoomWidget;
