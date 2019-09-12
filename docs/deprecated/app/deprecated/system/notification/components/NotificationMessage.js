import React from 'react';
import './NotificationMessage.css';

class NotificationMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onExitMessage = this.onExitMessage.bind(this);
  }

  onExitMessage(e)
  {
    const message = this.props.value;
    message.close();
  }

  /** @override */
  render()
  {
    const message = this.props.value;
    return <div className={"notification-message-container notification-message-type-" + message.getType() + " " + this.props.className}
      id={this.props.id} style={this.props.style}>
      { this.props.children || message.value.split("\\n").map(e => <p key={e}>{e}</p>) || message }
      <button onClick={this.onExitMessage}>{I18N.toString("message.action.close")}</button>
    </div>;
  }
}
export default NotificationMessage;
