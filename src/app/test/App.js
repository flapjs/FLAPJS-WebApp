import React from 'react';
import './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from './drawer/DrawerView.js';
import ToolbarView from './toolbar/ToolbarView.js';

import AboutDrawerPanel from './AboutDrawerPanel.js';
import NewToolbarButton from './NewToolbarButton.js';

import IconStateButton from './components/IconStateButton.js';
import FullscreenIcon from './iconset/FullscreenIcon.js';
import FullscreenExitIcon from './iconset/FullscreenExitIcon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.drawerPanels = [new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel()];
    this.toolbarButtons = [new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton()];
    this.viewportWidgets = [];

    this.state = {
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");
  }

  //Override
  render()
  {
    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    return (
      <div className="app-container">
        <ToolbarView className="app-bar"
          buttons={this.toolbarButtons}
          hide={isFullscreen}/>
        <DrawerView className="app-content"
          panels={this.drawerPanels}
          side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
          direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
          hide={isFullscreen}>
          <div className="viewport-tray">
          </div>
          <div className="viewport-navbar">
          </div>
          <div className="viewport-widget">
            <IconStateButton onClick={(e, i) => this.setState({hide: (i === 0)})}>
              <FullscreenIcon/>
              <FullscreenExitIcon/>
            </IconStateButton>
          </div>
        </DrawerView>
      </div>
    );
  }
}

export default App;
