import React from 'react';
import './Toolbar.css';

import Config from 'config.js';

import UploadButton from "./UploadButton.js";
import HelpButton from "./HelpButton.js";

import IconButton from 'icons/IconButton.js';

import MoreIcon from 'icons/MoreIcon.js';
import UploadIcon from 'icons/UploadIcon.js';
import CreateIcon from 'icons/PageNewIcon.js';
//import CreateIcon from 'icons/CreateIcon.js';
import SaveIcon from 'icons/SaveIcon.js';
//import SaveIcon from 'icons/DiskSaveIcon.js';
import UndoIcon from 'icons/UndoIcon.js';
import RedoIcon from 'icons/RedoIcon.js';
import HelpIcon from 'icons/HelpIcon.js';
import LanguageIcon from 'icons/LanguageIcon.js';
import OfflineIcon from 'icons/OfflineIcon.js';

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
          <input id="machine-name" type="text" defaultValue={I18N.toString("file.untitled")} ref={ref=>this.machineName=ref}/>
          {/*Toolbar Alt. Title*/}
          <div className="toolbar-title-alt">
            {/*Language Button*/}
            <IconButton id="toolbar-lang" title={I18N.toString("action.toolbar.lang")}
              onClick={() => {}} disabled={navigator && navigator.onLine}>
              <OfflineIcon/>
            </IconButton>
            {/*Upload Button*/}
            <UploadButton id="toolbar-upload-alt" title={I18N.toString("action.toolbar.uploadmachine")}
              graph={graph}
              onChange={(e)=>{
                this.setMachineName(e.name);
                eventHistory.clear();
              }}>
              <MoreIcon/>
            </UploadButton>

          </div>
        </div>
        {/*Machine Type*/}
        <label id="machine-type"
          onClick={()=>drawer.setTab(1)}>
          {machineBuilder.getMachineType()}
        </label>
      </div>

      <div className="toolbar-tray">
        {/*New Button*/}
        <IconButton className="navicon" id="toolbar-new" title={I18N.toString("action.toolbar.newmachine")}
          onClick={() => {
            if (window.confirm(I18N.toString("alert.graph.clear")))
            {
              graph.deleteAll();
              eventHistory.clear();
            }
          }}>
          <CreateIcon/>
        </IconButton>
        {/*Upload Button*/}
        <UploadButton className="navicon" id="toolbar-upload" title={I18N.toString("action.toolbar.uploadmachine")}
          graph={graph}
          onChange={(e)=>{
            this.setMachineName(e.name);
            eventHistory.clear();
          }}>
          <UploadIcon/>
        </UploadButton>
        {/*Undo Button*/}
        <IconButton className="navicon" id="toolbar-undo" title={I18N.toString("action.toolbar.undo")}
          disabled={!eventHistory.canUndo()}
          onClick={()=>eventHistory.undo()}>
          <UndoIcon/>
        </IconButton>
        {/*Redo Button*/}
        <IconButton className="navicon" id="toolbar-redo" title={I18N.toString("action.toolbar.redo")}
          disabled={!eventHistory.canRedo()}
          onClick={()=>eventHistory.redo()}>
          <RedoIcon/>
        </IconButton>
        {/*Save Button*/}
        <IconButton className="navicon" id="toolbar-save" title={I18N.toString("action.toolbar.save")}
          onClick={()=>drawer.setTab(2)} disabled={graph.isEmpty()}>
          <SaveIcon/>
        </IconButton>

        {/*Right Alt. Toolbar*/}
        <div className="toolbar-tray-alt">
          {/*Help Button*/}
          <HelpButton className="navicon" id="toolbar-help" title={I18N.toString("action.toolbar.help")}
            notification={notification}>
            <HelpIcon/>
          </HelpButton>
          {/*Language Button*/}
          <IconButton className="navicon" id="toolbar-lang" title={I18N.toString("action.toolbar.lang")}
            onClick={() => {}}>
            <LanguageIcon/>
          </IconButton>
        </div>
      </div>
    </div>;
  }
}

export default Toolbar;
