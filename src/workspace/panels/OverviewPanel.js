import React from 'react';

import './Panel.css';

class OverviewPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="overview">
      <h1>Overview</h1>
      <hr />
      <h2>Buttons</h2>
    </div>;
  }
}

export default OverviewPanel;
