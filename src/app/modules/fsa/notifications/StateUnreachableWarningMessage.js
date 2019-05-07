import React from 'react';

class StateUnreachableWarningMessage extends React.Component
{
    constructor(props)
    {
        super(props);

        this.targetIndex = 0;
        this.targetLabel = '';
        const targets = props.message.value;
        for(const target of targets)
        {
            if (this.targetLabel.length > 0)
            {
                this.targetLabel += ', ';
            }
            this.targetLabel += target.getNodeLabel();
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        const graphController = this.props.graphController;
        // const machineController = this.props.machineController;
        const buttonValue = e.target.value;
        const message = this.props.message;
        switch(buttonValue)
        {
        case 'locate':
            {
                //Locate the target node
                const target = message.value[this.targetIndex++];
                if (this.targetIndex >= message.value.length)
                {
                    this.targetIndex = 0;
                }

                //Move pointer to target
                graphController.focusOnNode(target);
            }
            break;
        case 'deleteall':
            {
                const targets = message.value;
                //Delete all target nodes
                graphController.deleteTargetNodes(targets);

                //Sort the nodes after deleting if enabled...
                graphController.applyAutoRename();

                //Exit the message
                message.close();
            }
            break;
        default:
            throw new Error('Unknown button value for message');
        }
    }

    /** @override */
    render()
    {
        return <div>
            <p>{I18N.toString('message.warning.unreachable') + ': ' + this.targetLabel}</p>
            <button value="locate" onClick={this.onClick}>{I18N.toString('message.action.locate')}</button>
            <button value="deleteall" onClick={this.onClick}>{I18N.toString('message.action.deleteall')}</button>
        </div>;
    }
}

export default StateUnreachableWarningMessage;
