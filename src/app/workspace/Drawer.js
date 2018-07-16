import React from 'react';

import OverviewPanel from './panels/OverviewPanel.js';
import TestingPanel from './panels/TestingPanel.js';
import FormattingPanel from './panels/FormattingPanel.js';
import ExportingPanel from './panels/ExportingPanel.js';

import './Drawer.css';

const TESTING = 0;
const OVERVIEW = 1;
const FORMATTING = 2;
const EXPORTING = 3;

const DEFAULT_TAB_INDEX = TESTING;

const MAX_PANEL_THRESHOLD = 50;
const MIN_PANEL_SIZE = 180;

class Drawer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      tabIndex: DEFAULT_TAB_INDEX
    };
  }

  setTab(index)
  {
    this.setState((prev, props) => {
      return { tabIndex: index };
    });
  }

  getTab(index)
  {
    switch(index)
    {
      case OVERVIEW:
        return <OverviewPanel />;
      case TESTING:
        return <TestingPanel />;
      case FORMATTING:
        return <FormattingPanel />;
      case EXPORTING:
        return <ExportingPanel />;
      default:
        throw new Error("Unknown tab index \'" + tabIndex + "\'.");
    }
  }

  onStartDraggingDrawerBorder(ev)
  {
    ev.stopPropagation();
    ev.preventDefault();

    const app = this.props.app.container;

    const onMouseMove = function(ev)
    {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev);
    };

    const onMouseUp = function(ev)
    {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev);

      //Remove listeners that are no longer needed
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };

    //Start listening to move and release events
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }

  render()
  {
    return <div className={"drawer-container" + (this.state.isFullscreen ? " fullscreen" : "")}>
      <div className="drawer-content">
        {this.getTab(this.state.tabIndex)}
      </div>

      <div className="tab-list">
        <button className={"tab-link" + (this.state.tabIndex == TESTING ? " active" : "")}
          onClick={this.setTab.bind(this, TESTING)}>
          Testing
        </button>
        <button className={"tab-link" + (this.state.tabIndex == OVERVIEW ? " active" : "")}
          onClick={this.setTab.bind(this, OVERVIEW)}>
          <span>Definition</span>
        </button>
        <button className={"tab-link" + (this.state.tabIndex == FORMATTING ? " active" : "")}
          onClick={this.setTab.bind(this, FORMATTING)}>
          Formatting
        </button>
        <button className={"tab-link" + (this.state.tabIndex == EXPORTING ? " active" : "")}
          onClick={this.setTab.bind(this, EXPORTING)}>
          Exporting
        </button>
      </div>

      <div className="drawer-border"
        onMouseDown={this.onStartDraggingDrawerBorder.bind(this)}>
        <div className="drawer-full">
          <svg width="16" height="16" viewBox="4 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
          </svg>
        </div>
      </div>
    </div>;
  }
}

function updatePanelSize(app, ev)
{
  let size = 0;
  //This is the same criteria as in App.css
  if (window.matchMedia("(max-width: 400px)").matches)
  {
    //Vertical slide
    size = app.offsetHeight - ev.clientY;
  }
  else
  {
    //Horizontal slide
    size = app.offsetWidth - ev.clientX;
  }

  //Make sure is greater than minimum size and vice versa
  if (size < MIN_PANEL_SIZE) size = MIN_PANEL_SIZE;

  //Set panel size
  app.style.setProperty("--panel-size", size + "px");
}

export default Drawer;
