import React from 'react';
import Style from './ToolbarView.css';

import AbstractToolbarButton from './AbstractToolbarButton.js';

import IconButton from '../components/IconButton.js';
import MenuIcon from '../iconset/MenuIcon.js';

const TOOLBAR_BUTTON_BUFFER = 150;

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

  //Override
  render()
  {
    const onButtonClick = this.props.onButtonClick;

    const buttons = this.props.buttons;
    const isBarOpen = this.state.open;

    let maxButtonCount = Infinity;
    if (this.toolbarElement)
    {
      //TODO: Possibly inefficient, depends on what getBoundingClientRect does.
      const boundingRect = this.toolbarElement.getBoundingClientRect();
      const elementSize = boundingRect.width;
      maxButtonCount = elementSize / TOOLBAR_BUTTON_BUFFER;
    }

    return (
      <div ref={ref=>this.ref=ref}
      id={this.props.id}
      className={Style.app_bar +
        (isBarOpen ? " open " : "") +
        " " + this.props.className}
      style={this.props.style}>
        <div className={Style.bar_menu}>
        {buttons && buttons.map((e, i) => {
          const title = e.getTitle();
          const IconClass = e.getIconClass();
          return (
            <IconButton key={title + ":" + i} className={Style.menu_button}
              value={e}
              onClick={onButtonClick}>
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
            if (i >= maxButtonCount) return null;
            const title = e.getTitle();
            const IconClass = e.getIconClass();
            return (
              <IconButton key={title + ":" + i} className={Style.toolbar_button}
                title={title}
                value={e}
                onClick={onButtonClick}>
                <IconClass/>
              </IconButton>
            );
          })}
          </div>
          <IconButton className={Style.toolbar_expander} onClick={this.onBarExpand}>
            <MenuIcon/>
          </IconButton>
        </div>
      </div>
    );
  }
}
export default ToolbarView;
