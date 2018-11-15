import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import NodalGraph from 'graph/NodalGraph.js';

import InputAdapter from 'controller/newinput/InputAdapter.js';

import GraphController from 'controller/GraphController.js';
import InputController from 'controller/InputController.js';
import MachineController from 'controller/MachineController.js';

import AutoSaver from 'util/AutoSaver.js';
import HotKeys from './HotKeys.js';

import Toolbar from './toolbar/Toolbar.js';
import Workspace from './workspace/Workspace.js';
import Drawer from './drawer/Drawer.js';
import Viewport from './viewport/Viewport.js';
import NotificationSystem from 'notification/NotificationSystem.js';
import Tutorial from 'tutorial/Tutorial.js';

import FSABuilder from 'builder/FSABuilder.js';
import TestingManager from 'testing/TestingManager.js';
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
    this.notification = null;
    this.toolbar = null;

    this._graph = new NodalGraph();
    this._machineBuilder = new FSABuilder(this._graph);

    //Must be initialized (will be called in Workspace.componentDidMount)
    this.graphController = new GraphController(this._graph);
    this.inputController = new InputController(this._graph);
    this.machineController = new MachineController(this._machineBuilder);

    this.testingManager = new TestingManager();
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
  }

  componentDidMount()
  {
    //Does the browser support autosaving?
    if(AutoSaver.doesSupportLocalStorage())
    {
      AutoSaver.loadAutoSave(this.graphController, this.machineController);

      //Start auto-saving
      AutoSaver.initAutoSave(this.graphController, this.machineController);
    }

    this._machineBuilder.initialize(this);

    //Initialize the controller to graph components
    this.inputController.initialize(this);
    this.graphController.initialize(this);
    this.machineController.initialize(this);

    this.testingManager.initialize(this);
    this.eventManager.initialize(this);
    this.hotKeys.initialize(this);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this.inputController.isTrashMode())
      {
        this.notification.addWarningMessage(I18N.toString("message.warning.cannotmodify"),
          "tryCreateWhileTrash", true);
      }
    };
    this.graphController.on("tryCreateWhileTrash", tryCreateWhileTrash);

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.addEventListener("drop", this.onFileDrop);
    workspaceDOM.addEventListener("dragover", this.onDragOver);
    workspaceDOM.addEventListener("dragenter", this.onDragEnter);
    workspaceDOM.addEventListener("dragleave", this.onDragLeave);

    //Begin tutorial
    this.tutorial.start(this);
  }

  componentWillUnmount()
  {
    this.hotKeys.destroy();
    this.eventManager.destroy();

    this.machineController.destroy();
    this.graphController.destroy();
    this.inputController.destroy();

    this._machineBuilder.destroy();

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

  render()
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const machineController = this.machineController;

    const tester = this.testingManager;
    const screen = this.workspace ? this.workspace.ref : null;

    inputController.update();

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar ref={ref=>this.toolbar=ref}
        eventManager={this.eventManager}
        notification={this.notification}
        drawer={this.drawer}
        graphController={graphController}
        machineController={machineController}/>

      <NotificationSystem ref={ref=>this.notification=ref}
        graphController={graphController}
        machineController={machineController}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible",
            opacity: this.state.isWaitingForFile ? "0.1" : "1"
          }}>

          <Workspace ref={ref=>this.workspace=ref}
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
export default hot(module)(App);
