import React from 'react';

import MessageContainer from 'notification/MessageContainer.js';

class StateUnreachableWarningMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = "";
    for(const target of this.props.message)
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
      //Locate the target node
      const target = this.props.message[this.targetIndex++];
      if (this.targetIndex >= this.props.message.length)
      {
        this.targetIndex = 0;
      }

      //Move pointer to target
      notification.props.controller.focusOnNode(target);
    }
    else if (target.value == "deleteall")
    {
      const notification = this.props.notification;
      //Delete all target nodes
      for(const node of this.props.message)
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
      className="notification-warning"
      value={I18N.toString("message.warning.unreachable") + ": " + this.targetLabel}
      onExit={this.props.onExit}>
      <button value="locate" onClick={this.onClick}>{I18N.toString("message.action.locate")}</button>
      <button value="deleteall" onClick={this.onClick}>{I18N.toString("message.action.deleteall")}</button>
    </MessageContainer>;
  }
}
export default StateUnreachableWarningMessage;
