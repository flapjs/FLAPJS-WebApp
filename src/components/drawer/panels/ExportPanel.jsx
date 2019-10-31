import React from 'react';

import ExportTab from './ExportTab.jsx';
import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

import SessionExporter from '@flapjs/modules/base/SessionExporter.js';

class ExportPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    renderExportOption(exportType, session)
    {
        const exportManager = session.exportManager;
        const exporter = exportManager.getExporterByExportType(exportType);
        if (!(exporter instanceof SessionExporter)) return null;

        return (
            <li key={exporter.getLabel() + ':' + exportType}>
                <IconButton
                    title={exporter.getLabel()}
                    onClick={() => exportManager.tryExportFile(exportType, session)}
                    iconClass={exporter.getIconClass()}/>
            </li>
        );
    }

    /** @override */
    render()
    {
        return (
            <>
                <h2>Exporting</h2>
                <SessionStateConsumer>
                    {
                        session => (
                            <ul>
                                {session.exportManager.getExportTypes().map(exportType => this.renderExportOption(exportType, session))}
                            </ul>
                        )
                    }
                </SessionStateConsumer>
            </>
        );
    }
}
ExportPanel.Tab = ExportTab;

export default ExportPanel;
