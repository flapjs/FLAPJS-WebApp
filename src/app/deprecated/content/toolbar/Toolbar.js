import React from 'react';
import './Toolbar.css';

import Config from 'deprecated/config.js';

import UploadButton from "./UploadButton.js";
import HelpButton from "./HelpButton.js";
import MachineName from './MachineName.js';

import IconButton from 'deprecated/icons/IconButton.js';

import MoreIcon from 'deprecated/icons/MoreIcon.js';
import UploadIcon from 'deprecated/icons/UploadIcon.js';
import CreateIcon from 'deprecated/icons/PageNewIcon.js';
//import CreateIcon from 'deprecated/icons/CreateIcon.js';
import SaveIcon from 'deprecated/icons/SaveIcon.js';
//import SaveIcon from 'deprecated/icons/DiskSaveIcon.js';
import UndoIcon from 'deprecated/icons/UndoIcon.js';
import RedoIcon from 'deprecated/icons/RedoIcon.js';
import HelpIcon from 'deprecated/icons/HelpIcon.js';
import LanguageIcon from 'deprecated/icons/LanguageIcon.js';
import OfflineIcon from 'deprecated/icons/OfflineIcon.js';
import OfflinePinIcon from 'deprecated/icons/OfflinePinIcon.js';
import BugReportIcon from 'deprecated/icons/BugReportIcon.js';

import Drawer from 'deprecated/content/drawer/Drawer.js';

const BUG_REPORT_URL = "https://goo.gl/forms/XSil43Xl5xLHsa0E2";

class Toolbar extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      langOn: false
    };

    this.onMachineNameChange = this.onMachineNameChange.bind(this);
    this.onMachineNameKeyDown = this.onMachineNameKeyDown.bind(this);
    this.langOnClick = this.langOnClick.bind(this);
  }

  onMachineNameChange(e)
  {
    this.props.currentModule.getMachineController().renameMachine(e.value);
  }

  onMachineNameKeyDown()
  {

  }

  onMachineNameBlur()
  {

  }

  langOnClick()
  {
    this.setState({langOn: !this.state.langOn});
  }

  render()
  {
    const app = this.props.app;
    const currentModule = this.props.currentModule;
    const drawer = this.props.drawer;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const undoManager = app.getUndoManager();

    const graph = graphController.getGraph();

    const offline = navigator && navigator.onLine;

    return <div className="toolbar-container">
      <div className="toolbar-title">
        <div className="toolbar-title-name">
          {/*Machine Name*/}
          <MachineName id="machine-name" value={machineController.getMachineName()} onSubmit={this.onMachineNameChange}/>
          {/*Toolbar Alt. Title*/}
          <div className="toolbar-title-alt">
            {/*Offline Button*/}
            <IconButton id="toolbar-lang" title={I18N.toString("action.toolbar.lang")}
              onClick={() => {
                if ('serviceWorker' in navigator)
                {
                  if (navigator.serviceWorker.getRegistration("./app.html"))
                  {
                    alert(I18N.toString("message.offline.ready"));
                  }
                  else
                  {
                    alert(I18N.toString("message.offline.failed"));
                  }
                }
                else
                {
                  alert(I18N.toString("message.offline.nosupport"));
                }
              }} disabled={offline}>
              <OfflineIcon/>
            </IconButton>
            {/*Upload Button
            <div id="toolbar-upload-alt"
              title={I18N.toString("action.toolbar.uploadmachine")}>
              <MoreIcon/>
            </div>
            */}
          </div>
        </div>
        {/*Machine Type*/}
        <label id="machine-type"
          onClick={()=>drawer.setTab(0)}>
          {currentModule.getLocalizedModuleName()}
        </label>
      </div>

      <div className="toolbar-tray">
        {/*New Button*/}
        <IconButton className="navicon" id="toolbar-new" title={I18N.toString("action.toolbar.newmachine")}
          onClick={() => {
            if (window.confirm(I18N.toString("alert.graph.clear")))
            {
              graph.clear();
              undoManager.clear();
              machineController.setMachineName(null);
            }
          }}>
          <CreateIcon/>
        </IconButton>
        {/*Upload Button*/}
        <UploadButton className="navicon" id="toolbar-upload" title={I18N.toString("action.toolbar.uploadmachine")}
          app={app}
          graphController={graphController}>
          <UploadIcon/>
        </UploadButton>
        {/*Undo Button*/}
        <IconButton className="navicon" id="toolbar-undo" title={I18N.toString("action.toolbar.undo")}
          disabled={!undoManager.canUndo()}
          onClick={()=>undoManager.undo()}>
          <UndoIcon/>
        </IconButton>
        {/*Redo Button*/}
        <IconButton className="navicon" id="toolbar-redo" title={I18N.toString("action.toolbar.redo")}
          disabled={!undoManager.canRedo()}
          onClick={()=>undoManager.redo()}>
          <RedoIcon/>
        </IconButton>
        {/*Save Button*/}
        <IconButton className="navicon" id="toolbar-save" title={I18N.toString("action.toolbar.save")}
          onClick={()=>drawer.setTab(Drawer.EXPORTING_PANEL_TAB_INDEX)} disabled={graph.isEmpty()}>
          <SaveIcon/>
        </IconButton>

        {/*Right Alt. Toolbar*/}
        <div className="toolbar-tray-alt">
          {/*Report a Bug Button*/}
          <IconButton className="navicon" id="toolbar-bug" title={I18N.toString("action.toolbar.bug")}
            onClick={e => window.open(BUG_REPORT_URL, '_blank')}>
            <BugReportIcon/>
          </IconButton>
          {/*Help Button*/}
          <HelpButton className="navicon" id="toolbar-help" title={I18N.toString("action.toolbar.help")}>
            <HelpIcon/>
          </HelpButton>
          {/*Language Button*/}
          <IconButton className="navicon" id="toolbar-lang" title={I18N.toString("action.toolbar.lang")}
            onClick={(e) => {document.activeElement.blur(); this.langOnClick();}} >
            <LanguageIcon/>
          </IconButton>
          {/*Language Select*/}
          <select id="toolbar-lang-select" style={{maxWidth: (this.state.langOn ? "10em" : "0")}} onChange={(e) => {I18N.fetchLanguageFile(e.target.value);}}>
            <option value="en_us">English</option>
            <option value="xx_pirate">Pirate Speak</option>
          </select>
        </div>
      </div>
    </div>;
  }
}

export default Toolbar;
