import React from 'react';
import Style from './DrawerView.css';

import DrawerPanelView from './DrawerPanelView.js';
import Icon from './Icon.js';

const DRAWER_WIDTH_CSSVAR = "--drawer-width";
const DRAWER_HANDLE_DRAG_OFFSET = 6;
const DRAWER_HANDLE_MIN_SIZE_BUFFER = 32;
const DRAWER_HANDLE_MAX_SIZE_BUFFER = 128;
const DRAWER_MIN_WIDTH = 200;
const DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE = false;

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

    this.drawerElement = null;

    this.state = {
      open: false
    };

    this._handlingGrab = false;
    this._isfull = false;
    this._hasintent = false;
    this._prevWidth = DRAWER_MIN_WIDTH;

    this.onDrawerHandleGrab = this.onDrawerHandleGrab.bind(this);
    this.onDrawerHandleRelease = this.onDrawerHandleRelease.bind(this);
    this.onDrawerHandleMove = this.onDrawerHandleMove.bind(this);
    this.onDrawerExpand = this.onDrawerExpand.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  //Override
  componentDidMount()
  {
    window.addEventListener('resize', this.onWindowResize);
  }

  //Override
  componentWillUnmount()
  {
    window.removeEventListener('resize', this.onWindowResize);
  }

  openDrawer(fullscreen=false)
  {
    this.setState({ open: true });
  }

  closeDrawer()
  {
    this.setState({ open: false });
  }

  toggleDrawer()
  {
    this.setState((prev, props) => {
      return { open: !prev.open };
    });
  }

  setDrawerWidth(value)
  {
    if (!this.drawerElement) return;

    this._hasintent = true;

    const drawerSide = this.props.side;
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const documentSize = isDrawerSideBottom ?
      document.documentElement.clientHeight - 80 - 2:
      document.documentElement.clientWidth;
    const minSize = DRAWER_MIN_WIDTH;

    if (typeof value === 'string')
    {
      switch(value)
      {
        case DRAWER_WIDTH_TYPE_FULL:
          this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, documentSize + "px");
          this._isfull = true;
          break;
        case DRAWER_WIDTH_TYPE_MIN:
          this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, minSize + "px");
          this._isfull = false;
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
    this.toggleDrawer();
  }

  onWindowResize(e)
  {
    if (!this.drawerElement) return;

    const drawerSide = this.props.side;
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const documentSize = isDrawerSideBottom ?
      document.documentElement.clientHeight - 80 - 2:
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
      const drawerSize = parseInt(window.getComputedStyle(this.drawerElement).getPropertyValue(DRAWER_WIDTH_CSSVAR).replace(/\D/g, ''));
      if (drawerSize + DRAWER_HANDLE_MAX_SIZE_BUFFER > documentSize)
      {
        this._isfull = true;
        this._hasintent = false;
        this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, drawerSize + "px");
      }
    }
  }

  onDrawerHandleGrab(e)
  {
    if (!this._handlingGrab)
    {
      this._handlingGrab = true;
      this._prevWidth = parseInt(window.getComputedStyle(this.drawerElement).getPropertyValue(DRAWER_WIDTH_CSSVAR).replace(/\D/g, ''));
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
      this._prevWidth = parseInt(window.getComputedStyle(this.drawerElement).getPropertyValue(DRAWER_WIDTH_CSSVAR).replace(/\D/g, ''));
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
    const drawerSide = this.props.side || DRAWER_SIDE_RIGHT;
    const drawerDirection = this.props.direction || DRAWER_BAR_DIRECTION_HORIZONTAL;

    const isDrawerOpen = this.state.open;
    //Assumes that parent container has flex and flex-direction: column for bottom, row for right.
    const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
    const shouldDrawerBarSideways = !isDrawerSideBottom && (!isDrawerOpen || drawerDirection === DRAWER_BAR_DIRECTION_VERTICAL);
    const showDrawerHandle = isDrawerOpen || this._handlingGrab;
    const shouldDrawerOpenFull = this._isfull;
    const shouldHideDrawerContent = (DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE && this._handlingGrab) || !isDrawerOpen;

    return (
      <div id={this.props.id}
      className={Style.app_content +
        (isDrawerSideBottom ? " column " : "") +
        (" " + this.props.className)}
      style={this.props.style}>
        <div className={Style.app_viewport}>
        </div>
        <div ref={ref=>this.drawerElement=ref} className={
          Style.app_drawer +
          (isDrawerOpen ? " open " : "") +
          (shouldDrawerBarSideways ? " drawer-bar-sideways " : "") +
          (isDrawerSideBottom ? " drawer-side-bottom " : "") +
          (shouldDrawerOpenFull ? " full " : "") +
          (shouldHideDrawerContent ? " hide " : "")
        }>
          <div className={Style.drawer_handle + (showDrawerHandle ? " show " : "")} onMouseDown={this.onDrawerHandleGrab}>
            <span>{isDrawerSideBottom ? "\uFF1D" : "||"}</span>
          </div>
          <div className={Style.drawer_content}>
            <nav className={Style.drawer_content_bar}>
              <a className={Style.drawer_tab_expander} onClick={this.onDrawerExpand}>
                <Icon/>
              </a>
              <a className={Style.drawer_tab}><label>Start</label></a>
              <a className={Style.drawer_tab}><label>Middle-ish</label></a>
              <a className={Style.drawer_tab}><label>End</label></a>
            </nav>
            <div className={Style.drawer_panel_container}>
              <div className={Style.drawer_content_panel}>
                <DrawerPanelView>
                </DrawerPanelView>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DrawerView;
