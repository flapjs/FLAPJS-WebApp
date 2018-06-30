import React from 'react';

import OverviewPanel from './panels/OverviewPanel.js';
import TestingPanel from './panels/TestingPanel.js';
import FormattingPanel from './panels/FormattingPanel.js';
import ExportingPanel from './panels/ExportingPanel.js';

import './Drawer.css';

const OVERVIEW = 0;
const TESTING = 1;
const FORMATTING = 2;
const EXPORTING = 3;

const DEFAULT_TAB_INDEX = OVERVIEW;

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

  render()
  {
    return <div className="drawer-container">
      <div className="drawer-content">
        {this.getTab(this.state.tabIndex)}
      </div>

      <div className="tab-list">
        <button className={"tab-link" + (this.state.tabIndex == OVERVIEW ? " active" : "")}
          onClick={this.setTab.bind(this, OVERVIEW)}>
          <span>Overview</span>
        </button>
        <button className={"tab-link" + (this.state.tabIndex == TESTING ? " active" : "")}
          onClick={this.setTab.bind(this, TESTING)}>
          Testing
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
    </div>;
  }
}

export default Drawer;
