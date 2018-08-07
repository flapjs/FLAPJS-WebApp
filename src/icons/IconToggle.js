import React from 'react';
import './IconToggle.css';

class IconToggle extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      open: this.props.defaultValue || false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    //Toggle state
    this.setState((prev, props) => {
      return {open: !prev.open};
    });

    //Call passed-in onClick listener
    if (this.props.onClick)
    {
      this.props.onClick(e);
    }
  }

  render()
  {
    return <button
      className={"icon-button icon-toggle " + (this.state.open ? " open " : "") + this.props.className}
      id={this.props.id}
      title={this.props.title}
      style={this.props.style}
      disabled={this.props.disabled}
      onClick={this.onClick}>
      {this.props.children}
    </button>;
  }
}

export default IconToggle;
