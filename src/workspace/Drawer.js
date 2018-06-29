import React from 'react';

import OverviewPanel from './panels/OverviewPanel.js';

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

  getTab(tabIndex)
  {
    switch(tabIndex)
    {
      case OVERVIEW:
        return <OverviewPanel />;
      case TESTING:
        return <TestingPanel />;
      case FORMATTING:
        return <OverviewPanel />;
      case EXPORTING:
        return <OverviewPanel />;
      default:
        throw new Error("Unknown tab index \'" + tabIndex + "\'.");
    }
  }

  render()
  {
    return <div className="drawer-container">
      {this.getTab(this.state.tabIndex)}
      <h1>I drawer, therefore I slide.</h1>
    </div>;
  }
}

export default Drawer;
