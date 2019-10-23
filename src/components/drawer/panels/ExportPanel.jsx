import React from 'react';
import PropTypes from 'prop-types';

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
        const exportManager = this.props.exportManager;
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
        const props = this.props;

        const exportManager = props.exportManager;
        const exportTypes = exportManager.getExportTypes();
        
        return (
            <>
                <h2>Exporting</h2>
                <SessionStateConsumer>
                    {
                        session => (
                            <ul>
                                {exportTypes.map(exportType => this.renderExportOption(exportType, session))}
                            </ul>
                        )
                    }
                </SessionStateConsumer>
            </>
        );
    }
}
ExportPanel.Tab = ExportTab;
ExportPanel.propTypes = {
    exportManager: PropTypes.object.isRequired
};

export default ExportPanel;
