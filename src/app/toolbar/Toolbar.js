import React from 'react';

import './Toolbar.css';
import NewButton from './button/NewButton.js';
import SaveButton from './button/SaveButton.js';
import UndoButton from './button/UndoButton.js';
import RedoButton from './button/RedoButton.js';
import ExportButton from "./button/ExportButton";

class Toolbar extends React.Component
{
  constructor(props)
  {
    super(props);

    this.machineName = React.createRef();
  }

  getMachineName()
  {
    return this.machineName.value;
  }

  render()
  {
    const app = this.props.app;
    const graph = this.props.graph;

    return <div className="toolbar-container">
      <div className="toolbar-title">
        <input id="machine-name" type="text" defaultValue="Untitled" ref={ref=>this.machineName=ref}/>
        <label id="machine-type" for="machine-name">DFA</label>
      </div>
      <NewButton />
      <SaveButton graph={graph} getFileName={this.getMachineName.bind(this)}/>
      <UndoButton />
      <RedoButton />
      <ExportButton/>
    </div>;
  }
}

export default Toolbar;
