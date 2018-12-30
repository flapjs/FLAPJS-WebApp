import React from 'react';
import Style from './ZoomWidget.css';

import IconButton from 'test/components/IconButton.js';
import ZoomInIcon from 'test/iconset/ZoomInIcon.js';
import ZoomOutIcon from 'test/iconset/ZoomOutIcon.js';

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
    const viewport = this.props.viewport;
    const viewScale = -viewport.getScale() * 0.4;
    viewport.addScale(viewScale);
  }

  onZoomOut(e)
  {
    const viewport = this.props.viewport;
    const viewScale = viewport.getScale() * 0.75;
    viewport.addScale(viewScale);
  }

  //Override
  render()
  {
    const viewport = this.props.viewport;
    const viewScale = "x" + (1 / (viewport.getScale() || 1)).toFixed(2);

    return (
      <div id={this.props.id}
        className={Style.zoom_container +
          " " + this.props.className}
        style={this.props.style}>
        <IconButton onClick={this.onZoomIn}>
          <ZoomInIcon/>
        </IconButton>
        <IconButton onClick={this.onZoomOut}>
          <ZoomOutIcon/>
        </IconButton>
        <label className={Style.zoom_label}>{viewScale}</label>
      </div>
    );
  }
}

export default ZoomWidget;
