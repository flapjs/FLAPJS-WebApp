import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';

import FSAModule from 'modules/fsa/FSAModule.js';
import TestingManager from 'modules/fsa/testing/TestingManager.js';
import MachineController from 'controller/MachineController.js';
import GraphController from 'controller/GraphController.js';
import InputController from 'controller/InputController.js';

import HotKeys from './HotKeys.js';
import LocalSave from 'system/localsave/LocalSave.js';

import Toolbar from './toolbar/Toolbar.js';
import Workspace from './workspace/Workspace.js';
import Drawer from './drawer/Drawer.js';
import Viewport from './viewport/Viewport.js';
import Tutorial from 'tutorial/Tutorial.js';

import Notifications from 'system/notification/Notifications.js';
import NotificationView from 'system/notification/components/NotificationView.js';

import EventManager from './EventManager.js';

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

    this._module = new FSAModule();
    this.testingManager = new TestingManager();

    this.inputController = new InputController();
    this.graphController = new GraphController();
    this.machineController = new MachineController();

    this.inputController.setModule(this._module);
    this.graphController.setModule(this._module);
    this.machineController.setModule(this._module);

    this.eventManager = new EventManager();

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

    this._init = false;
  }

  componentDidMount()
  {
    //Initialize the module...
    this._module.initialize(this);

    //Initialize the controller to graph components
    this.inputController.initialize(this);
    this.graphController.initialize(this);
    this.machineController.initialize(this);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this.inputController.isTrashMode())
      {
        Notifications.addMessage(I18N.toString("message.warning.cannotmodify"), "warning", "tryCreateWhileTrash");
      }
    };
    this.graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);

    this.testingManager.initialize(this);
    this.eventManager.initialize(this);
    this.hotKeys.initialize(this);

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.addEventListener("drop", this.onFileDrop);
    workspaceDOM.addEventListener("dragover", this.onDragOver);
    workspaceDOM.addEventListener("dragenter", this.onDragEnter);
    workspaceDOM.addEventListener("dragleave", this.onDragLeave);

    //Begin tutorial
    this.tutorial.start(this);

    LocalSave.initialize();

    LocalSave.registerHandler(this);
    this.onLoadSave();

    this._init = true;
  }

  componentWillUnmount()
  {
    LocalSave.unregisterHandler(this);

    LocalSave.terminate();

    this.hotKeys.destroy();
    this.eventManager.destroy();

    this.machineController.destroy();
    this.graphController.destroy();
    this.inputController.destroy();

    this._module.destroy(this);

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.removeEventListener("drop", this.onFileDrop);
    workspaceDOM.removeEventListener("dragover", this.onDragOver);
    workspaceDOM.removeEventListener("dragenter", this.onDragEnter);
    workspaceDOM.removeEventListener("dragleave", this.onDragLeave);

    this._init = false;
  }

  onLoadSave()
  {
    const moduleName = this._module.getModuleName();

    const data = LocalSave.loadFromStorage("graph-" + moduleName);
    if (data)
    {
      const exporter = this._module.getDefaultGraphExporter();
      exporter.importFromData(data, this);
    }
  }

  onAutoSave()
  {
    const moduleName = this._module.getModuleName();

    const exporter = this._module.getDefaultGraphExporter();
    const data = exporter.exportToData(this);
    LocalSave.saveToStorage("graph-" + moduleName, data);
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

    if (ev.dataTransfer.items)
    {
      const length = ev.dataTransfer.items.length;

      //Just get the first one
      if (length >= 1)
      {
        const file = ev.dataTransfer.items[0];
        if (file.kind === 'file')
        {
          const data = file.getAsFile();
          this.graphController.getUploader().uploadFileGraph(data);
        }
      }
    }
    else
    {
      const length = ev.dataTransfer.files.length;

      //Just get the first one
      if (length >= 1)
      {
        const data = ev.dataTransfer.files[0];
        this.graphController.getUploader().uploadFileGraph(data);
      }
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

  render()
  {
    const module = this._module;
    const inputController = this.inputController;
    const graphController = this.graphController;
    const machineController = this.machineController;

    const tester = this.testingManager;
    const screen = this.workspace ? this.workspace.ref : null;

    if (this._init)
    {
      inputController.update();
      module.update(this);
    }

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar ref={ref=>this.toolbar=ref}
        eventManager={this.eventManager}
        drawer={this.drawer}
        graphController={graphController}
        machineController={machineController}/>

      <NotificationView notificationManager={Notifications}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible",
            opacity: this.state.isWaitingForFile ? "0.1" : "1"
          }}>

          <Workspace ref={ref=>this.workspace=ref}
            app={this}
            tester={tester}
            graphController={graphController}
            inputController={inputController}
            machineController={machineController}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible"
          }}>

          <Viewport ref={ref=>this.viewport=ref}
            tester={tester}
            screen={screen}
            graphController={graphController}
            inputController={inputController}
            machineController={machineController}/>
        </div>

        <div className={"workspace-drawer" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isFullscreen ? " fullscreen" : "")}>

          <Drawer ref={ref=>this.drawer=ref}
            app={this}
            toolbar={this.toolbar}
            graphController={graphController}
            machineController={machineController}/>
        </div>
      </div>
    </div>;
  }
}

//For hotloading this class
export default hot(App);
