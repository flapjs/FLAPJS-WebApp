import React from 'react';

import MessageContainer from './MessageContainer.js';

class DefaultErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <MessageContainer className="notification-error" value={this.props.message} onExit={this.props.onDelete}>
    </MessageContainer>;
  }
}

export default DefaultErrorMessage;
