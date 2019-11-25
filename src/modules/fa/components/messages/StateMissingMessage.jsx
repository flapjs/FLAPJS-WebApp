import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '@flapjs/services/notification/components/messages/ErrorMessage.jsx';

class StateMissingMessage extends React.Component
{
    constructor(props)
    {
        super(props);

        // TODO: check to see if these variables are used elsewhere; otherwise make it private
        this.targetIndex = 0;
        this.targetLabel = '';
        // TODO: clarify what target is, specify type
        const targets = props.content.targets;
        for (const target of targets)
        {
            if (this.targetLabel.length > 0)
            {
                this.targetLabel += ', ';
            }
            this.targetLabel += target.getNodeLabel();
        }
        // TODO: fix "for" - not language compatible
        this.targetLabel += ' for ' + props.content.symbol;

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        const props = this.props;
        // const notification = this.props.notification;
        const message = props.content;
        // const session = props.session;
        
        switch (e.target.value)
        {
            case 'locate':
                {
                    const targets = message.targets;
                    const targetLength = targets.length;
                    if (targetLength > 0 && this.targetIndex < targetLength)
                    {
                        //Locate the target edge
                        // const target = targets[this.targetIndex++];
                        // if (this.targetIndex >= targetLength) this.targetIndex = 0;

                        //Move pointer to target
                        // const graphView = sesion.module.getGraphView();
                        // graphView.moveViewToPosition(target.x, target.y);
                    }
                }
                break;
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        return (
            <ErrorMessage
                notification={props.notification}
                onClose={props.onClose}>
                <p>
                    {'message.error.missing' + ': ' + this.targetLabel}
                </p>
                <button value="locate" onClick={this.onClick}>
                    {'message.action.locate'}
                </button>
            </ErrorMessage>
        );
    }
}
StateMissingMessage.propTypes = {
    notification: PropTypes.object.isRequired,
    content: PropTypes.shape({
        targets: PropTypes.arrayOf(PropTypes.object),
        symbol: PropTypes.string
    }),
    onClose: PropTypes.func,
};

export default StateMissingMessage;
