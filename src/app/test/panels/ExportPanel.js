import React from 'react';
import Style from './ExportPanel.css';

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
      <button className={Style.exporter_button}
        title={exporter.getTitle()}
        onClick={() => {
          const machineController = this.props.currentModule.getMachineController();
          const filename = machineController.getMachineName();
          exporter.exportToFile(filename, currentModule);
        }}>
        <IconClass/>
        <label>{exporter.getLabel()}</label>
      </button>
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
          <h1>{ExportPanel.TITLE}</h1>
        </div>
        <div className={Style.panel_content}>
          {graphExporters.map(e => this.renderExporterButton(e))}
          {imageExporters.map(e => this.renderExporterButton(e))}
        </div>
      </div>
    );
  }
}
Object.defineProperty(ExportPanel, 'TITLE', {
  get: function() { return I18N.toString("component.exporting.title"); }
});

export default ExportPanel;
