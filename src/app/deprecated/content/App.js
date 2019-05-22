import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';

import Config from 'deprecated/config.js';

//import Modules from './Modules.js';
import Module from 'deprecated/fsa/FSAModule.js';
import ModuleLoader from 'deprecated/modules/ModuleLoader.js';

import HotKeys from './HotKeys.js';
import LocalSave from 'deprecated/system/localsave/LocalSave.js';

import Toolbar from './toolbar/Toolbar.js';
import Workspace from './workspace/Workspace.js';
import Drawer from './drawer/Drawer.js';
import Viewport from './viewport/Viewport.js';
import Tutorial from 'deprecated/tutorial/Tutorial.js';

import InputAdapter from 'deprecated/system/inputadapter/InputAdapter.js';
import Notifications from 'deprecated/system/notification/Notifications.js';
import NotificationView from 'deprecated/system/notification/components/NotificationView.js';
import UndoManager from 'deprecated/system/undomanager/UndoManager.js';

import AppSaver from './AppSaver.js';

const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    //Create references
    this.container = null;
    this.workspace = null;
    this.viewport = null;
    this.drawer = null;
    this.toolbar = null;

    //These need to be initialized before module
    this.inputAdapter = new InputAdapter();
    this.inputAdapter.getViewportAdapter()
      .setMinScale(MIN_SCALE)
      .setMaxScale(MAX_SCALE)
      .setOffsetDamping(SMOOTH_OFFSET_DAMPING);

    this.undoManager = new UndoManager();

    this._saver = new AppSaver(this);

    //Modules should handle its own initialization, regardless of web state
    //Also, loading from file should be handled by modules themselves
    const ModuleClass = props.moduleClass || Module;
    this._module = new ModuleClass(this);

    this.hotKeys = new HotKeys();
    this.tutorial = new Tutorial();

    this.state = {
      isOpen: true,
      isDangerous: false,
      isFullscreen: false,
      isWaitingForFile: false
    };

    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
  }

  /** @override */
  componentDidMount()
  {
    //Initialize input adapter
    const workspaceDOM = this.workspace.ref;
    this.inputAdapter.initialize(workspaceDOM);

    //Initialize the module...
    const module = this.getCurrentModule();
    module.initialize(this);

    this.hotKeys.initialize(this);

    //Upload drop zone
    workspaceDOM.addEventListener("drop", this.onFileDrop);
    workspaceDOM.addEventListener("dragover", this.onDragOver);
    workspaceDOM.addEventListener("dragenter", this.onDragEnter);
    workspaceDOM.addEventListener("dragleave", this.onDragLeave);

    //Begin tutorial
    this.tutorial.start(this);

    LocalSave.registerHandler(this._saver);
  }

  /** @override */
  componentWillUnmount()
  {
    LocalSave.unregisterHandler(this._saver);

    this.hotKeys.destroy();

    this._module.destroy(this);

    this.inputAdapter.destroy();

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.removeEventListener("drop", this.onFileDrop);
    workspaceDOM.removeEventListener("dragover", this.onDragOver);
    workspaceDOM.removeEventListener("dragenter", this.onDragEnter);
    workspaceDOM.removeEventListener("dragleave", this.onDragLeave);
  }

  //Called to prevent default file open
  onDragOver(ev)
  {
    ev.preventDefault();
  }

  onDragEnter(ev)
  {
    ev.preventDefault();

    //Change state
    this.setState({ isWaitingForFile: true });
    this.viewport.setState((prev, props) => {
      return {
        prevMode: prev.mode,
        mode: Viewport.DANGEROUS
      };
    });
  }

  onDragLeave(ev)
  {
    ev.preventDefault();

    //Revert state
    this.setState({ isWaitingForFile: false });
    this.viewport.setState((prev, props) => {
      return {
        prevMode: prev.mode,
        mode: prev.prevMode
      };
    });
  }

  onFileDrop(ev)
  {
    //Prevent file from being opened
    ev.preventDefault();

    //Revert state
    this.setState({ isWaitingForFile: false });
    this.viewport.setState((prev, props) => {
      return {
        prevMode: prev.mode,
        mode: prev.prevMode
      };
    });

    let fileBlob = null;
    if (ev.dataTransfer.items)
    {
      const length = ev.dataTransfer.items.length;

      //Just get the first one
      if (length >= 1)
      {
        const file = ev.dataTransfer.items[0];
        if (file.kind === 'file')
        {
          fileBlob = file.getAsFile();
        }
      }
    }
    else
    {
      const length = ev.dataTransfer.files.length;

      //Just get the first one
      if (length >= 1)
      {
        fileBlob = ev.dataTransfer.files[0];
      }
    }

    if (fileBlob)
    {
      this.props.app.getCurrentModule().getGraphController().getGraphImporter().importFile(fileBlob, this._module)
        .catch((e) => {
          Notifications.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");
        });
    }

    if (ev.dataTransfer.items)
    {
      ev.dataTransfer.items.clear();
    }
    else
    {
      ev.dataTransfer.clearData();
    }
  }

  openDrawer(full=null)
  {
    if (typeof full === 'boolean')
    {
      this.setState((prev, props) => {
        return { isOpen: true, isFullscreen: full };
      });
    }
    else
    {
      this.setState((prev, props) => {
        return { isOpen: true };
      });
    }
  }

  closeDrawer()
  {
    this.setState((prev, props) => {
      return { isOpen: false };
    });
  }

  isDrawerOpen()
  {
    return this.state.isOpen;
  }

  shouldHideContent()
  {
    return this.state.isFullscreen && this.state.isOpen;
  }

  getCurrentModule()
  {
    return this._module;
  }

  getInputController()
  {
    return this._module.getInputController();
  }

  getGraphController()
  {
    return this._module.getGraphController();
  }

  getMachineController()
  {
    return this._module.getMachineController();
  }

  getInputAdapter()
  {
    return this.inputAdapter;
  }

  getUndoManager()
  {
    return this.undoManager;
  }

  isExperimental() { return false; }

  /** @override */
  componentDidUpdate()
  {
    this.inputAdapter.update();
    this._module.update(this);
  }

  /** @override */
  render()
  {
    const currentModule = this._module;
    const screen = this.workspace ? this.workspace.ref : null;

    return <div className="app-container" ref={ref=>this.container=ref}
      style={{animation: ModuleLoader.isModuleLoading() ? "fadeout 1s" : "fadein 1s"}}>
      <Toolbar ref={ref=>this.toolbar=ref}
        app={this}
        currentModule={currentModule}
        drawer={this.drawer}/>

      <NotificationView notificationManager={Notifications}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible",
            opacity: this.state.isWaitingForFile ? "0.1" : "1"
          }}>

          <Workspace ref={ref=>this.workspace=ref}
            currentModule={currentModule}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible"
          }}>

          <Viewport ref={ref=>this.viewport=ref}
            app={this}
            currentModule={currentModule}
            screen={screen}/>
        </div>

        <div className={"workspace-drawer" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isFullscreen ? " fullscreen" : "")}>

          <Drawer ref={ref=>this.drawer=ref}
            app={this}
            currentModule={currentModule}
            toolbar={this.toolbar}/>
        </div>
      </div>
    </div>;
  }
}

//For hotloading this class
export default hot(App);
