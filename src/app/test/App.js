import React from 'react';
import './App.css';

import DrawerView from './DrawerView.js';
import Toolbar from './Toolbar.js';
import ToolbarButton from './ToolbarButton.js';

import Icon from './Icon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);
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
        <DrawerView>
        </DrawerView>
      </div>
    );
  }
}

export default App;
