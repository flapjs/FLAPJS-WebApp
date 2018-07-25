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

  getMachineType()
  {
    return "DFA";
  }

  render()
  {
    const app = this.props.app;
    const graph = this.props.graph;
    const eventHistory = this.props.eventHistory;
    const getMachineName = this.getMachineName.bind(this);

    return <div className="toolbar-container">
      <div className="toolbar-title">
        <input id="machine-name" type="text" defaultValue="Untitled" ref={ref=>this.machineName=ref}/>
        <label id="machine-type"
          onClick={()=>app.drawer.setTab(1)}>
          DFA
          </label>
      </div>
      <NewButton graph={graph} onExecute={()=>{
        eventHistory.clear();
      }}/>
      <UploadButton app={app} onExecute={()=>{
        eventHistory.clear();
      }}/>
      <SaveButton graph={graph} getFileName={getMachineName}/>
      <UndoButton eventHistory={eventHistory}/>
      <RedoButton eventHistory={eventHistory}/>
      <DownloadButton workspace={app.workspace} getFileName={getMachineName}/>
      <HelpButton app={app}/>
    </div>;
  }
}

export default Toolbar;
