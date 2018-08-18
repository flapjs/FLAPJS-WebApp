import React from 'react';
import { UNREACHABLE_STATE } from 'lang.js';

import MessageContainer from 'notification/MessageContainer.js';

class StateUnreachableWarningMessage extends React.Component
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
      className="notification-warning"
      value={UNREACHABLE_STATE}
      onExit={this.props.onExit}>
      <button onClick={this.onClick}>Remove Edge</button>
    </MessageContainer>;
  }
}
export default StateUnreachableWarningMessage;
