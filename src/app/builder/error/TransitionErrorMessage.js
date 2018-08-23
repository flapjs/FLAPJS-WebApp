import React from 'react';

import MessageContainer from 'notification/MessageContainer.js';

import { ARROW } from 'machine/Symbols.js';

class TransitionErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = "";
    const targets = this.props.message.targets;
    for(const target of targets)
    {
      if (this.targetLabel.length > 0)
      {
        this.targetLabel += ", ";
      }
      this.targetLabel += "(" + target.from.label + ", " + target.to.label + ") " + ARROW + " " + target.label;
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const target = e.target;
    if (target.value == "locate")
    {
      const notification = this.props.notification;
      const targets = this.props.message.targets;
      const targetLength = targets.length;
      if (targetLength > 0 && this.targetIndex < targetLength)
      {
        //Locate the target edge
        const target = targets[this.targetIndex++];
        if (this.targetIndex >= targetLength) this.targetIndex = 0;

        //Move pointer to target
        notification.props.controller.focusOnEdge(target);
      }
    }
    else if (target.value == "deleteall")
    {
      const notification = this.props.notification;
      const targets = this.props.message.targets;
      //Delete all target edges
      for(const edge of targets)
      {
        notification.props.graph.deleteEdge(edge);
      }
      //Exit the message
      this.props.onExit(e);
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
      value={this.props.message.text + ": " + this.targetLabel}
      onExit={this.props.onExit}>
      <button value="locate" onClick={this.onClick}>{I18N.toString("message.action.locate")}</button>
      <button value="deleteall" onClick={this.onClick}>{I18N.toString("message.action.deleteall")}</button>
    </MessageContainer>;
  }
}
export default TransitionErrorMessage;
