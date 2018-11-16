import React from 'react';

import MessageContainer from 'notification/MessageContainer.js';

class StateMissingTransitionErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = "";
    const targets = this.props.message;
    for(const target of targets)
    {
      if (this.targetLabel.length > 0)
      {
        this.targetLabel += ", ";
      }
      this.targetLabel += target.label;
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const target = e.target;
    if (target.value == "locate")
    {
      const notification = this.props.notification;
      const targets = this.props.message;
      const targetLength = targets.length;
      if (targetLength > 0 && this.targetIndex < targetLength)
      {
        //Locate the target edge
        const target = targets[this.targetIndex++];
        if (this.targetIndex >= targetLength) this.targetIndex = 0;

        //Move pointer to target
        notification.getGraphController().focusOnNode(target);
      }
    }
    else
    {
      throw new Error("Unknown button value");
    }
  }

  render()
  {
    return <MessageContainer
      className="notification-error"
      value={I18N.toString("message.error.missing") + ": " + this.targetLabel}
      onExit={this.props.onExit}>
      <button value="locate" onClick={this.onClick}>{I18N.toString("message.action.locate")}</button>
    </MessageContainer>;
  }
}
export default StateMissingTransitionErrorMessage;
