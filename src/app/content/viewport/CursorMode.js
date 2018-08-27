import React from 'react';
import './CursorMode.css';

import IconButton from 'icons/IconButton.js';
import CreateIcon from 'icons/CreateIcon.js';
import MoveIcon from 'icons/MoveIcon.js';

class CursorMode extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const controller = this.props.controller;
    return <div id="cursor-btn">
      <IconButton id="action-mode" className={!controller._swapMouseScheme ? "active" : ""} onClick={() => controller.setMouseActionMode(false)} title="Action Mode">
        <CreateIcon/>
      </IconButton>
      <IconButton id="move-mode" className={controller._swapMouseScheme ? "active" : ""} onClick={() => controller.setMouseActionMode(true)} title="Move Mode">
        <MoveIcon/>
      </IconButton>
    </div>;
  }
}

export default CursorMode;
