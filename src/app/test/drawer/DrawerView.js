import React from 'react';
import Style from './DrawerView.css';

import DrawerPanelView from './DrawerPanelView.js';
import Icon from 'test/Icon.js';

const DRAWER_WIDTH_CSSVAR = "--drawer-width";
const DRAWER_HANDLE_DRAG_OFFSET = 6;
const DRAWER_HANDLE_MIN_SIZE_BUFFER = 32;
const DRAWER_HANDLE_MAX_SIZE_BUFFER = 128;
const DRAWER_MIN_WIDTH = 200;
const DRAWER_RESIZE_REFRESH_RATE = 200;
const DRAWER_TAB_LIST_BUFFER = 150;

const DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE = false;
const DRAWER_SHOULD_COLLAPSE_LARGE_TAB_LIST = false;

export const DRAWER_WIDTH_TYPE_FULL = "full";
export const DRAWER_WIDTH_TYPE_MIN = "min";
export const DRAWER_SIDE_BOTTOM = "bottom";
export const DRAWER_SIDE_RIGHT = "right";
export const DRAWER_BAR_DIRECTION_VERTICAL = "vertical";
export const DRAWER_BAR_DIRECTION_HORIZONTAL = "horizontal";

class DrawerView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
    this.drawerElement = null;

    this.state = {
      open: false,
      tabIndex: 0
    };

    //When drawer is currently changing size intentfully
    this._handlingGrab = false;
    //Whether the drawer should fullscreen
    this._isfull = false;
    //Whether to restore drawer width after fullscreen
    this._hasintent = false;
    //Save intentful drawer width for restore after fullscreen
    this._prevWidth = DRAWER_MIN_WIDTH;
    //Used to manage resize updates
    this._resizeTimeout = null;
    //Changed in render() to reflect current render state.
    this._sideways = false;

    this.onDrawerHandleGrab = this.onDrawerHandleGrab.bind(this);
    this.onDrawerHandleRelease = this.onDrawerHandleRelease.bind(this);
    this.onDrawerHandleMove = this.onDrawerHandleMove.bind(this);
    this.onDrawerExpand = this.onDrawerExpand.bind(this);
    this.onDrawerNextTabList = this.onDrawerNextTabList.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  //Override
  componentDidMount()
  {
    window.addEventListener('resize', this.onWindowResize, false);
  }

  //Override
  componentWillUnmount()
  {
    window.removeEventListener('resize', this.onWindowResize);
  }

  openDrawer(fullscreen=false, callback=null)
  {
    if (fullscreen)
    {
      this.setDrawerWidth(DRAWER_WIDTH_TYPE_FULL, true);
    }

    if (!this.state.open)
    {
      this.setState({ open: true }, callback);
    }
  }

  closeDrawer(callback=null)
  {
    if (this.state.open)
    {
      this.setState({ open: false }, callback);
    }
  }

  toggleDrawer(callback=null)
  {
    this.setState((prev, props) => {
      return { open: !prev.open };
    }, callback);
  }

  isDrawerOpen()
  {
    return this.state.open;
  }

  isDrawerFullscreen()
  {
    return this._isfull;
  }

  setCurrentTab(tabIndex)
  {
    if (!this.props.tabs) return;
    if (tabIndex >= this.props.tabs.length) tabIndex = 0;
    if (this.state.open && this.state.tabIndex === tabIndex)
    {
      //Toggle fullscreen
      if (this._isfull)
      {
        this.setDrawerWidth(this._prevWidth);
      }
      else
      {
        this.setDrawerWidth(DRAWER_WIDTH_TYPE_FULL, true);
      }
    }
    else
    {
      //Open and set tab index
      this.setState({open: true, tabIndex: tabIndex});
    }
  }

  getCurrentTabIndex()
  {
    return this.state.tabIndex;
  }

  isCurrentTab(tabIndex)
  {
    return this.state.tabIndex === tabIndex;
  }

  getTabListIndex(tabIndex)
  {
    if (!this.drawerElement) return tabIndex;
    //TODO: Possibly inefficient, depends on what getBoundingClientRect does.
    const boundingRect = this.drawerElement.getBoundingClientRect();
    const elementSize = this._sideways ? boundingRect.height : boundingRect.width;
    const numOfTabs = elementSize / DRAWER_TAB_LIST_BUFFER;
    return Math.floor(tabIndex / numOfTabs);
  }

  getCurrentTabListIndex()
  {
    return this.getTabListIndex(this.state.tabIndex);
  }

  setDrawerWidth(value, hasIntent=true)
  {
    if (!this.drawerElement || !this.ref) return;

    this._hasintent = hasIntent;

    const drawerSide = this.props.side;
    const drawerOffsetY = this.ref.getBoundingClientRect().top;
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const documentSize = isDrawerSideBottom ?
      document.documentElement.clientHeight - drawerOffsetY:
      document.documentElement.clientWidth;
    const minSize = DRAWER_MIN_WIDTH;

    if (typeof value === 'string')
    {
      switch(value)
      {
        case DRAWER_WIDTH_TYPE_FULL:
          this._isfull = true;
          this._prevWidth = getCSSDrawerWidth(this.drawerElement);
          this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, documentSize + "px");
          break;
        case DRAWER_WIDTH_TYPE_MIN:
          this._isfull = false;
          this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, minSize + "px");
          break;
        default:
          throw new Error("Trying to set drawer width to invalid string");
      }
    }
    else if (typeof value === 'number')
    {
      if (value < minSize + DRAWER_HANDLE_MIN_SIZE_BUFFER) value = minSize;
      if (value > documentSize - DRAWER_HANDLE_MAX_SIZE_BUFFER)
      {
        value = documentSize;
        this._isfull = true;
      }
      else
      {
        this._isfull = false;
      }
      this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, value + "px");
    }
    else
    {
      throw new Error("Trying to set drawer width to unknown value");
    }
  }

  onDrawerExpand()
  {
    //Don't close, just small-ify.
    if (this.state.open && this._isfull)
    {
      this.setDrawerWidth(this._prevWidth);
    }
    else
    {
      this.toggleDrawer();
    }
  }

  onDrawerNextTabList()
  {
    //NOTE: Inefficient, but since we don't expect more than 10 tabs in a list,
    //this shouldn't be a problem.
    const currentTabListIndex = this.getCurrentTabListIndex();
    let nextTabIndex = this.getCurrentTabIndex() + 1;
    while(this.getTabListIndex(nextTabIndex) === currentTabListIndex)
    {
      ++nextTabIndex;
    }
    this.setCurrentTab(nextTabIndex);
  }

  onWindowResize(e)
  {
    if (!this._resizeTimeout)
    {
      this._resizeTimeout = setTimeout(() => {
        this._resizeTimeout = null;

        if (!this.drawerElement || !this.ref) return;

        const drawerSide = this.props.side;
        const drawerOffsetY = this.ref.getBoundingClientRect().top;
        const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
        const documentSize = isDrawerSideBottom ?
          document.documentElement.clientHeight - drawerOffsetY:
          document.documentElement.clientWidth;

        if (this._isfull)
        {
          if (this._hasintent) return;
          if (this._prevWidth + DRAWER_HANDLE_MAX_SIZE_BUFFER < documentSize)
          {
            this._isfull = false;
            this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, this._prevWidth + "px");
          }
        }
        else
        {
          const drawerSize = getCSSDrawerWidth(this.drawerElement);
          if (drawerSize + DRAWER_HANDLE_MAX_SIZE_BUFFER > documentSize)
          {
            this._isfull = true;
            this._hasintent = false;
            this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, drawerSize + "px");
          }
        }
      }, DRAWER_RESIZE_REFRESH_RATE);
    }
  }

  onDrawerHandleGrab(e)
  {
    if (!this._handlingGrab)
    {
      this._handlingGrab = true;
      this._prevWidth = getCSSDrawerWidth(this.drawerElement);
      document.addEventListener("mouseup", this.onDrawerHandleRelease);
      document.addEventListener("mousemove", this.onDrawerHandleMove);
    }
    else
    {
      this.onDrawerHandleRelease(e);
    }
  }

  onDrawerHandleRelease(e)
  {
    if (this._handlingGrab)
    {
      document.removeEventListener("mouseup", this.onDrawerHandleRelease);
      document.removeEventListener("mousemove", this.onDrawerHandleMove);
      this._handlingGrab = false;
      this._prevWidth = getCSSDrawerWidth(this.drawerElement);
    }
  }

  onDrawerHandleMove(e)
  {
    const drawerSide = this.props.side;
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const documentSize = isDrawerSideBottom ?
      document.documentElement.clientHeight :
      document.documentElement.clientWidth;
    const pointerValue = isDrawerSideBottom ? e.clientY : e.clientX;

    this.setDrawerWidth(documentSize - pointerValue + DRAWER_HANDLE_DRAG_OFFSET);
  }

  //Override
  render()
  {
    const drawerTabs = this.props.tabs;
    const drawerSide = this.props.side || DRAWER_SIDE_RIGHT;
    const drawerDirection = this.props.direction || DRAWER_BAR_DIRECTION_HORIZONTAL;

    const isDrawerOpen = this.state.open;
    //Assumes that parent container has flex and flex-direction: column for bottom, row for right.
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const shouldDrawerBarSideways = !isDrawerSideBottom && (!isDrawerOpen || drawerDirection === DRAWER_BAR_DIRECTION_VERTICAL);
    const showDrawerHandle = isDrawerOpen || this._handlingGrab;
    const shouldDrawerOpenFull = this._isfull;
    const shouldHideDrawerContent = (DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE && this._handlingGrab) || !isDrawerOpen;
    const shouldCollapseDrawerTabs = DRAWER_SHOULD_COLLAPSE_LARGE_TAB_LIST && drawerTabs && this.getTabListIndex(drawerTabs.length - 1) > 0;
    const showDrawerTabs = isDrawerOpen || !shouldCollapseDrawerTabs;

    //Used to handle sideways logic
    this._sideways = shouldDrawerBarSideways;

    return (
      <div ref={ref=>this.ref=ref}
      id={this.props.id}
      className={Style.app_content +
        (isDrawerSideBottom ? " column " : "") +
        (" " + this.props.className)}
      style={this.props.style}>
        <div className={Style.app_viewport}>
        </div>
        <div ref={ref=>this.drawerElement=ref}
        className={
          Style.app_drawer +
          (isDrawerOpen ? " open " : "") +
          (shouldDrawerBarSideways ? " drawer-bar-sideways " : "") +
          (isDrawerSideBottom ? " drawer-side-bottom " : "") +
          (shouldDrawerOpenFull ? " full " : "") +
          (shouldHideDrawerContent ? " hide " : "")}>
          <div className={Style.drawer_handle + (showDrawerHandle ? " show " : "")} onMouseDown={this.onDrawerHandleGrab}>
            <span>{isDrawerSideBottom ? "\uFF1D" : "||"}</span>
          </div>
          <div className={Style.drawer_content}>
            <nav className={Style.drawer_content_bar}>
              <a className={Style.drawer_tab_expander} onClick={this.onDrawerExpand}>
                <Icon/>
              </a>
              {showDrawerTabs && drawerTabs && drawerTabs.map((e, i) => {
                if (DRAWER_SHOULD_COLLAPSE_LARGE_TAB_LIST && this.getCurrentTabListIndex() !== this.getTabListIndex(i)) return null;
                return (
                  <a key={e + ":" + i}
                  className={Style.drawer_tab +
                    (this.isCurrentTab(i) ? " active " : "")}
                  onClick={() => this.setCurrentTab(i)}>
                    <label>{e}</label>
                  </a>
                );
              })}
              {showDrawerTabs && shouldCollapseDrawerTabs &&
                <a className={Style.drawer_tab_next} onClick={this.onDrawerNextTabList}>
                  <Icon/>
                </a>}
            </nav>
            <div className={Style.drawer_panel_container}>
              <div className={Style.drawer_content_panel}>
                {
                  drawerTabs && drawerTabs.map((e, i) => {
                  if (!this.isCurrentTab(i)) return null;
                  return (
                    <DrawerPanelView key={e + ":" + i}>
                      <h1>{e}</h1>
                    </DrawerPanelView>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DrawerView;

function getCSSDrawerWidth(drawerElement)
{
  return parseInt(window.getComputedStyle(drawerElement).getPropertyValue(DRAWER_WIDTH_CSSVAR).replace(/\D/g, ''));
}
