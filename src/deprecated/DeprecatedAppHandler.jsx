import React from 'react';

import NotificationView from '@flapjs/deprecated/notification/components/NotificationView.jsx';
import { NotificationConsumer } from '@flapjs/deprecated/notification/NotificationContext.jsx';

import ExportPanel from '@flapjs/components/drawer/panels/ExportPanel.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

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
