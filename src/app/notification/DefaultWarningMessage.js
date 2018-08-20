import React from 'react';

import MessageContainer from './MessageContainer.js';

class DefaultWarningMessage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <MessageContainer
      className="notification-warning"
      value={this.props.message}
      onExit={this.props.onExit}>
    </MessageContainer>;
  }
}

export default DefaultWarningMessage;
