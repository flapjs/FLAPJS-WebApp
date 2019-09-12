import React from 'react';
import './Drawer.css';

import DrawerExpander from './DrawerExpander.js';

import ExportingPanel from 'deprecated/content/panels/exporting/ExportingPanel.js';
import OptionsPanel from 'deprecated/content/panels/options/OptionsPanel.js';

const DEFAULT_PANELS = [ExportingPanel, OptionsPanel];
const DEFAULT_TAB_INDEX = 0;

const MAX_PANEL_THRESHOLD = 50;
const MIN_PANEL_SIZE = 300;//180

class Drawer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      tabIndex: DEFAULT_TAB_INDEX,
      dragging: false
    };

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this._ontouchmove = null;
    this._ontouchend = null;
  }

  setTab(index)
  {
    const app = this.props.app;

    //Open drawer if it is closed
    if (!app.state.isOpen)
    {
      app.openDrawer();
    }
    //Full drawer if clicked on same one
    else
    {
      if (this.state.tabIndex === index)
      {
        app.openDrawer(!app.state.isFullscreen);
      }
    }

    this.setState((prev, props) => {
      return { tabIndex: index };
    });
  }

  onStartDraggingDrawerBorder(x, y)
  {
    const app = this.props.app;
    this.setState({dragging: true});

    //Disable fullscreen if dragging off of it
    if (app.state.isFullscreen)
    {
      app.openDrawer(false);
    }

    //Update panel to current click position
    updatePanelSize(app, x, y);
  }

  onStopDraggingDrawerBorder()
  {
    this.setState({dragging: false});
  }

  onTouchStart(e)
  {
    e.stopPropagation();
    e.preventDefault();

    if (this._ontouchmove)
    {
      document.removeEventListener("touchmove", this._ontouchmove);
      this._ontouchmove = null;
    }

    if (this._ontouchend)
    {
      document.removeEventListener("touchend", this._ontouchend);
      this._ontouchend = null;
    }

    const app = this.props.app;
    //Ignore drag move if closed
    if (!app.state.isOpen)
    {
      /*
      //Opens the drawer if dragging, but closed
      this.props.app.openDrawer();
      */
      this.setState({dragging: false});
      return;
    }

    const touch = e.changedTouches[0];
    this.onStartDraggingDrawerBorder(touch.clientX, touch.clientY);

    this._ontouchmove = function(ev)
    {
      e.stopPropagation();
      e.preventDefault();

      const touch = ev.changedTouches[0];
      updatePanelSize(app, touch.clientX, touch.clientY);
    };

    document.addEventListener(this._ontouchmove);

    this._ontouchend = function(ev)
    {
      e.stopPropagation();
      e.preventDefault();

      const touch = ev.changedTouches[0];
      updatePanelSize(app, touch.clientX, touch.clientY);
      this.onStopDraggingDrawerBorder();

      //Remove listeners that are no longer needed
      document.removeEventListener("touchend", this._ontouchend);
      document.removeEventListener("touchmove", this._ontouchmove);
    };

    //Start listening to move and release events
    document.addEventListener("touchend", this._ontouchend);
    document.addEventListener("touchmove", this._ontouchmove);
  }

  onMouseDown(e)
  {
    e.stopPropagation();
    e.preventDefault();

    const app = this.props.app;
    //Ignore drag move if closed
    if (!app.state.isOpen)
    {
      /*
      //Opens the drawer if dragging, but closed
      this.props.app.openDrawer();
      */
      return;
    }

    this.onStartDraggingDrawerBorder(e.clientX, e.clientY);

    const onMouseMove = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev.clientX, ev.clientY);
    };

    const onMouseUp = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      updatePanelSize(app, ev.clientX, ev.clientY);
      this.onStopDraggingDrawerBorder();

      //Remove listeners that are no longer needed
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };

    //Start listening to move and release events
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  }

  onScroll(e)
  {
    //if (this.panel)
    {
      //TODO: this.panel.container.scrollBy(0, e.deltaY);
      //TODO: return false;
    }
  }

  render()
  {
    const app = this.props.app;
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    const tabIndex = this.state.tabIndex;
    const InfoPanel = currentModule ? currentModule.getModulePanels()[0] : null;

    return <div className={"drawer-container"} onWheel={this.onScroll}>
      <div className="drawer-content">
      {
        currentModule &&
        currentModule.getModulePanels().map((PanelClass, i) => {
          const panelID = i + 1;
          return <PanelClass key={currentModule.getModuleName() + ":" + panelID}
            style={{display: tabIndex == panelID ? "block" : "none"}}
            currentModule={currentModule}/>;
        })
      }
      {
        tabIndex == 0 && InfoPanel != null &&
        <InfoPanel currentModule={currentModule}/>
      }
      {
        DEFAULT_PANELS.map((PanelClass, i) => {
          const panelID = -(i + 1);
          return <PanelClass key={"default:" + panelID}
            style={{display: tabIndex == panelID ? "block" : "none"}}
            currentModule={currentModule}/>;
        })
      }
      </div>
      <div className="tab-list">
        <DrawerExpander app={app}/>
        {
          currentModule &&
          currentModule.getModulePanels().map((PanelClass, i) => {
            //Hide panels with no name...
            if (!PanelClass.UNLOCALIZED_NAME) return;

            const panelID = i + 1;
            return <button key={currentModule.getModuleName() + ":" + panelID}
              className={"tab-link" + (tabIndex === panelID ? " active" : "")}
              onClick={ev=>this.setTab(panelID)}>
              {I18N.toString(PanelClass.UNLOCALIZED_NAME || "component.untitled.title")}
            </button>;
          })
        }
        {
          DEFAULT_PANELS.map((PanelClass, i) => {
            const panelID = -(i + 1);
            return <button key={"default:" + panelID}
              className={"tab-link" + (tabIndex === panelID ? " active" : "")}
              onClick={ev=>this.setTab(panelID)}>
              {I18N.toString(PanelClass.UNLOCALIZED_NAME || "component.untitled.title")}
            </button>;
          })
        }
        <div className="tab-right"></div>
      </div>

      <div className={"drawer-border" + (this.state.dragging ? " dragging" : "")}
        onTouchStart={this.onTouchStart}
        onMouseDown={this.onMouseDown}>
      </div>
    </div>;
  }
}

function updatePanelSize(app, x, y)
{
  const container = app.container;
  let fullscreen = false;
  let size = 0;
  //This is the same criteria as in App.css
  if (window.matchMedia("(max-width: 420px)").matches)
  {
    //Vertical slide
    const viewportOffsetY = app.viewport.ref.getBoundingClientRect().y;
    if (y - viewportOffsetY < MAX_PANEL_THRESHOLD)
    {
      //Enable fullscreen
      app.setState((prev, props) => {
        return {
          isFullscreen: true
        };
      });
    }
    else
    {
      size = container.offsetHeight - y;

      //Disable fullscreen
      if (app.state.isFullscreen)
      {
        app.setState((prev, props) => {
          return {
            isFullscreen: false
          };
        });
      }
    }
  }
  else
  {
    //Horizontal slide
    if (x < MAX_PANEL_THRESHOLD)
    {
      //Enable fullscreen
      app.setState((prev, props) => {
        return {
          isFullscreen: true
        };
      });
    }
    else
    {
      size = container.offsetWidth - x;

      //Disable fullscreen
      if (app.state.isFullscreen)
      {
        app.setState((prev, props) => {
          return {
            isFullscreen: false
          };
        });
      }
    }
  }

  //Make sure is greater than minimum size and vice versa
  if (size < MIN_PANEL_SIZE) size = MIN_PANEL_SIZE;

  //Set panel size
  container.style.setProperty("--panel-size", size + "px");
}
Drawer.EXPORTING_PANEL_TAB_INDEX = -1;
Drawer.OPTIONS_PANEL_TAB_INDEX = -2;

export default Drawer;
