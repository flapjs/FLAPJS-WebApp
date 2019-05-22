import React from 'react';
import './StatusButton.css';

import IconButton from 'deprecated/icons/IconButton.js';
import SuccessIcon from 'deprecated/icons/SuccessIcon.js';
import FailureIcon from 'deprecated/icons/FailureIcon.js';
import WorkingIcon from 'deprecated/icons/WorkingIcon.js';
import RunningManIcon from 'deprecated/icons/RunningManIcon.js';

class StatusButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const active = this.props.active;
        if (this.props.mode === true)
        {
            //Success icon
            return <IconButton className={'status-icon success' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <SuccessIcon/>
            </IconButton>;
        }
        else if (this.props.mode === false)
        {
            //Failure icon
            return <IconButton className={'status-icon failure' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <FailureIcon/>
            </IconButton>;
        }
        else
        {
            //Pending icon
            return <IconButton className={'status-icon' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <RunningManIcon/>
            </IconButton>;
        }
    }
}

export default StatusButton;
