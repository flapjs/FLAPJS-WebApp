import React from 'react';
import './App.css';

import Drawer from './Drawer.js';
import Toolbar from './Toolbar.js';
import ToolbarButton from './ToolbarButton.js';

import Icon from './Icon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      drawerOpen: false
    };

    this.onDrawerExpand = this.onDrawerExpand.bind(this);
  }

  openDrawer()
  {
    this.setState({ drawerOpen: true });
  }

  closeDrawer()
  {
    this.setState({ drawerOpen: false });
  }

  toggleDrawer()
  {
    this.setState((prev, props) => {
      return { drawerOpen: !prev.drawerOpen };
    });
  }

  onDrawerExpand(e)
  {
    this.toggleDrawer();
  }

  //Override
  render()
  {
    return (
      <div className="app-container">
        <div className={"app-bar"}>
          <div className="app-title">
            <h1>AppBar</h1>
          </div>
          <div className="app-toolbar">
            <ToolbarButton title="Other" iconClass={Icon} open={this.state.toolbarOpen}/>
          </div>
        </div>
        <div className="app-content">
          <div className="app-viewport">
          </div>
          <div className={"app-drawer " + (this.state.drawerOpen ? "open" : "")}>
            <nav className="drawer-bar">
              <a className="drawer-tab" onClick={this.onDrawerExpand}>Drawer</a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>Boo</a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>What</a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>Nothing</a>
            </nav>
            <div className="drawer-panel">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
