import React from 'react';

import './Workspace.css';

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg id="workspace-content"
      viewBox="0 0 100 10"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="5" r="10"/>
    </svg>;
  }
}

export default Workspace;
