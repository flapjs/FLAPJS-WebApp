import { uuid } from '@flapjs/util/MathHelper.js';

class Notification
{
    constructor(notificationManager, message, layoutID, tags, props)
    {
        this._notificationManager = notificationManager;
        this._message = message;
        this._layoutID = layoutID;
        this._tags = tags;
        this._props = props;
        this._id = uuid();
    }

    close() { this._notificationManager.removeNotification(this); }
    hasTag(tag) { return this._tags.includes(tag); }

    getMessage() { return this._message; }
    getLayoutID() { return this._layoutID; }
    getTags() { return this._tags; }
    getProps() { return this._props; }
    getID() { return this._id; }
    getNotificationManager() { return this._notificationManager; }
}

export default Notification;
