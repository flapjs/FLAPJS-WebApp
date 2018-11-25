import React from 'react';

class StateErrorMessage extends React.Component
{
  constructor(props)
  {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = "";
    const targets = props.message.value.targets;
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
    const graphController = this.props.graphController;
    const machineController = this.props.machineController;
    const buttonValue = e.target.value;
    const message = this.props.message;
    switch(buttonValue)
    {
      case "locate":
      {
        const targets = message.value.targets;
        const targetLength = targets.length;
        if (targetLength > 0 && this.targetIndex < targetLength)
        {
          //Locate the target edge
          const target = targets[this.targetIndex++];
          if (this.targetIndex >= targetLength) this.targetIndex = 0;

          //Move pointer to target
          graphController.focusOnNode(target);
        }
      }
      break;
      case "deleteall":
      {
        const targets = message.value.targets;
        //Delete all target nodes
        for(const node of targets)
        {
          graphController.getGraph().deleteNode(node);
        }

        //Sort the nodes after deleting if enabled...
        machineController.getMachineBuilder().labeler.sortDefaultNodeLabels();

        //Exit the message
        message.close();
      }
      break;
      default:
        throw new Error("Unknown button value for message");
    }
  }

  //Override
  render()
  {
    const message = this.props.message;
    return <div>
      <p>{message.value.text + ": " + this.targetLabel}</p>
      <button value="locate" onClick={this.onClick}>{I18N.toString("message.action.locate")}</button>
      <button value="deleteall" onClick={this.onClick}>{I18N.toString("message.action.deleteall")}</button>
    </div>;
  }
}

export default StateErrorMessage;
