import React from 'react';
import '../Panel.css';
import './ExportingPanel.css';

import IconButton from 'icons/IconButton.js';

class ExportingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;
  }
  
  render()
  {
    const exporters = this.props.app.getCurrentModule().getGraphExporters();

    return <div className="panel-container" id="exporting" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>{I18N.toString("component.exporting.title")}</h1>
      </div>
      <div className="panel-content">
      {
        this.props.app.getCurrentModule().getGraphExporters().map(e => {
          if (!e.doesSupportFile()) return null;
          return <IconButton key={e.getFileType()}
            className="export-button"
            id={"export-" + e.getFileType()}
            title={e.getTitle()}
            onClick={() => {
              const filename = this.props.machineController.getMachineName();
              e.exportToFile(filename, this.props.app);
            }}>
            { React.createElement(e.getIconComponentClass()) }
            <label>{ e.getLabel() }</label>
          </IconButton>;
        })
      }
        <hr/>
        {/*Save to E-mail*/}
        <div className="export-email">
        </div>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}
ExportingPanel.UNLOCALIZED_NAME = "component.exporting.title";

export default ExportingPanel;
