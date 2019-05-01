import React from 'react';
import DefaultNotificationLayout, {STYLE_TYPE_ERROR} from 'session/manager/notification/components/DefaultNotificationLayout.js';

class StateMissingTransitionNotificationLayout extends React.Component
{
  constructor(props)
  {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = "";
    const targets = props.message.targets;
    for(const target of targets)
    {
      if (this.targetLabel.length > 0)
      {
        this.targetLabel += ", ";
      }
      this.targetLabel += target.getNodeLabel();
    }
    this.targetLabel += " for " + props.message.symbol;

    this.onClick = this.onClick.bind(this);
  }

  onClick(e)
  {
    const notification = this.props.notification;
    const message = this.props.message;
    const graphController = this.props.graphController;

    switch(e.target.value)
    {
      case "locate":
      {
        const targets = message.targets;
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
    }
  }

  /** @override */
  render()
  {
    return (
      <DefaultNotificationLayout id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        styleType={STYLE_TYPE_ERROR}
        notification={this.props.notification}>
        <p>{I18N.toString("message.error.missing") + ": " + this.targetLabel}</p>
        <button value="locate" onClick={this.onClick}>
          {I18N.toString("message.action.locate")}
        </button>
      </DefaultNotificationLayout>
    );
  }
}

export default StateMissingTransitionNotificationLayout;
