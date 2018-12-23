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

  renderExporterButton(exporter)
  {
    if (!exporter.doesSupportFile()) return null;
    return <IconButton key={exporter.getFileType()}
      className="export-button"
      id={"export-" + exporter.getFileType()}
      title={exporter.getTitle()}
      onClick={() => {
        const filename = this.props.machineController.getMachineName();
        exporter.exportToFile(filename, this.props.app);
      }}>
      { React.createElement(exporter.getIconComponentClass()) }
      <label>{ exporter.getLabel() }</label>
    </IconButton>;
  }

  //Override
  render()
  {
    const module = this.props.app.getCurrentModule();
    const graphExporters = module.getGraphExporters();
    const imageExporters = module.getImageExporters();

    return <div className="panel-container" id="exporting" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>{I18N.toString("component.exporting.title")}</h1>
      </div>
      <div className="panel-content">
      {
        graphExporters.map(e => this.renderExporterButton(e))
      }
      {
        imageExporters.map(e => this.renderExporterButton(e))
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
