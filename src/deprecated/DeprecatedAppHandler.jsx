import React from 'react';

import NotificationManager from '@flapjs/deprecated/notification/NotificationManager.js';
import * as DefaultNotifications from '@flapjs/deprecated/notification/DefaultNotifications.jsx';
import NotificationView from '@flapjs/deprecated/notification/components/NotificationView.jsx';
import { NotificationConsumer } from '@flapjs/deprecated/notification/NotificationContext.jsx';
import ExportManager from '@flapjs/systems/file/export/ExportManager.js';
import ImportManager from '@flapjs/systems/file/import/ImportManager.js';
import ExportPanel from '@flapjs/components/drawer/panels/ExportPanel.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

export function initialize(session)
{
    const currentModule = session.module;

    session.notificationManager = new NotificationManager();
    session.importManager = new ImportManager();
    session.exportManager = new ExportManager();

    if (currentModule)
    {
        if (Array.isArray(currentModule.imports))
        {
            for(const importer of currentModule.imports)
            {
                session.importManager.addImporter(importer, ...importer.getFileTypes());
            } 
        }

        if (typeof currentModule.exports === 'object')
        {
            for(const exportType of Object.keys(currentModule.exports))
            {
                session.exportManager.registerExporter(currentModule.exports[exportType], exportType);
            }
        }
    }
}

export function componentDidMount(session)
{
    session.notificationManager.pushNotification('Welcome to Flap.js!');

    DefaultNotifications.initialize(session.notificationManager);
}

export function componentWillUnmount(session)
{
    session.exportManager.clear();
    session.importManager.clear();
    DefaultNotifications.terminate(session.notificationManager);
}

export function renderAppBar()
{
    return (
        <SessionStateConsumer>
            {
                session => (
                    <>
                    <button onClick={() => session.undoManager.undo()}>Undo</button>
                    <button onClick={() => session.undoManager.redo()}>Redo</button>
                    <input type="file" name="import" onChange={e =>
                    {
                        const files = e.target.files;
                        if (files.length > 0)
                        {
                            session.importManager.tryImportFile(files[0], session);
                
                            //Makes sure you can upload the same file again.
                            e.target.value = '';
                        }
                    }}/>
                    </>
                )
            }
        </SessionStateConsumer>
    );
}

export function renderDrawer()
{
    return (
        <ExportPanel />
    );
}

export function renderViewport()
{
    return (
        <NotificationConsumer>
            {context =>
                <NotificationView notificationManager={context.getNotificationManager()} />
            }
        </NotificationConsumer>
    );
}
