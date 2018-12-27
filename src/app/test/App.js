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

    this.drawerComponent = null;

    this.state = {
      drawerOpen: false
    };

    this.onDrawerExpand = this.onDrawerExpand.bind(this);
  }

  openDrawer(fullscreen=false)
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

  onDrawerExpand()
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
            <ToolbarButton title="Other" iconClass={Icon}/>
          </div>
        </div>
        <div className="app-content">
          <div className="app-viewport">
          </div>
          <Drawer ref={ref=>this.drawerComponent=ref}
            open={this.state.drawerOpen}
            onExpand={this.onDrawerExpand}/>
        </div>
      </div>
    );
  }
}

export default App;
