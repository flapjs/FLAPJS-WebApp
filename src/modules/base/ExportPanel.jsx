import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';
import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';
import { DownloadIcon } from '@flapjs/components/icons/Icons.js';

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
                                {session.exportManager && session.exportManager.getExportTypes().map(exportType => this.renderExportOption(exportType, session))}
                            </ul>
                        )
                    }
                </SessionStateConsumer>
            </>
        );
    }
}
ExportPanel.Tab = Tab;

function Tab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton
            onClick={onClick}
            iconClass={DownloadIcon}
            {...otherProps}/>
    );
}
Tab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default ExportPanel;
