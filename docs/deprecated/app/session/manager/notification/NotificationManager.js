import React from 'react';
import Notification from './Notification.js';

import DefaultNotificationLayout, {
    STYLE_TYPE_DEFAULT,
    STYLE_TYPE_WARNING,
    STYLE_TYPE_ERROR,
    STYLE_TYPE_SUCCESS
} from './components/DefaultNotificationLayout.js';
import SequenceNotificationLayout from './components/SequenceNotificationLayout.js';

export const DEFAULT_LAYOUT_ID = 'default';
export const WARNING_LAYOUT_ID = 'warning';
export const ERROR_LAYOUT_ID = 'error';
export const SUCCESS_LAYOUT_ID = 'success';
export const SEQUENCE_LAYOUT_ID = 'sequence';

class NotificationManager
{
    constructor()
    {
        this._layouts = new Map();
        this._notifications = [];
    }

    registerNotificationLayout(layoutID, notificationLayout)
    {
        this._layouts.set(layoutID, notificationLayout);
        return this;
    }

    unregisterNotificationLayout(layoutID)
    {
        this._layouts.delete(layoutID);
        return this;
    }

    pushNotification(message, layoutID = null, tags = [], props = {}, replace = true)
    {
        if (replace && tags.length > 0)
        {
            this.clearNotifications(tags);
        }

        const notification = new Notification(this, message, layoutID, tags, props);
        this._notifications.push(notification);
        return notification;
    }

    popNotification(tags = null)
    {
        if (this._notifications.length <= 0) return null;

        if (Array.isArray(tags))
        {
            for (let i = this._notifications.length - 1; i >= 0; --i)
            {
                const notification = this._notifications[i];
                let flag = true;
                for (const tag of tags)
                {
                    if (!notification.hasTag(tag))
                    {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                {
                    this._notifications.splice(i, 1);
                    return notification;
                }
            }
        }
        else if (typeof tags === 'string')
        {
            for (let i = 0, length = this._notifications.length; i < length; ++i)
            {
                const notification = this._notifications[i];
                if (notification.hasTag(tags))
                {
                    this._notifications.splice(i, 1);
                    return notification;
                }
            }
        }
        else
        {
            return this._notifications.pop();
        }
    }

    removeNotification(notification)
    {
        const i = this._notifications.indexOf(notification);
        if (i >= 0)
        {
            this._notifications.splice(i, 1);
        }
    }

    clearNotifications(tags = null)
    {
        if (this._notifications.length <= 0) return;

        if (Array.isArray(tags))
        {
            for (let i = this._notifications.length - 1; i >= 0; --i)
            {
                const notification = this._notifications[i];
                let flag = true;
                for (const tag of tags)
                {
                    if (!notification.hasTag(tag))
                    {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                {
                    this._notifications.splice(i, 1);
                }
            }
        }
        else if (typeof tags === 'string')
        {
            for (let i = this._notifications.length - 1; i >= 0; --i)
            {
                const notification = this._notifications[i];
                if (notification.hasTag(tags))
                {
                    this._notifications.splice(i, 1);
                }
            }
        }
        else
        {
            this._notifications.length = 0;
        }
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {
        //Overwrite any changes to default notifications...
        this.registerNotificationLayout(DEFAULT_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_DEFAULT} {...props} />);
        this.registerNotificationLayout(WARNING_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_WARNING} {...props} />);
        this.registerNotificationLayout(ERROR_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_ERROR} {...props} />);
        this.registerNotificationLayout(SUCCESS_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_SUCCESS} {...props} />);
        this.registerNotificationLayout(SEQUENCE_LAYOUT_ID, props => <SequenceNotificationLayout {...props} />);
    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        this.clearNotifications();
    }

    hasNotificationLayout(layoutID)
    {
        return this._layouts.has(layoutID);
    }

    getNotificationLayout(layoutID)
    {
        return this._layouts.get(layoutID);
    }

    getNotifications()
    {
        return this._notifications;
    }

    isEmpty()
    {
        return this._notifications.length <= 0;
    }
}

export default NotificationManager;
