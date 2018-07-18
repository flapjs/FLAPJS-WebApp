import React from 'react';
import { hot } from 'react-hot-loader';

import './App.css';

import Toolbar from './toolbar/Toolbar.js';
import Workspace from './workspace/Workspace.js';
import Drawer from './drawer/Drawer.js';
import Viewport from './viewport/Viewport.js';

import EventHistory from 'events/EventHistory.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
    this.workspace = React.createRef();
    this.viewport = React.createRef();
    this.drawer = React.createRef();

    this.eventHistory = new EventHistory();

    this.state = {
      isOpen: false,
      isDangerous: false,
      isFullscreen: false
    };
  }

  openDrawer(full=false)
  {
    this.setState((prev, props) => {
      return { isOpen: true, isFullscreen: full };
    });
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

  componentDidMount()
  {
    const controller = this.props.controller;

    //Initialize the controller to graph components
    controller.initialize(this, this.workspace.ref);

    //Insert event listeners
    const graph = this.props.graph;
    controller.on("nodeCreate", targetNode => console.log("create"));
    controller.on("nodeDelete", targetNode => console.log("delete"));
    controller.on("nodeDeleteAll", targetNodes => console.log("deleteall"));
    controller.on("nodeMove", (targetNode, nextX, nextY, prevX, prevY) => console.log("move"));
    controller.on("nodeMoveAll", (targetNodes, dx, dy) => console.log("moveall"));
    controller.on("nodeAccept", (targetNode, nextAccept, prevAccept) => console.log("accept"));
    controller.on("nodeLabel", (targetNode, nextLabel, prevLabel) => console.log("label"));

    controller.on("edgeCreate", targetNode => console.log("edgecreate"));
    controller.on("edgeDelete", targetNode => console.log("edgedelete"));
    controller.on("edgeDestination", (targetNode, nextDestination, prevDestination) => console.log("edgedest"));
    controller.on("edgeMove", (targetNode, nextX, nextY, prevX, prevY) => console.log("edgemove"));
    controller.on("edgeLabel", (targetNode, nextLabel, prevLabel) => console.log("edgelabel"));
  }

  componentDidUpdate()
  {
    //Update input controller (usually mouse position for hover info)
    this.props.controller.onUpdate();
  }

  render()
  {
    const controller = this.props.controller;
    const graph = this.props.graph;

    return <div className="app-container" ref={ref=>this.container=ref}>
      <Toolbar app={this} graph={graph} eventHistory={this.eventHistory}/>

      <div className="workspace-container">
        <div className={"workspace-main" +
          (this.state.isOpen ? " open" : "")}
          style={{visibility: this.state.isFullscreen ? "hidden" : "visible"}}>

          <Workspace ref={ref=>this.workspace=ref} graph={graph} controller={controller}/>
        </div>

        <div className={"workspace-viewport" +
          (this.state.isOpen ? " open" : "") +
          (this.state.isDangerous ? " danger" : "")}
          style={{visibility: this.state.isFullscreen ? "hidden" : "visible"}}>

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

//For hotloading this class
export default hot(module)(App);
