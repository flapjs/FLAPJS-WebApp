import React from 'react';
import './Drawer.css';

import OverviewPanel from './panels/overview/OverviewPanel.js';
import TestingPanel from './panels/testing/TestingPanel.js';
import ExportingPanel from './panels/exporting/ExportingPanel.js';
import OptionsPanel from './panels/options/OptionsPanel.js';

import DrawerExpander from './DrawerExpander.js';

const TESTING = 0;
const OVERVIEW = 1;
const EXPORTING = 2;
const OPTIONS = 3;

const DEFAULT_TAB_INDEX = TESTING;

const MAX_PANEL_THRESHOLD = 50;
const MIN_PANEL_SIZE = 180;

class Drawer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.panel = React.createRef();

    this.state = {
      tabIndex: DEFAULT_TAB_INDEX,
      dragging: false
    };

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  setTab(index)
  {
    //Open drawer if it is closed
    if (!this.props.app.state.isOpen)
    {
      this.props.app.openDrawer();
    }
    //Full drawer if clicked on same one
    /*
    else
    {
      if (this.state.tabIndex === index)
      {
        this.props.app.openDrawer(!this.props.app.state.isFullscreen);
      }
    }
    */

    this.setState((prev, props) => {
      return { tabIndex: index };
    });
  }

  getTab(index)
  {
    const app = this.props.app;
    switch(index)
    {
      case OVERVIEW:
        return <OverviewPanel ref={ref=>this.panel=ref} graph={app.graph} machineBuilder={app.machineBuilder} controller={app.controller}/>;
      case TESTING:
        return <TestingPanel ref={ref=>this.panel=ref} machineBuilder={app.machineBuilder} tester={app.testingManager}/>;
      case EXPORTING:
        return <ExportingPanel ref={ref=>this.panel=ref} workspace={app.workspace} graph={this.props.graph} toolbar={this.props.toolbar} controller={app.controller} />;
      case OPTIONS:
        return <OptionsPanel ref={ref=>this.panel=ref} controller={app.controller}/>;
      default:
        throw new Error("Unknown tab index \'" + tabIndex + "\'.");
    }
  }

  onStartDraggingDrawerBorder(x, y)
  {
    const app = this.props.app;
    this.setState({dragging: true});

    //Disable fullscreen if dragging off of it
    if (app.state.isFullscreen)
    {
      app.openDrawer(false);
    }

    //Update panel to current click position
    updatePanelSize(app, x, y);
  }

  onStopDraggingDrawerBorder()
  {
    this.setState({dragging: false});
  }

  onTouchStart(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const app = this.props.app;
    //Ignore drag move if closed
    if (!app.state.isOpen)
    {
      /*
      //Opens the drawer if dragging, but closed
      this.props.app.openDrawer();
      */
      return;
    }

    const touch = e.changedTouches[0];
    this.onStartDraggingDrawerBorder(touch.clientX, touch.clientY);

    const onTouchMove = function(ev)
    {
      e.stopPropagation();
      e.preventDefault();

      const touch = ev.changedTouches[0];
      updatePanelSize(app, touch.clientX, touch.clientY);
    };

    const onTouchEnd = function(ev)
    {
      e.stopPropagation();
      e.preventDefault();

      const touch = ev.changedTouches[0];
      updatePanelSize(app, touch.clientX, touch.clientY);
      this.onStopDraggingDrawerBorder();

      //Remove listeners that are no longer needed
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
    };

    //Start listening to move and release events
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchmove", onTouchMove);
  }

  onMouseDown(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const app = this.props.app;
    //Ignore drag move if closed
    if (!app.state.isOpen)
    {
      /*
      //Opens the drawer if dragging, but closed
      this.props.app.openDrawer();
      */
      return;
    }

    this.onStartDraggingDrawerBorder(e.clientX, e.clientY);

    const onMouseMove = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev.clientX, ev.clientY);
    };

    const onMouseUp = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev.clientX, ev.clientY);
      this.onStopDraggingDrawerBorder();

      //Remove listeners that are no longer needed
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };

    //Start listening to move and release events
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }

  onScroll(e)
  {
    if (this.panel)
    {
      //TODO: this.panel.container.scrollBy(0, e.deltaY);
      //TODO: return false;
    }
  }

  render()
  {
    const app = this.props.app;

    /*
    //Double click to expand to fullscreen and normal
    onDoubleClick={app.state.isOpen ? app.openDrawer.bind(app, true) : app.openDrawer.bind(app, false)}
    */
    return <div className={"drawer-container"} onWheel={this.onScroll}>
      <div className="drawer-content">
        {this.getTab(this.state.tabIndex)}
      </div>
      <div className="tab-list">
        <DrawerExpander app={app}/>
        <button className={"tab-link" + (this.state.tabIndex == TESTING ? " active" : "")}
          onClick={ev=>this.setTab(TESTING)}>
          {I18N.toString("component.testing.title")}
        </button>
        <button className={"tab-link" + (this.state.tabIndex == OVERVIEW ? " active" : "")}
          onClick={ev=>this.setTab(OVERVIEW)}>
          {I18N.toString("component.overview.title")}
        </button>
        <button className={"tab-link" + (this.state.tabIndex == EXPORTING ? " active" : "")}
          onClick={ev=>this.setTab(EXPORTING)}>
          {I18N.toString("component.exporting.title")}
        </button>
        <button className={"tab-link" + (this.state.tabIndex == OPTIONS ? " active" : "")}
          onClick={ev=>this.setTab(OPTIONS)}>
          {I18N.toString("component.options.title")}
        </button>

        <div className="tab-right"></div>
      </div>

      <div className={"drawer-border" + (this.state.dragging ? " dragging" : "")}
        onTouchStart={this.onTouchStart}
        onMouseDown={this.onMouseDown}>
      </div>
    </div>;
  }
}

function updatePanelSize(app, x, y)
{
  const container = app.container;
  let fullscreen = false;
  let size = 0;
  //This is the same criteria as in App.css
  if (window.matchMedia("(max-width: 420px)").matches)
  {
    //Vertical slide
    const viewportOffsetY = app.viewport.ref.getBoundingClientRect().y;
    if (y - viewportOffsetY < MAX_PANEL_THRESHOLD)
    {
      //Enable fullscreen
      app.setState((prev, props) => {
        return {
          isFullscreen: true
        };
      });
    }
    else
    {
      size = container.offsetHeight - y;

      //Disable fullscreen
      if (app.state.isFullscreen)
      {
        app.setState((prev, props) => {
          return {
            isFullscreen: false
          };
        });
      }
    }
  }
  else
  {
    //Horizontal slide
    if (x < MAX_PANEL_THRESHOLD)
    {
      //Enable fullscreen
      app.setState((prev, props) => {
        return {
          isFullscreen: true
        };
      });
    }
    else
    {
      size = container.offsetWidth - x;

      //Disable fullscreen
      if (app.state.isFullscreen)
      {
        app.setState((prev, props) => {
          return {
            isFullscreen: false
          };
        });
      }
    }
  }

  //Make sure is greater than minimum size and vice versa
  if (size < MIN_PANEL_SIZE) size = MIN_PANEL_SIZE;

  //Set panel size
  container.style.setProperty("--panel-size", size + "px");
}

export default Drawer;
