import React from 'react';
import { hot } from 'react-hot-loader';

import './App.css';

import NodalGraph from 'graph/NodalGraph.js';
import AutoSaver from 'util/AutoSaver.js';

import Toolbar from './toolbar/Toolbar.js';
import Workspace from './workspace/Workspace.js';
import Drawer from './drawer/Drawer.js';
import Viewport from './viewport/Viewport.js';

import EventHistory from 'events/EventHistory.js';
import GraphUploader from 'graph/GraphUploader.js';

import GraphEdgeCreateEvent from 'events/GraphEdgeCreateEvent.js';
import GraphEdgeDeleteEvent from 'events/GraphEdgeDeleteEvent.js';
import GraphEdgeDestinationEvent from 'events/GraphEdgeDestinationEvent.js';
import GraphEdgeLabelEvent from 'events/GraphEdgeLabelEvent.js';
import GraphEdgeMoveEvent from 'events/GraphEdgeMoveEvent.js';

import GraphNodeAcceptEvent from 'events/GraphNodeAcceptEvent.js';
import GraphNodeInitialEvent from 'events/GraphNodeInitialEvent.js';
import GraphNodeCreateEvent from 'events/GraphNodeCreateEvent.js';
import GraphNodeDeleteAllEvent from 'events/GraphNodeDeleteAllEvent.js';
import GraphNodeDeleteEvent from 'events/GraphNodeDeleteEvent.js';
import GraphNodeLabelEvent from 'events/GraphNodeLabelEvent.js';
import GraphNodeMoveEvent from 'events/GraphNodeMoveEvent.js';
import GraphNodeMoveAllEvent from 'events/GraphNodeMoveAllEvent.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.graph = App.GRAPH;
    this.eventHistory = App.HISTORY;

    //Create references
    this.container = React.createRef();
    this.workspace = React.createRef();
    this.viewport = React.createRef();
    this.drawer = React.createRef();

    this.state = {
      isOpen: false,
      isDangerous: false,
      isFullscreen: false,
      isWaitingForFile: false
    };
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
    const controller = this.props.controller;

    //Initialize the controller to graph components
    controller.initialize(this, this.workspace.ref);

    //Upload drop zone
    const workspaceDOM = this.workspace.ref;
    workspaceDOM.addEventListener("drop", this.onFileDrop.bind(this));
    workspaceDOM.addEventListener("dragover", this.onDragOver.bind(this));
    workspaceDOM.addEventListener("dragenter", this.onDragEnter.bind(this));
    workspaceDOM.addEventListener("dragleave", this.onDragLeave.bind(this));

    //Insert event listeners
    const eventHistory = this.eventHistory;

    controller.on("nodeCreate", targetNode =>
      eventHistory.handleEvent(new GraphNodeCreateEvent(graph, targetNode)));
    controller.on("nodeDelete", (targetNode, prevX, prevY) =>
      eventHistory.handleEvent(new GraphNodeDeleteEvent(graph, targetNode, prevX, prevY)));

    controller.on("nodeDeleteAll", (targetNodes, selectedNode, prevX, prevY) =>
      eventHistory.handleEvent(new GraphNodeDeleteAllEvent(graph, targetNodes, selectedNode, prevX, prevY)));

    controller.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) =>
      eventHistory.handleEvent(new GraphNodeMoveEvent(graph, targetNode, nextX, nextY, prevX, prevY)));
    controller.on("nodeMoveAll", (targetNodes, dx, dy) =>
      eventHistory.handleEvent(new GraphNodeMoveAllEvent(graph, targetNodes, dx, dy)));
    controller.on("nodeAccept", (targetNode, nextAccept, prevAccept) =>
      eventHistory.handleEvent(new GraphNodeAcceptEvent(graph, targetNode, nextAccept, prevAccept)));
    controller.on("nodeInitial", (nextInitial, prevInitial) =>
      eventHistory.handleEvent(new GraphNodeInitialEvent(graph, nextInitial, prevInitial)));
    controller.on("nodeLabel", (targetNode, nextLabel, prevLabel) =>
      eventHistory.handleEvent(new GraphNodeLabelEvent(graph, targetNode, nextLabel, prevLabel)));

    controller.on("edgeCreate", targetEdge =>
      eventHistory.handleEvent(new GraphEdgeCreateEvent(graph, targetEdge)));
    controller.on("edgeDelete", targetEdge =>
      eventHistory.handleEvent(new GraphEdgeDeleteEvent(graph, targetEdge)));
    controller.on("edgeDestination", (targetEdge, nextDestination, prevDestination, prevQuad) =>
      eventHistory.handleEvent(new GraphEdgeDestinationEvent(graph, targetEdge, nextDestination, prevDestination, prevQuad)));
    controller.on("edgeMove", (targetEdge, nextX, nextY, prevX, prevY) =>
      eventHistory.handleEvent(new GraphEdgeMoveEvent(graph, targetEdge, nextX, nextY, prevX, prevY)));
    controller.on("edgeLabel", (targetEdge, nextLabel, prevLabel) =>
      eventHistory.handleEvent(new GraphEdgeLabelEvent(graph, targetEdge, nextLabel, prevLabel)));
  }

  render()
  {
    const controller = this.props.controller;
    const graph = this.graph;

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar app={this} graph={graph} eventHistory={this.eventHistory}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible",
            opacity: this.state.isWaitingForFile ? "0.1" : "1"
          }}>

          <Workspace ref={ref=>this.workspace=ref} graph={graph} controller={controller}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "")}
          style={{
            visibility: this.shouldHideContent() ? "hidden" : "visible"
          }}>

          <Viewport ref={ref=>this.viewport=ref} app={this} controller={controller}/>
        </div>

        <div className={"workspace-drawer" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isFullscreen ? " fullscreen" : "")}>

          <Drawer ref={ref=>this.drawer=ref} app={this}/>
        </div>
      </div>
    </div>;
  }
}
App.GRAPH = new NodalGraph();
App.HISTORY = new EventHistory();

//For hotloading this class
export default hot(module)(App);
