import AbstractService from './AbstractService.js';

import NotificationManager from '@flapjs/deprecated/notification/NotificationManager.js';
import * as DefaultNotifications from '@flapjs/deprecated/notification/DefaultNotifications.jsx';

class NotificationService extends AbstractService
{
    static get SERVICE_KEY() { return 'notificationService'; }
    
    constructor()
    {
        super();
        
        this.notificationManager = new NotificationManager();
    }

    /** @override */
    load(session)
    {
        super.load(session);

        session.notificationManager = this.notificationManager;
        
        return this;
    }

    /** @override */
    mount(sessionProvider)
    {
        super.mount(sessionProvider);

        DefaultNotifications.initialize(this.notificationManager);

        return this;
    }

    /** @override */
    unmount(sessionProvider)
    {
        super.unmount(sessionProvider);

        DefaultNotifications.terminate(this.notificationManager);

        return this;
    }

    /** @override */
    unload(session)
    {
        super.unload(session);

        this.notificationManager.clearNotifications();

        delete session.notificationManager;

        return this;
    }
}

export default NotificationService;
