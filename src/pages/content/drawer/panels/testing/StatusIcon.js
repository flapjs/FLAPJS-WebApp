import React from 'react';

const ACTIVE_PENDING_COLOR = "white";
const ACTIVE_SUCCESS_COLOR = "lime";
const ACTIVE_FAILURE_COLOR = "red";
const INACTIVE_COLOR = "gray";

class PendingIcon extends React.Component
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
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/>
        <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
          fill={active ? ACTIVE_SUCCESS_COLOR : INACTIVE_COLOR}/>
      </svg>;
    }
    else if (this.props.mode < 0)
    {
      //Failure icon
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          fill={active ? ACTIVE_FAILURE_COLOR : INACTIVE_COLOR}/>
      </svg>;
    }
    else
    {
      //Pending icon
      return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
          fill={active ? ACTIVE_PENDING_COLOR : INACTIVE_COLOR}/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>;
    }
  }
}

export default PendingIcon;
