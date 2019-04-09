import React from 'react';

class PauseIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg className="pause-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>;
  }
}

export default PauseIcon;
