import React from 'react';
import Style from './ToolbarButton.css';

class ToolbarButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <button className={Style.container}>
        {this.props.open ?
          <label>{this.props.title}</label> :
          React.createElement(this.props.iconClass, {className: Style.icon})}
      </button>
    );
  }
}

export default ToolbarButton;
