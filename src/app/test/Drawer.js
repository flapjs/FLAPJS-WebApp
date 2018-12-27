import React from 'react';
import './Drawer.css';

import Icon from './Icon.js';

const DRAWER_WIDTH_CSSVAR = "--drawer-width";
const DRAWER_HANDLE_DRAG_OFFSET = 6;
const DRAWER_HANDLE_MIN_SIZE_BUFFER = 32;
const DRAWER_HANDLE_MAX_SIZE_BUFFER = 128;
const DRAWER_MIN_WIDTH = 300;

const DRAWER_WIDTH_TYPE_FULL = "full";
const DRAWER_WIDTH_TYPE_MIN = "min";

class Drawer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;

    this._mediaQueryList = window.matchMedia("only screen and (min-height: 400px)");
    this._handlingGrab = false;

    this.onDrawerHandleGrab = this.onDrawerHandleGrab.bind(this);
    this.onDrawerHandleRelease = this.onDrawerHandleRelease.bind(this);
    this.onDrawerHandleMove = this.onDrawerHandleMove.bind(this);
  }

  setDrawerWidth(value)
  {
    if (!this.ref) return;

    if (typeof value === 'string')
    {
      const documentWidth = document.documentElement.clientWidth;
      switch(value)
      {
        case DRAWER_WIDTH_TYPE_FULL:
          this.ref.style.setProperty(DRAWER_WIDTH_CSSVAR, documentWidth + "px");
          break;
        case DRAWER_WIDTH_TYPE_MIN:
          this.ref.style.setProperty(DRAWER_WIDTH_CSSVAR, DRAWER_MIN_WIDTH + "px");
          break;
        default:
          throw new Error("Trying to set drawer width to invalid string");
      }
    }
    else if (typeof value === 'number')
    {
      const documentWidth = document.documentElement.clientWidth;
      if (value < DRAWER_MIN_WIDTH + DRAWER_HANDLE_MIN_SIZE_BUFFER) value = DRAWER_MIN_WIDTH;
      if (value > documentWidth - DRAWER_HANDLE_MAX_SIZE_BUFFER) value = documentWidth;
      this.ref.style.setProperty(DRAWER_WIDTH_CSSVAR, value + "px");
    }
    else
    {
      throw new Error("Trying to set drawer width to unknown value");
    }
  }

  onDrawerHandleGrab(e)
  {
    if (!this._handlingGrab)
    {
      this._handlingGrab = true;
      document.addEventListener("mouseup", this.onDrawerHandleRelease);
      document.addEventListener("mousemove", this.onDrawerHandleMove);
    }
  }

  onDrawerHandleRelease(e)
  {
    if (this._handlingGrab)
    {
      document.removeEventListener("mouseup", this.onDrawerHandleRelease);
      document.removeEventListener("mousemove", this.onDrawerHandleMove);
      this._handlingGrab = false;
    }
  }

  onDrawerHandleMove(e)
  {
    const documentWidth = document.documentElement.clientWidth;
    this.setDrawerWidth(documentWidth - e.clientX + DRAWER_HANDLE_DRAG_OFFSET);
  }

  //Override
  render()
  {
    const expandCallback = this.props.onExpand;
    const isDrawerOpen = this.props.open;
    const shouldDrawerBarSideways = !isDrawerOpen || this._mediaQueryList.matches;
    const showDrawerHandle = isDrawerOpen || this._handlingGrab;

    return (
      <div ref={ref=>this.ref=ref} className={"app-drawer " + (isDrawerOpen ? "open " : "") + (shouldDrawerBarSideways ? "sideways " : "")}>
        <div className={"drawer-handle " + (showDrawerHandle ? "show " : "")} onMouseDown={this.onDrawerHandleGrab}><span>||</span></div>
        <div className="drawer-content">
          <nav className="drawer-content-bar">
            <a className="drawer-tab-expander" onClick={expandCallback}>
              <Icon/>
            </a>
            <a className="drawer-tab"><label>Start</label></a>
            <a className="drawer-tab"><label>Middle-ish</label></a>
            <a className="drawer-tab"><label>End</label></a>
          </nav>
          <div className="drawer-content-panel">
            <div className="drawer-panel">
              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at mi a magna posuere congue quis in lorem. Ut ornare nulla tempus, finibus velit eu, finibus odio. Etiam et felis diam. Phasellus convallis non justo non posuere. Duis facilisis felis ut sapien posuere tincidunt. Donec a neque nec nisi dignissim semper. Integer egestas tincidunt mauris eu molestie. Aliquam vitae consequat lacus. Maecenas sollicitudin tristique dolor. Curabitur consequat, justo semper accumsan ultrices, est nunc cursus eros, a egestas sapien quam vitae magna. Vivamus id ante mauris.

Duis et ipsum at metus bibendum pretium. Nam maximus justo id consectetur eleifend. Pellentesque pretium sapien at porta aliquet. Duis nec magna eleifend, vulputate est at, blandit nulla. Praesent et condimentum diam, nec ultrices eros. Nunc pharetra id ex ac efficitur. Donec porttitor odio nec purus tincidunt euismod. Integer congue nec diam eu viverra.

Duis vel dignissim orci, id laoreet tellus. Duis faucibus quam vitae ligula maximus egestas. Ut sed tellus et metus lobortis volutpat. Donec vitae ultrices sapien, sit amet imperdiet orci. Morbi vulputate rutrum nisi, vel ornare nunc sodales sit amet. Suspendisse ultricies nec augue eu ullamcorper. Aliquam ante massa, feugiat nec turpis vitae, sagittis finibus nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed sit amet odio vehicula, cursus neque eget, molestie risus. Vivamus faucibus massa ac tincidunt sagittis. Maecenas auctor odio eu lobortis bibendum. Phasellus mollis congue neque et sollicitudin. Mauris vestibulum sit amet est ac feugiat. Ut mattis in quam at suscipit. Quisque feugiat ornare convallis.

In ut dolor id quam pretium luctus sed eu orci. Morbi vitae eros volutpat, tempor ex id, vestibulum est. Aliquam nec pulvinar eros. Pellentesque maximus, sapien id sagittis aliquet, turpis magna efficitur arcu, vel rhoncus dui arcu in augue. Aenean in sapien in orci faucibus eleifend eget tristique nulla. Sed varius varius libero. Sed sagittis felis lectus, ultrices tincidunt odio placerat nec.

Proin nec ante varius, tristique enim id, mollis mauris. Donec condimentum, lectus ut ultricies vulputate, lectus sapien euismod orci, et interdum turpis erat sed libero. Pellentesque imperdiet, nunc a egestas luctus, ipsum erat pharetra leo, id cursus sem mi ac augue. Nulla feugiat velit tellus, ac efficitur velit pellentesque eleifend. Donec consequat porta maximus. Cras nec tellus tincidunt, venenatis orci et, blandit odio. Proin finibus mauris eu malesuada facilisis. Suspendisse potenti. Pellentesque ut sapien sit amet quam hendrerit imperdiet vitae vitae arcu. Vestibulum fringilla euismod quam ac tempor.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Drawer;
