import React from 'react';

import '../Panel.css';
import './OptionsPanel.css';

class OptionsPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="option">
      <div className="panel-title">
        <h1>Option</h1>
      </div>
      <div className="panel-content">
        <button className="panel-button">Change Theme...</button>
        <div>
          <input type="checkbox"/>
          <label>Auto-label states</label>
        </div>
        <div>
          HotKeys!!!!
        </div>
      </div>
    </div>;
  }
}

export default OptionsPanel;
