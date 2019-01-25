import React from 'react';
import Style from '../MenuPanel.css';

import IconButton from 'experimental/components/IconButton.js';

class ExportPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  renderExporterButton(exporter)
  {
    if (!exporter.doesSupportFile()) return null;
    const IconClass = exporter.getIconClass();
    return (
      <IconButton key={exporter.getFileType()}
        className={Style.panel_button}
        title={exporter.getLabel()}
        onClick={() => {
          const currentModule = this.props.currentModule;
          const machineController = currentModule.getMachineController();
          const filename = machineController.getMachineName();
          exporter.exportToFile(filename, currentModule);
        }}>
        <IconClass/>
      </IconButton>
    );
  }

  //Override
  render()
  {
    const module = this.props.currentModule;
    const graphExporters = module.getGraphExporters();
    const imageExporters = module.getImageExporters();

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{I18N.toString("component.exporting.title")}</h1>
        </div>
        <div className={Style.panel_content}>
          {graphExporters.map(e => this.renderExporterButton(e))}
          {imageExporters.map(e => this.renderExporterButton(e))}
        </div>
      </div>
    );
  }
}

export default ExportPanel;
