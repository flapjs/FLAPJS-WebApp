import Notification from './Notification.js';

class NotificationManager
{
    constructor()
    {
        this._layouts = new Map();
        this._notifications = [];
        this._notificationMap = new Map();

        this.provider = null;
    }

    bindProviderContext(provider)
    {
        this.provider = provider;
    }

    updateProviderContext()
    {
        if (this.provider && this.provider.shouldUpdateAsync)
        {
            this.provider.setState({ notifications: Array.from(this.getNotificationIDs()) });
        }
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
        this._notificationMap.set(notification.getID(), notification);
        this.updateProviderContext();
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
                    this._notificationMap.delete(notification.getID());
                    this.updateProviderContext();
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
                    this._notificationMap.delete(notification.getID());
                    this.updateProviderContext();
                    return notification;
                }
            }
        }
        else
        {
            const notification = this._notifications.pop();
            this._notificationMap.delete(notification.getID());
            this.updateProviderContext();
            return notification;
        }
    }

    removeNotification(notification)
    {
        const i = this._notifications.indexOf(notification);
        if (i >= 0)
        {
            this._notifications.splice(i, 1);
            this._notificationMap.delete(notification.getID());
        }
        this.updateProviderContext();
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
                    this._notificationMap.delete(notification.getID());
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
                    this._notificationMap.delete(notification.getID());
                }
            }
        }
        else
        {
            this._notifications.length = 0;
            this._notificationMap.clear();
        }
        
        this.updateProviderContext();
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

    getNotificationByID(id)
    {
        return this._notificationMap.get(id);
    }

    getNotificationIDs()
    {
        return this._notificationMap.keys();
    }

    isEmpty()
    {
        return this._notifications.length <= 0;
    }
}

export default NotificationManager;
