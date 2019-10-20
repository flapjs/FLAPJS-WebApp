import React from 'react';

import NotificationManager from '@flapjs/deprecated/notification/NotificationManager.js';
import * as DefaultNotifications from '@flapjs/deprecated/notification/DefaultNotifications.jsx';
import NotificationView from '@flapjs/deprecated/notification/components/NotificationView.jsx';
import { NotificationConsumer } from '@flapjs/deprecated/notification/NotificationContext.jsx';
import ExportManager from '@flapjs/deprecated/file/export/ExportManager.js';
import ImportManager from '@flapjs/deprecated/file/import/ImportManager.js';
import ExportPanel from '@flapjs/modules/base/ExportPanel.jsx';

export function initialize(app)
{
    app._notificationManager = new NotificationManager();
    app._importManager = new ImportManager();

    app._exportManager = new ExportManager();
    const currentModule = app.props.module;
    if (currentModule)
    {
        if (currentModule.exports)
        {
            for(const exportType of Object.keys(currentModule.exports))
            {
                app._exportManager.registerExporter(currentModule.exports[exportType], exportType);
            }
        }
    }
}

export function componentDidMount(app)
{
    app._notificationManager.pushNotification('Welcome to Flap.js!');

    DefaultNotifications.initialize(app._notificationManager);
}

export function componentWillUnmount(app)
{
    app._exportManager.clear();
    app._importManager.clear();
    DefaultNotifications.terminate(app._notificationManager);
}

export function renderAppBar(app)
{
    return (
        null
    );
}

export function renderDrawer(app)
{
    return (
        <ExportPanel exportManager={app._exportManager}/>
    );
}

export function renderViewport(app)
{
    return (
        <NotificationConsumer>
            {context =>
                <NotificationView notificationManager={context.getNotificationManager()} />
            }
        </NotificationConsumer>
    );
}
