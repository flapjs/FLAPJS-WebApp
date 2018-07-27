import React from 'react';

import '../Panel.css';
import './ExportingPanel.css';
import PNGIcon from "./icon/PNGIcon";
import JPGIcon from "./icon/JPGIcon";
import JSONIcon from "./icon/JSONIcon";
import XMLIcon from "./icon/XMLIcon";

class ExportingPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="exporting">
      <div className="panel-title">
        <h1>Exporting</h1>
      </div>
      <button className="export-button">
        <JSONIcon/>
        <span className="export-text">Save As Machine File</span>
      </button>
      <button className="export-button">
        <PNGIcon/>
        <span className="export-text">Export to PNG</span>
      </button>
      <button className="export-button">
        <JPGIcon/>
        <span className="export-text">Export to JPEG</span>
      </button>
      <button className="export-button">
        <XMLIcon/>
        <span className="export-text">Export to JFLAP</span>
      </button>
    </div>;
  }
}

export default ExportingPanel;
