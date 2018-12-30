import React from 'react';
import './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from './drawer/DrawerView.js';
import ToolbarView from './toolbar/ToolbarView.js';

import Notifications from 'system/notification/Notifications.js';
import NotificationView from 'system/notification/components/NotificationView.js';

import AboutDrawerPanel from './AboutDrawerPanel.js';
import NewToolbarButton from './NewToolbarButton.js';

import IconStateButton from './components/IconStateButton.js';
import FullscreenIcon from './iconset/FullscreenIcon.js';
import FullscreenExitIcon from './iconset/FullscreenExitIcon.js';
import DownArrowIcon from './iconset/DownArrowIcon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.drawerPanels = [new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel(), new AboutDrawerPanel()];
    this.toolbarButtons = [new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton()];
    this.viewportWidgets = [];
    this.inputs = "0129389472637892012u93________".split('');

    this.counter = 0;
    this.index = 0;

    this.state = {
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

    Notifications.addMessage("WHAT?");
  }

  //Override
  render()
  {
    if (++this.counter >= 100)
    {
      this.counter = 0;
      this.index += 1;
    }
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
          <NotificationView notificationManager={Notifications}></NotificationView>
          <div className="viewport-tray">
          </div>
          <div className="viewport-navbar">
          </div>
          <div className="viewport-widget viewport-side-bottom">
            <div className="tape-container">
              <DownArrowIcon className="tape-pointer" style={{left: Math.floor((this.index - 1) / 2) + "em"}}/>
              <div className="tape-row">
                {this.inputs.map((e, i) => {
                  let active = false;
                  let activeRead = false;
                  const currentIndex = Math.floor(this.index / 2);
                  if (currentIndex === i)
                  {
                    //It's the current index...
                    active = this.index % 2 === 1;
                    activeRead = this.index % 2 === 0;
                  }
                  else if (currentIndex === i + 1)
                  {
                    //It's the previous index...
                    active = this.index % 2 === 0;
                  }

                  return <div className={"tape-row-entry" + (active ? " active " : "") + (activeRead ? " active-read " : "")}>
                    <span className="tape-row-states">
                      <label>{"q0"}</label>
                      <label>{"q1"}</label>
                      <label>{"q2"}</label>
                      <label>{"q3"}</label>
                      <label>{"q4"}</label>
                      <label>{"q5"}</label>
                    </span>
                    <label className="tape-row-symbol">{e}</label>
                  </div>;
                })}
              </div>
            </div>
          </div>
          <div className="viewport-widget viewport-side-right">
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
