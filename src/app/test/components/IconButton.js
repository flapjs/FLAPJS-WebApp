import React from 'react';
import Style from './IconButton.css';

const ICON_BUTTON_SHOW_LABEL = false;

class IconButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const title = this.props.title;

    return (
      <button id={this.props.id}
        className={Style.icon_button +
          (ICON_BUTTON_SHOW_LABEL ? " icon-button-show-label " : "") +
          " " + this.props.className}
        style={this.props.style}
        title={title}
        disabled={this.props.disabled}
        onClick={this.props.onClick}>
        {this.props.children}
        <label>{title}</label>
      </button>
    );
  }
}
export default IconButton;
