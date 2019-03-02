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
        onClick={() => this.props.session.getApp().getExportManager().tryExportToFile(exporter)}>
        <IconClass/>
      </IconButton>
    );
  }

  //Override
  render()
  {
    const session = this.props.session;
    const exportManager = session.getApp().getExportManager();
    const exporters = exportManager.getExporters();

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{I18N.toString("component.exporting.title")}</h1>
        </div>
        <div className={Style.panel_content}>
          {exporters.map(e => this.renderExporterButton(e))}
        </div>
      </div>
    );
  }
}

export default ExportPanel;
