import React from 'react';
import DefaultNotificationLayout, { STYLE_TYPE_ERROR }
    from 'session/manager/notification/components/DefaultNotificationLayout.js';

/**
 * A class representing the layout for a notification referring to states
 */
class StateNotificationLayout extends React.Component
{
    constructor(props)
    {
        super(props);

        this._targetIndex = 0;
        this._targetLabel = '';
        const targets = props.message.targets;
        for (const target of targets)
        {
            if (this._targetLabel.length > 0)
            {
                this._targetLabel += ', ';
            }
            // TODO: make a helper function for this type of constructor
            this._targetLabel += target.getNodeLabel();
        }

        this.onClick = this.onClick.bind(this);
    }

    /**
     * Handles onclick events for the buttons
     * 
     * @param {Event} e the input event
     */
    onClick(e)
    {
        const notification = this.props.notification;
        const message = this.props.message;
        const app = this.props.app;

        const graphController = this.props.graphController;

        switch (e.target.value)
        {
        // Cycle through all of the targets and center the viewport on it
        case 'locate':
            {
                const targets = message.targets;
                const targetLength = targets.length;
                if (targetLength > 0 && this._targetIndex < targetLength)
                {
                    // Locate the target edge
                    const target = targets[this._targetIndex++];
                    if (this._targetIndex >= targetLength) this._targetIndex = 0;

                    // Move pointer to target
                    const graphView = app.getSession().getCurrentModule().getGraphView();
                    graphView.moveViewToPosition(target.x, target.y);
                }
            }
            break;
            // Delete all targets
        case 'deleteall':
            {
                const targets = message.targets;
                // Delete all target nodes
                graphController.deleteTargetNodes(targets);

                // Sort the nodes after deleting if enabled...
                graphController.applyAutoRename();

                // Exit the message
                notification.close();
            }
            break;
        }
    }

    /** @override */
    render()
    {
        const message = this.props.message;

        // TODO: localization issues
        return (
            <DefaultNotificationLayout id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                styleType={STYLE_TYPE_ERROR}
                notification={this.props.notification}>
                <p>{message.text + ': ' + this._targetLabel}</p>
                <button value="locate" onClick={this.onClick}>
                    {I18N.toString('message.action.locate')}
                </button>
                <button value="deleteall" onClick={this.onClick}>
                    {I18N.toString('message.action.deleteall')}
                </button>
            </DefaultNotificationLayout>
        );
    }
}

export default StateNotificationLayout;
