import React from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

import GraphController from 'controller/GraphController.js';
import NodalGraph from 'graph/NodalGraph.js';
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
    this.notification = React.createRef();
    this.toolbar = React.createRef();

    //Must be initialized (will be called in Workspace.componentDidMount)
    this.controller = new GraphController();
    this.graph = new NodalGraph();
    this.machineBuilder = new FSABuilder(this.graph, this.controller);
    this.testingManager = new TestingManager(this.machineBuilder);
    this.eventManager = new EventManager(this.graph, this.controller);
    this.hotKeys = new HotKeys(this.graph, this.eventManager);
    this.tutorial = new Tutorial(this);

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

    const graph = this.graph;
    const controller = this.controller;

    //Initialize the controller to graph components
    controller.initialize(this, this.workspace.ref);
    this.machineBuilder.initialize(this);
    this.eventManager.initialize();
    this.hotKeys.initialize(this.workspace, this.toolbar);

    //Notify on create in delete mode
    const tryCreateWhileTrash = () => {
      if (controller.pointer.trashMode)
      {
        this.notification.addWarningMessage(I18N.toString("message.warning.cannotmodify"),
          "tryCreateWhileTrash", true);
      }
    };
    controller.on("tryCreateWhileTrash", tryCreateWhileTrash);

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.addEventListener("drop", this.onFileDrop);
    workspaceDOM.addEventListener("dragover", this.onDragOver);
    workspaceDOM.addEventListener("dragenter", this.onDragEnter);
    workspaceDOM.addEventListener("dragleave", this.onDragLeave);

    //Begin tutorial
    this.tutorial.start();
  }

  componentWillUnmount()
  {
    this.hotKeys.destroy();
    this.eventManager.destroy();
    this.machineBuilder.destroy();
    this.controller.destroy();

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
    const controller = this.controller;
    const graph = this.graph;
    const machineBuilder = this.machineBuilder;
    const tester = this.testingManager;

    controller.update();

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar ref={ref=>this.toolbar=ref} app={this} graph={graph} machineBuilder={machineBuilder} eventManager={this.eventManager} />
      <NotificationSystem ref={ref=>this.notification=ref} graph = {graph} machineBuilder={machineBuilder} controller={controller}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible",
            opacity: this.state.isWaitingForFile ? "0.1" : "1"
          }}>

          <Workspace ref={ref=>this.workspace=ref} graph={graph} machineBuilder={machineBuilder} controller={controller} tester={tester}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible"
          }}>

          <Viewport ref={ref=>this.viewport=ref} app={this} graph={graph} controller={controller} tester={tester}/>
        </div>

        <div className={"workspace-drawer" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isFullscreen ? " fullscreen" : "")}>

          <Drawer ref={ref=>this.drawer=ref} app={this} graph={graph} toolbar={this.toolbar} />
        </div>
      </div>
    </div>;
  }
}

//For hotloading this class
export default hot(module)(App);
