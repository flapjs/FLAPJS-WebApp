import React from 'react';
import Style from './ZoomWidget.css';

import IconButton from 'experimental/components/IconButton.js';
import ZoomInIcon from 'components/iconset/ZoomInIcon.js';
import ZoomOutIcon from 'components/iconset/ZoomOutIcon.js';

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
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = 'x' + (1 / (viewportAdapter.getScale() || 1)).toFixed(2);

        return (
            <div id={this.props.id}
                className={Style.zoom_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <IconButton className={Style.zoom_button} title="Zoom In" onClick={this.onZoomIn}>
                    <ZoomInIcon/>
                </IconButton>
                <IconButton className={Style.zoom_button} title="Zoom Out" onClick={this.onZoomOut}>
                    <ZoomOutIcon/>
                </IconButton>
                <label className={Style.zoom_label}>{viewScale}</label>
            </div>
        );
    }
}

export default ZoomWidget;
