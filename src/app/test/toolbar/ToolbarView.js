import React from 'react';
import Style from './ToolbarView.css';

import {TOOLBAR_CONTAINER_MENU, TOOLBAR_CONTAINER_TOOLBAR} from './ToolbarButton.js';

import IconButton from '../components/IconButton.js';
import MenuIcon from '../iconset/MenuIcon.js';

const TOOLBAR_BUTTON_BUFFER = 150;
const TOOLBAR_ALLOW_MENU_BAR = true;

class ToolbarView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
    this.toolbarElement = null;

    this.state = {
      open: false,
      menuIndex: -1
    };

    this.onBarExpand = this.onBarExpand.bind(this);
  }

  openBar(callback=null)
  {
    if (!this.state.open)
    {
      //Open it, but also reset menu...
      this.setState({ open: true, menuIndex: -1 }, callback);
    }
  }

  closeBar(callback=null)
  {
    if (this.state.open)
    {
      //Close it, but also reset menu...
      this.setState({ open: false, menuIndex: -1 }, callback);
    }
  }

  toggleBar(callback=null)
  {
    //Toggle it, but also reset menu...
    this.setState((prev, props) => {
      return { open: !prev.open, menuIndex: -1 };
    }, callback);
  }

  isBarOpen()
  {
    return this.state.open;
  }

  setCurrentMenu(menuIndex)
  {
    if (!this.props.menus) return;
    if (menuIndex >= this.props.menus.length) menuIndex = -1;

    //Open and set tab index
    this.setState({open: true, menuIndex: menuIndex});
  }

  getCurrentMenuIndex()
  {
    return this.state.menuIndex;
  }

  isCurrentMenu(menuIndex)
  {
    return this.state.menuIndex === menuIndex;
  }

  onBarExpand(e)
  {
    if (this.state.open && this.state.menuIndex  >= 0)
    {
      this.setCurrentMenu(-1);
    }
    else
    {
      this.toggleBar();
    }
  }

  renderMenuButtons(children)
  {
    return React.Children.map(children, child => {
      if (child.props.containerOnly !== TOOLBAR_CONTAINER_TOOLBAR) return child;
    });
  }

  renderToolbarButtons(children)
  {
    return React.Children.map(children, child => {
      if (child.props.containerOnly !== TOOLBAR_CONTAINER_MENU) return child;
    });
  }

  //Override
  render()
  {
    const toolbarMenus = this.props.menus;
    const ToolbarMenu = this.state.menuIndex >= 0 ? toolbarMenus[this.state.menuIndex] : null;

    const hasButtons = React.Children.count(this.props.children) > 0;
    const isBarOpen = this.state.open;
    const shouldBarHide = this.props.hide || false;
    const showBarExpander = isBarOpen || (hasButtons && TOOLBAR_ALLOW_MENU_BAR);

    return (
      <div ref={ref=>this.ref=ref}
      id={this.props.id}
      className={Style.app_bar +
        (isBarOpen ? " open " : "") +
        (shouldBarHide ? " hide " : "") +
        " " + this.props.className}
      style={this.props.style}>
        <div className={Style.bar_menu}>
          {ToolbarMenu ?
            <div className={Style.menu_container}>
              <ToolbarMenu {...this.props.panelProps} toolbar={this.ref}/>
            </div> :
            <div className={Style.menu_button_container}>
              {this.renderMenuButtons(this.props.children)}
            </div>}
        </div>
        <div ref={ref=>this.toolbarElement=ref} className={Style.bar_toolbar}>
          <div className={Style.toolbar_title}>
            <h1>Untitled</h1>
          </div>
          <div className={Style.toolbar_button_container}>
            {this.renderToolbarButtons(this.props.children)}
          </div>
          {showBarExpander &&
          <IconButton className={Style.toolbar_expander} onClick={this.onBarExpand}>
            <MenuIcon/>
          </IconButton>}
        </div>
      </div>
    );
  }
}
export default ToolbarView;
