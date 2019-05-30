import React from 'react';
import GraphNode from 'deprecated/graph/elements/GraphNode.js';

import { ARROW } from 'deprecated/fsa/machine/Symbols.js';

class TransitionErrorMessage extends React.Component
{
    constructor(props)
    {
        super(props);

        this.targetIndex = 0;
        this.targetLabel = '';
        const targets = props.message.value.targets;
        for(const target of targets)
        {
            if (this.targetLabel.length > 0)
            {
                this.targetLabel += ', ';
            }
            this.targetLabel += '(' + target.getEdgeFrom().getNodeLabel() + ', ' +
        target.getEdgeLabel() + ') ' +
        ARROW + ' ' + (target.getEdgeTo() instanceof GraphNode ? target.getEdgeTo().getNodeLabel() : 'null');
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
                const targets = message.value.targets;
                const targetLength = targets.length;
                if (targetLength > 0 && this.targetIndex < targetLength)
                {
                    //Locate the target edge
                    const target = targets[this.targetIndex++];
                    if (this.targetIndex >= targetLength) this.targetIndex = 0;

                    //Move pointer to target
                    graphController.focusOnEdge(target);
                }
            }
            break;
        case 'deleteall':
            {
                const targets = message.value.targets;
                //Delete all target edges
                graphController.deleteTargetEdges(targets);

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
            <p>{this.props.message.value.text + ': ' + this.targetLabel}</p>
            <button value="locate" onClick={this.onClick}>{I18N.toString('message.action.locate')}</button>
            <button value="deleteall" onClick={this.onClick}>{I18N.toString('message.action.deleteall')}</button>
        </div>;
    }
}

export default TransitionErrorMessage;
