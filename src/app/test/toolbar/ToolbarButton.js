import React from 'react';

import IconButton from 'test/components/IconButton.js';

export const TOOLBAR_CONTAINER_MENU = "menu";
export const TOOLBAR_CONTAINER_TOOLBAR = "toolbar";
export const TOOLBAR_CONTAINER_ALL = "all";

class ToolbarButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const IconClass = this.props.icon;
    const title = this.props.title;
    return (
      <IconButton id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={title}
        onClick={this.props.onClick}>
        {IconClass && <IconClass/>}
        <label>{title}</label>
      </IconButton>
    );
  }
}

export default ToolbarButton;
