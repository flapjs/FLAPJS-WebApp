import React from 'react';

import MessageContainer from 'notification/MessageContainer.js';

class StateErrorMessage extends React.Component
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
      const targets = this.props.message.targets;
      const targetLength = targets.length;
      if (targetLength > 0 && this.targetIndex < targetLength)
      {
        //Locate the target edge
        const target = targets[this.targetIndex++];
        if (this.targetIndex >= targetLength) this.targetIndex = 0;

        //Move pointer to target
        notification.props.controller.focusOnNode(target);
      }
    }
    else if (target.value == "deleteall")
    {
      const notification = this.props.notification;
      const targets = this.props.message.targets;
      //Delete all target nodes
      for(const node of targets)
      {
        notification.props.graph.deleteNode(node);
      }

      //Sort the nodes after deleting if enabled...
      notification.props.machineBuilder.labeler.sortDefaultNodeLabels();

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
      <button value="locate" onClick={this.onClick}>Where is it?</button>
      <button value="deleteall" onClick={this.onClick}>Delete them all.</button>
    </MessageContainer>;
  }
}
export default StateErrorMessage;
