import React from 'react';
import Notifications from 'deprecated/system/notification/Notifications.js';

class HelpButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    if (Notifications.hasMessages())
    {
      Notifications.addMessage(I18N.toString("message.help.3"));
      Notifications.addMessage(I18N.toString("message.help.1"));
    }
    else
    {
      Notifications.addMessage(I18N.toString("message.help.2"));
    }

    //The tutorial
    const LINK = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md";
    const newTab = window.open(LINK, '_blank');

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

export default HelpButton;
