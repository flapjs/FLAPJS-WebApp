import React from 'react';
import Style from './ToolbarView.css';

import AbstractToolbarButton from './AbstractToolbarButton.js';

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
      open: false
    };

    this.onBarExpand = this.onBarExpand.bind(this);
    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
    this.onToolbarButtonClick = this.onToolbarButtonClick.bind(this);
  }

  openBar(callback=null)
  {
    if (!this.state.open)
    {
      this.setState({ open: true }, callback);
    }
  }

  closeBar(callback=null)
  {
    if (this.state.open)
    {
      this.setState({ open: false }, callback);
    }
  }

  toggleBar(callback=null)
  {
    this.setState((prev, props) => {
      return { open: !prev.open };
    }, callback);
  }

  isBarOpen()
  {
    return this.state.open;
  }

  onBarExpand(e)
  {
    this.toggleBar();
  }

  onMenuButtonClick(e, target)
  {
    this.closeBar();
    target.onClick(e);
  }

  onToolbarButtonClick(e, target)
  {
    target.onClick(e);
  }

  //Override
  render()
  {
    /*
    let maxButtonCount = Infinity;
    if (this.toolbarElement)
    {
      //TODO: Possibly inefficient, depends on what getBoundingClientRect does.
      const boundingRect = this.toolbarElement.getBoundingClientRect();
      const elementSize = boundingRect.width;
      maxButtonCount = elementSize / TOOLBAR_BUTTON_BUFFER;
    }
    */

    const buttons = this.props.buttons;
    const isBarOpen = this.state.open;
    const shouldBarHide = this.props.hide || false;
    const showBarExpander = isBarOpen || (buttons && TOOLBAR_ALLOW_MENU_BAR);

    return (
      <div ref={ref=>this.ref=ref}
      id={this.props.id}
      className={Style.app_bar +
        (isBarOpen ? " open " : "") +
        (shouldBarHide ? " hide " : "") +
        " " + this.props.className}
      style={this.props.style}>
        <div className={Style.bar_menu}>
        {buttons && buttons.map((e, i) => {
          if (!e.showInMenu()) return null;
          const title = e.getTitle();
          const IconClass = e.getIconClass();
          return (
            <IconButton key={title + ":" + i} className={Style.menu_button}
              onClick={ev => this.onMenuButtonClick(ev, e)}>
              <IconClass/>
              <label>{title}</label>
            </IconButton>
          );
        })}
        </div>
        <div ref={ref=>this.toolbarElement=ref} className={Style.bar_toolbar}>
          <div className={Style.toolbar_title}>
            <h1>Untitled</h1>
          </div>
          <div className={Style.toolbar_button_container}>
          {buttons && buttons.map((e, i) => {
            if (!e.showInToolbar()) return null;
            const title = e.getTitle();
            const IconClass = e.getIconClass();
            return (
              <IconButton key={title + ":" + i} className={Style.toolbar_button}
                title={title}
                onClick={ev => this.onToolbarButtonClick(ev, e)}>
                <IconClass/>
              </IconButton>
            );
          })}
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
