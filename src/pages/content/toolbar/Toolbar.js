import React from 'react';
import './Toolbar.css';

import Config from 'config.js';

import UploadButton from "./UploadButton.js";
import HelpButton from "./HelpButton.js";

import IconButton from 'icons/IconButton.js';

import UploadIcon from 'icons/MoreIcon.js';
//import UploadIcon from 'icons/UploadIcon.js';
import CreateIcon from 'icons/PageAddIcon.js';
//import CreateIcon from 'icons/CreateIcon.js';
import SaveIcon from 'icons/SaveIcon.js';
//import SaveIcon from 'icons/DiskSaveIcon.js';
import UndoIcon from 'icons/UndoIcon.js';
import RedoIcon from 'icons/RedoIcon.js';
import HelpIcon from 'icons/HelpIcon.js';

/*
import AddIcon from 'icons/AddIcon.js';
import BoxAddIcon from 'icons/BoxAddIcon.js';
import CreateIcon from 'icons/CreateIcon.js';
import DiskSaveIcon from 'icons/DiskSaveIcon.js';
import DropDownIcon from 'icons/DropDownIcon.js';
import ErrorIcon from 'icons/ErrorIcon.js';
import ExpandIcon from 'icons/ExpandIcon.js';
import FailureIcon from 'icons/FailureIcon.js';
import MoreIcon from 'icons/MoreIcon.js';
import HelpIcon from 'icons/HelpIcon.js';
import InfoIcon from 'icons/InfoIcon.js';
import OfflineIcon from 'icons/OfflineIcon.js';
import PageAddIcon from 'icons/PageAddIcon.js';
import PauseIcon from 'icons/PauseIcon.js';
import PlayIcon from 'icons/PlayIcon.js';
import RedoIcon from 'icons/RedoIcon.js';
import SaveIcon from 'icons/SaveIcon.js';
import SuccessIcon from 'icons/SuccessIcon.js';
import TrashIcon from 'icons/TrashIcon.js';
import TriangleIcon from 'icons/TriangleIcon.js';
import UndoIcon from 'icons/UndoIcon.js';
import UploadIcon from 'icons/UploadIcon.js';
import WarningIcon from 'icons/WarningIcon.js';
import WorkingIcon from 'icons/WorkingIcon.js';
*/

class Toolbar extends React.Component
{
  constructor(props)
  {
    super(props);

    this.machineName = React.createRef();
  }

  setMachineName(name)
  {
    this.machineName.value = name;
  }

  getMachineName()
  {
    return this.machineName.value;
  }

  render()
  {
    const app = this.props.app;
    const drawer = app.drawer;
    const notification = app.notification;
    const machineBuilder = this.props.machineBuilder;
    const graph = this.props.graph;
    const eventHistory = this.props.eventHistory;

    return <div className="toolbar-container">
      <div className="toolbar-title">
        <div className="toolbar-title-name">
          {/*Machine Name*/}
          <input id="machine-name" type="text" defaultValue={Config.DEFAULT_MACHINE_NAME} ref={ref=>this.machineName=ref}/>
          {/*Upload Button*/}
          <UploadButton id="toolbar-upload" title="Upload"
            graph={graph}
            onChange={(e)=>{
              this.setMachineName(e.name);
              eventHistory.clear();
            }}>
            <UploadIcon/>
          </UploadButton>
        </div>
        {/*Machine Type*/}
        <label id="machine-type"
          onClick={()=>drawer.setTab(1)}>
          {machineBuilder.getMachineType()}
        </label>
      </div>

      <div className="toolbar-tray">
        {/*New Button*/}
        <IconButton className="navicon" id="toolbar-new" title="New"
          onClick={() => {
            graph.deleteAll();
            eventHistory.clear();
          }}>
          <CreateIcon/>
        </IconButton>
        {/*Undo Button*/}
        <IconButton className="navicon" id="toolbar-undo" title="Undo"
          disabled={!eventHistory.canUndo()}
          onClick={()=>eventHistory.undo()}>
          <UndoIcon/>
        </IconButton>
        {/*Redo Button*/}
        <IconButton className="navicon" id="toolbar-redo" title="Redo"
          disabled={!eventHistory.canRedo()}
          onClick={()=>eventHistory.redo()}>
          <RedoIcon/>
        </IconButton>
        {/*Save Button*/}
        <IconButton className="navicon" id="toolbar-save" title="Save"
          onClick={()=>drawer.setTab(2)}>
          <SaveIcon/>
        </IconButton>
        {/*Help Button*/}
        <HelpButton className="navicon" id="toolbar-help" title="Help"
          notification={notification}>
          <HelpIcon/>
        </HelpButton>
      </div>
    </div>;
  }
}

export default Toolbar;
