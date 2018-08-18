import React from 'react';

import MessageContainer from './MessageContainer.js';

class DefaultMessage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <MessageContainer
      value={this.props.message}
      onExit={this.props.onExit}>
    </MessageContainer>;
  }
}

export default DefaultMessage;
