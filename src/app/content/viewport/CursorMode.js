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
    const graphController = this.props.graphController;
    const isActionMode = inputController.getPointer().active ?
      //Is considered an action when NOT moving or when creating a new edge...
      graphController.isNewEdge || !inputController.getPointer().moveMode :
      //If not active, just show default action...
      !inputController.getInputScheme();
      
    return <div id="cursor-btn">
      <IconButton id="action-mode" className={isActionMode ? "active" : ""}
        onClick={() => inputController.setInputScheme(true)}
        title={I18N.toString("cursor.actionmode")}>
        <CreateIcon/>
      </IconButton>
      <IconButton id="move-mode" className={!isActionMode ? "active" : ""}
        onClick={() => inputController.setInputScheme(false)}
        title={I18N.toString("cursor.movemode")}>
        <MoveIcon/>
      </IconButton>
    </div>;
  }
}

export default CursorMode;
