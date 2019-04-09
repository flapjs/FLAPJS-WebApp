import React from 'react';
import './IconButton.css';

class IconButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button
      className={"icon-button " + this.props.className}
      id={this.props.id}
      title={this.props.title}
      style={this.props.style}
      disabled={this.props.disabled}
      onClick={this.props.onClick}>
      {this.props.children}
    </button>;
  }
}

export default IconButton;
