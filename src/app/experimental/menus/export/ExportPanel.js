import React from 'react';
import Style from '../MenuPanel.css';

import SessionExporter from 'session/SessionExporter.js';
import IconButton from 'experimental/components/IconButton.js';

class ExportPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    renderExporterButton(exportType)
    {
        const exporter = this.props.session.getApp().getExportManager().getExporterByExportType(exportType);
        if (!(exporter instanceof SessionExporter)) return <span></span>;

        const IconClass = exporter.getIconClass();

        return (
            <IconButton key={exporter.getLabel() + ':' + exportType}
                className={Style.panel_button}
                title={exporter.getLabel()}
                onClick={() => this.props.session.getApp().getExportManager().tryExportFile(exportType, this.props.session)}>
                {IconClass && <IconClass/>}
            </IconButton>
        );
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const exportManager = session.getApp().getExportManager();
        const exportTypes = exportManager.getExportTypes();

        return (
            <div id={this.props.id}
                className={Style.panel_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <div className={Style.panel_title}>
                    <h1>{I18N.toString('component.exporting.title')}</h1>
                </div>
                <div className={Style.panel_content}>
                    {exportTypes.map(e => this.renderExporterButton(e))}
                </div>
            </div>
        );
    }
}

export default ExportPanel;
