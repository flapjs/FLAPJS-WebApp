import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import NodalGraph from 'graph/NodalGraph.js';

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
import GraphUploader from 'graph/GraphUploader.js';
import TestingManager from 'testing/TestingManager.js';
import EventManager from './EventManager.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    //Create references
    this.container = React.createRef();
    this.workspace = React.createRef();
    this.viewport = React.createRef();
    this.drawer = React.createRef();
    this.notification = null;
    this.toolbar = React.createRef();

    this.graph = new NodalGraph();

    //Must be initialized (will be called in Workspace.componentDidMount)
    this.graphController = new GraphController(this.graph);
    this.inputController = new InputController();
    this.machineController = new MachineController();

    this.machineBuilder = new FSABuilder(this.graph, this.graphController);
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
      AutoSaver.loadAutoSave(this.graph);

      //Start auto-saving
      AutoSaver.initAutoSave(this.graph);
    }

    //Initialize the controller to graph components
    this.inputController.initialize(this);
    this.graphController.initialize(this);
    this.machineController.initialize(this);

    this.machineBuilder.initialize(this);
    this.testingManager.initialize(this);
    this.eventManager.initialize(this);
    this.hotKeys.initialize(this);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (this.inputController.getPointer().trashMode)
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
    this.machineBuilder.destroy();

    this.machineController.destroy();
    this.graphController.destroy();
    this.inputController.destroy();

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
      for(let i = 0; i < length; ++i)
      {
        let file = ev.dataTransfer.items[i];
        if (file.kind === 'file')
        {
          const data = file.getAsFile();
          //TODO: should show error message if invalid
          GraphUploader.uploadFileToGraph(data, this.graph, null, null);
        }
      }
    }
    else
    {
      const length = ev.dataTransfer.files.length;
      for(let i = 0; i < length; ++i)
      {
        const data = ev.dataTransfer.files[i];
        //TODO: should show error message if invalid
        GraphUploader.uploadFileToGraph(data, this.graph, null, null);
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

    const graph = this.graph;
    const machineBuilder = this.machineBuilder;
    const tester = this.testingManager;

    inputController.update();

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar ref={ref=>this.toolbar=ref}
        app={this}
        graph={graph}
        machineBuilder={machineBuilder}
        eventManager={this.eventManager} />

      <NotificationSystem ref={ref=>this.notification=ref}
        graph={graph}
        machineBuilder={machineBuilder}
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
            graph={graph}
            machineBuilder={machineBuilder}
            graphController={graphController}
            inputController={inputController}
            tester={tester}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible"
          }}>

          <Viewport ref={ref=>this.viewport=ref}
            app={this} graph={graph}
            inputController={inputController}
            tester={tester}/>
        </div>

        <div className={"workspace-drawer" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isFullscreen ? " fullscreen" : "")}>

          <Drawer ref={ref=>this.drawer=ref}
            app={this}
            graph={graph}
            graphController={graphController}
            toolbar={this.toolbar} />
        </div>
      </div>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(App);
