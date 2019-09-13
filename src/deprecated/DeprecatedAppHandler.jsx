import React from 'react';

import NotificationManager from '@flapjs/deprecated/notification/NotificationManager.js';
import * as DefaultNotifications from '@flapjs/deprecated/notification/DefaultNotifications.jsx';
import NotificationView from '@flapjs/deprecated/notification/components/NotificationView.jsx';
import { NotificationConsumer } from '@flapjs/deprecated/notification/NotificationContext.jsx';

export function initialize(app)
{
    app._notificationManager = new NotificationManager();
}

export function componentDidMount(app)
{
    app._notificationManager.pushNotification('Welcome to Flap.js!');

    DefaultNotifications.initialize(app._notificationManager);
}

export function componentWillUnmount(app)
{
    DefaultNotifications.terminate(app._notificationManager);
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
