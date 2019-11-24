import { uuid } from '@flapjs/util/MathHelper.js';
import InfoMessage from '@flapjs/services/notification/components/messages/InfoMessage.jsx';

class NotificationManager
{
    constructor()
    {
        this._notifications = [];
        this._notificationMap = new Map();
    }

    createNotification(content, messageClass, tags, props)
    {
        return {
            id: uuid(),
            content,
            message: messageClass,
            tags,
            props,
        };
    }

    pushNotification(content = '', messageComponentClass = InfoMessage, tags = [], props = {}, replace = false)
    {
        let notification = this.createNotification(content, messageComponentClass, tags, props);

        this._notificationMap.set(notification.id, notification);
        this._notifications.push(notification);
    }

    removeNotification(notification)
    {
        this._notificationMap.delete(notification.id);
        this._notifications.splice(this._notifications.indexOf(notification), 1);
    }

    clearNotifications(tags)
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
                    if (!notification.tags.includes(tag))
                    {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                {
                    this._notifications.splice(i, 1);
                    this._notificationMap.delete(notification.id);
                }
            }
        }
        else if (typeof tags === 'string')
        {
            for (let i = this._notifications.length - 1; i >= 0; --i)
            {
                const notification = this._notifications[i];
                if (notification.tags.includes(tags))
                {
                    this._notifications.splice(i, 1);
                    this._notificationMap.delete(notification.id);
                }
            }
        }
        else
        {
            this._notifications.length = 0;
            this._notificationMap.clear();
        }
    }

    getNotificationById(id)
    {
        return this._notificationMap.get(id);
    }

    countNotifications()
    {
        return this._notifications.length;
    }

    getNotifications()
    {
        return this._notifications;
    } 
}

export default NotificationManager;
