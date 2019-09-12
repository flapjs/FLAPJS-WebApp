import React from 'react';
import '../Panel.css';
import './ExportingPanel.css';

import IconButton from 'deprecated/icons/IconButton.js';

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
        const module = this.props.currentModule;
        const machineController = module.getMachineController();
        const filename = machineController.getMachineName() || "Untitled";
        exporter.exportToFile(filename, module);
      }}>
      { React.createElement(exporter.getIconClass()) }
      <label>{ exporter.getLabel() }</label>
    </IconButton>;
  }

  /** @override */
  render()
  {
    const module = this.props.currentModule;
    const graphController = module.getGraphController();
    const graphExporters = graphController.getGraphExporters();
    const imageExporters = graphController.getImageExporters();

    return <div className={"panel-container " + this.props.className} id="exporting" ref={ref=>this.container=ref} style={this.props.style}>
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
Object.defineProperty(ExportingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.exporting.title"); }
});
ExportingPanel.UNLOCALIZED_NAME = "component.exporting.title";

export default ExportingPanel;
