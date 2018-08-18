import React from 'react';
import { INCOMPLETE_TRANSITION } from 'lang.js';

import MessageContainer from 'notification/MessageContainer.js';

class TransitionPlaceholderErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const target = this.props.target;
  }

  render()
  {
    return <MessageContainer
      className="notification-error"
      value={INCOMPLETE_TRANSITION}
      onExit={this.props.onExit}>
      <button onClick={this.onClick}>Change to NFA</button>
      <button onClick={this.onClick}>Remove Edge</button>
    </MessageContainer>;
  }
}
export default TransitionPlaceholderErrorMessage;
