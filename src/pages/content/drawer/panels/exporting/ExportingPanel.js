import React from 'react';

import '../Panel.css';
import './ExportingPanel.css';

class ExportingPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="exporting">
      <h1>Exporting</h1>
      <hr />
      <input className="panel-button" defaultValue="MachineName"/>

      <button className="panel-button">Save As Machine File</button>
      <button className="panel-button">Export to PNG</button>
      <button className="panel-button">Export to JPEG</button>
      <button className="panel-button">Export to JFLAP</button>
    </div>;
  }
}

export default ExportingPanel;
