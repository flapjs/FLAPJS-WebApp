import React from 'react';
import Style from './DrawerView.css';

import Drawer, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from './Drawer.js';

class DrawerView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.drawerComponent = null;

    this.state = {
      drawerOpen: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

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
    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    return (
      <div id={this.props.id}
      className={Style.app_content +
        (hasSmallWidth ? " column " : "") +
        (" " + this.props.className)}
      style={this.props.style}>
        <div className={Style.app_viewport}>
        </div>
        <Drawer ref={ref=>this.drawerComponent=ref}
          open={this.state.drawerOpen}
          side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
          direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
          onExpand={this.onDrawerExpand}/>
      </div>
    );
  }
}

export default DrawerView;
