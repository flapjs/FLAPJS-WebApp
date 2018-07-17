import React from 'react';

import './Toolbar.css';
import NewButton from './button/NewButton.js';
import SaveButton from './button/SaveButton.js';
import UndoButton from './button/UndoButton.js';
import RedoButton from './button/RedoButton.js';
import ExportButton from "./button/ExportButton";
import HelpButton from "./button/HelpButton";
import UploadButton from "./button/UploadButton";
import DownloadButton from "./button/DownloadButton";

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
      <UploadButton/>
      <SaveButton graph={graph} getFileName={this.getMachineName.bind(this)}/>
      <UndoButton />
      <RedoButton />
      <DownloadButton/>
      <HelpButton/>
    </div>;
  }
}

export default Toolbar;
