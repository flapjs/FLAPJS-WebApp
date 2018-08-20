import React from 'react';
import './MessageContainer.css';

import ExitMessageButton from './ExitMessageButton.js';

class MessageContainer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className={"notification-message " + this.props.className}>
      <div className="notification-message-content">
        {this.props.value}
      </div>
      <div className="notification-message-response">
        {this.props.children}
        {!this.props.hideDefaultExit && <ExitMessageButton onClick={this.props.onExit}/>}
      </div>
    </div>;
  }
}

export default MessageContainer;
