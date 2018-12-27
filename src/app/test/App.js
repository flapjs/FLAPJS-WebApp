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

    this._mediaQueryList = window.matchMedia("only screen and (min-height: 400px)");

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
    const isDrawerOpen = this.state.drawerOpen;
    const shouldDrawerBarSideways = this._mediaQueryList.matches;

    return (
      <div className="app-container">
        <div className={"app-bar"}>
          <div className="app-title">
            <h1>AppBar</h1>
          </div>
          <div className="app-toolbar">
            <ToolbarButton title="Other" iconClass={Icon}/>
          </div>
        </div>
        <div className="app-content">
          <div className="app-viewport">
          </div>
          <div className={"app-drawer " + (isDrawerOpen ? "open " : "") + (shouldDrawerBarSideways ? "sideways " : "")}>
            <div className="drawer-handle">||</div>
            <nav className="drawer-bar">
              <a className="drawer-tab" onClick={this.onDrawerExpand}>
                <label>Drawer</label>
              </a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>
                <label>Nothing</label>
              </a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>
                <label>About</label>
              </a>
              <a className="drawer-tab" onClick={this.onDrawerExpand}>
                <label>Other</label>
              </a>
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
