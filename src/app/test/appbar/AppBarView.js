import React from 'react';
import Style from './AppBarView.css';

import Icon from 'test/Icon.js';

const TOOLBAR_BUTTON_BUFFER = 200;

class AppBarView extends React.Component
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
          return (
            <button key={e + ":" + i} className={Style.menu_button}
              value={e}
              onClick={onButtonClick}>
              {e}
            </button>
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
            return (
              <button key={e + ":" + i} className={Style.toolbar_button}
                value={e}
                onClick={onButtonClick}>
                {e}
              </button>
            );
          })}
          </div>
          <button className={Style.toolbar_expander} onClick={this.onBarExpand}>
            <Icon/>
          </button>
        </div>
      </div>
    );
  }
}
export default AppBarView;
