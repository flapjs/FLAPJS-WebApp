import React from 'react';
import './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from './DrawerView.js';
import Toolbar from './Toolbar.js';
import ToolbarButton from './ToolbarButton.js';

import Icon from './Icon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");
  }

  //Override
  render()
  {
    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
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
        <DrawerView
          side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
          direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}>
        </DrawerView>
      </div>
    );
  }
}

export default App;
