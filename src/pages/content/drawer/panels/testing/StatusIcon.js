import React from 'react';

import IconButton from 'icons/IconButton.js';
import SuccessIcon from 'icons/SuccessIcon.js';
import FailureIcon from 'icons/FailureIcon.js';
import WorkingIcon from 'icons/WorkingIcon.js';

const ACTIVE_PENDING_COLOR = "white";
const ACTIVE_SUCCESS_COLOR = "lime";
const ACTIVE_FAILURE_COLOR = "red";
const INACTIVE_COLOR = "gray";

class StatusIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const active = this.props.active;
    if (this.props.mode > 0)
    {
      //Success icon
      return <IconButton className="status-icon"
        style={{fill: active ? ACTIVE_SUCCESS_COLOR : INACTIVE_COLOR}}
        onClick={this.props.onClick}>
        <SuccessIcon/>
      </IconButton>;
    }
    else if (this.props.mode < 0)
    {
      //Failure icon
      return <IconButton className="status-icon"
        style={{fill: active ? ACTIVE_FAILURE_COLOR : INACTIVE_COLOR}}
        onClick={this.props.onClick}>
        <FailureIcon/>
      </IconButton>;
    }
    else
    {
      //Pending icon
      return <IconButton className="status-icon"
        style={{fill: active ? ACTIVE_PENDING_COLOR : INACTIVE_COLOR}}
        onClick={this.props.onClick}>
        <WorkingIcon/>
      </IconButton>;
    }
  }
}

export default StatusIcon;
