import React from 'react';
import Style from './IconButton.css';

class IconButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  /** @override */
  render()
  {
    const title = this.props.title;
    const showButtonLabel = IconButton.SHOW_LABEL && title;

    return (
      <button id={this.props.id}
        className={Style.icon_button +
          (showButtonLabel ? " hint " : "") +
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
IconButton.SHOW_LABEL = false;

export default IconButton;
