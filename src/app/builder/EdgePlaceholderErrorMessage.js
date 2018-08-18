import React from 'react';
import MessageContainer from 'pages/content/notification/MessageContainer.js';

class EdgePlaceholderErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <MessageContainer className="notification-error"
      value={this.props.message}>
    </MessageContainer>;
  }
}
export default EdgePlaceholderErrorMessage;
