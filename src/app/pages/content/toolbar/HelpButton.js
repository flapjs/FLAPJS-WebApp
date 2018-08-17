import React from 'react';

import GraphUploader from 'graph/GraphUploader.js';

const FILETYPE_JSON = "application/json";
const FILETYPE_JFLAP = ".jff";

class UploadButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const notification = this.props.notification;
    if (notification.hasMessages())
    {
      notification.addMessage("You need help. Unfortunately, I am not qualified to provide such assistance. Please refer to your local tutor/developer for more information.");
      notification.addMessage("Thank you for being awesome :3");
    }
    else
    {
      notification.addMessage("I see you want help. I'm not sure I want to help you after you so rudely got rid of all my other messages.");
    }

    if (this.props.onClick)
    {
      this.props.onClick(e);
    }
  }

  render()
  {
    return <button
      className={"icon-button button-help " + this.props.className}
      id={this.props.id}
      title={this.props.title}
      style={this.props.style}
      disabled={this.props.disabled}
      onClick={this.onClick}>
      {this.props.children}
    </button>;
  }
}

export default UploadButton;
