import React from 'react';

class StopIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg className="stop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 6h12v12H6z"/>
    </svg>;
  }
}

export default StopIcon;
