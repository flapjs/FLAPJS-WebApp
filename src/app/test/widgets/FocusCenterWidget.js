import React from 'react';
import Style from './FocusCenterWidget.css';

import IconButton from 'test/components/IconButton.js';
import PinpointIcon from 'test/iconset/PinpointIcon.js';

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
    const viewport = this.props.viewport;
    viewport.setOffset(0, 0);
  }

  //Override
  render()
  {
    const viewport = this.props.viewport;

    return (
      <IconButton id={this.props.id}
        className={Style.center_focus_button +
          " " + this.props.className}
        style={this.props.style}
        title={"Center Workspace"}
        disabled={Math.abs(viewport.getOffsetX()) < OFFSET_EPSILON &&
          Math.abs(viewport.getOffsetY()) < OFFSET_EPSILON} onClick={this.onClick}>
        <PinpointIcon/>
      </IconButton>
    );
  }
}

export default FocusCenterWidget;
