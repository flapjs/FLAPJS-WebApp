import React from 'react';

import './Panel.css';

class TestingPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="testing">
      <h1>Testing</h1>
      <hr />
      <h2>Buttons</h2>
    </div>;
  }
}

export default TestingPanel;
