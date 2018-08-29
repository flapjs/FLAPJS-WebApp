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
    const inputController = this.props.inputController;
    return <div id="cursor-btn">
      <IconButton id="action-mode" className={!inputController._swapMouseScheme ? "active" : ""} onClick={() => inputController.setMouseActionMode(false)} title="Action Mode">
        <CreateIcon/>
      </IconButton>
      <IconButton id="move-mode" className={inputController._swapMouseScheme ? "active" : ""} onClick={() => inputController.setMouseActionMode(true)} title="Move Mode">
        <MoveIcon/>
      </IconButton>
    </div>;
  }
}

export default CursorMode;
