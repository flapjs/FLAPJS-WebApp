import React from 'react';
import { hot } from 'react-hot-loader';

import './App.css';

import Toolbar from 'toolbar/Toolbar.js';
import Workspace from 'workspace/Workspace.js';
import Drawer from 'workspace/Drawer.js';
import Viewport from 'workspace/Viewport.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      isOpen: false
    };
  }

  openDrawer()
  {
    this.setState((prev, props) => {
      return { isOpen: true };
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

  render()
  {
    return (
      <div className="app-container">
        <Toolbar app={this}/>

        <div className="workspace-container">
          <div className={"workspace-main" + (this.state.isOpen ? " open" : "")}>
            <Workspace />
          </div>
          <div className={"workspace-viewport" + (this.state.isOpen ? " open" : "")}>
            <Viewport />
          </div>
          <div className={"workspace-drawer" + (this.state.isOpen ? " open" : "")}>
            <Drawer />
          </div>
        </div>
      </div>
    );
  }
}

//For hotloading this class
export default hot(module)(App);
