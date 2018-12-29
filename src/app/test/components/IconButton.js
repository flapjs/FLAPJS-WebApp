import React from 'react';
import './IconButton.css';

class IconButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <button id={this.props.id}
        className={"icon-button " + this.props.className}
        style={this.props.style}
        title={this.props.title}
        disabled={this.props.disabled}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}
export default IconButton;
