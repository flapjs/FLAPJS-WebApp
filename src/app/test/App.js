import React from 'react';
import './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from './drawer/DrawerView.js';
import ToolbarView from './toolbar/ToolbarView.js';
import TapeWidget from './widgets/TapeWidget.js';
import UploadDropZone from './components/UploadDropZone.js';
import WorkspaceView from './workspace/WorkspaceView.js';

import Notifications from 'system/notification/Notifications.js';
import NotificationView from 'system/notification/components/NotificationView.js';

import InputAdapter from 'system/inputadapter/InputAdapter.js';
import UndoManager from 'system/undomanager/UndoManager.js';

import FSAModule from 'modules/fsa/FSAModule.js';
import DefaultDrawerPanel from './drawer/DefaultDrawerPanel.js';
import NewToolbarButton from './NewToolbarButton.js';

import IconStateButton from './components/IconStateButton.js';
import FullscreenIcon from './iconset/FullscreenIcon.js';
import FullscreenExitIcon from './iconset/FullscreenExitIcon.js';

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this._workspace = null;

    //These need to be initialized before module
    this._inputAdapter = new InputAdapter();
    this._inputAdapter.getViewport()
      .setMinScale(0.1)
      .setMaxScale(10)
      .setOffsetDamping(0.4);
    this._undoManager = new UndoManager();

    this._module = new FSAModule(this);

    this.drawerPanels = [DefaultDrawerPanel];
    this.toolbarButtons = [new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton(), new NewToolbarButton()];
    this.viewportWidgets = [];

    this.state = {
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

    Notifications.addMessage("WHAT?");
  }

  //Override
  componentDidMount()
  {
    //Initialize input adapter
    const workspaceDOM = this._workspace.ref;
    this._inputAdapter.initialize(workspaceDOM);

    //Initialize the module...
    const module = this.getCurrentModule();
    module.initialize(this);
  }

  //Override
  componentWillUnmount()
  {

  }

  get workspace()
  {
    return this._workspace;
  }

  get viewport()
  {
    return this._inputAdapter.getViewport();
  }

  getCurrentModule()
  {
    return this._module;
  }

  getInputAdapter()
  {
    return this._inputAdapter;
  }

  getUndoManager()
  {
    return this._undoManager;
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
            panels={this._module.getModulePanels()}
            panelProps={{currentModule: this._module}}
            side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
            direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
            hide={isFullscreen}>
              <UploadDropZone>
                <div className="viewport">
                  <WorkspaceView ref={ref=>this._workspace=ref}>
                  </WorkspaceView>
                  <NotificationView notificationManager={Notifications}></NotificationView>
                  <div className="viewport-widget viewport-side-right">
                    <IconStateButton onClick={(e, i) => this.setState({hide: (i === 0)})}>
                      <FullscreenIcon/>
                      <FullscreenExitIcon/>
                    </IconStateButton>
                  </div>
                </div>
              </UploadDropZone>
          </DrawerView>
        </div>
    );
  }
}

/*

<div className="viewport-tray">
</div>
<div className="viewport-navbar">
</div>
<div className="viewport-widget viewport-side-bottom">
  <TapeWidget/>
</div>

*/

export default App;
