import React from 'react';

import MessageContainer from 'notification/MessageContainer.js';

class SuccessMessage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <MessageContainer
      className="notification-success"
      value={this.props.message}
      onExit={this.props.onExit}>
    </MessageContainer>;
  }
}
export default SuccessMessage;
