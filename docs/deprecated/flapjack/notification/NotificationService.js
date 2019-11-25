import AbstractService from '../../services/AbstractService.js';

import NotificationManager from './NotificationManager.js';
import * as DefaultNotifications from './DefaultNotifications.jsx';

class NotificationService extends AbstractService
{
    static get SERVICE_KEY() { return 'notificationService'; }
    
    constructor()
    {
        super();
        
        this.notificationManager = new NotificationManager();
    }

    /** @override */
    onSessionLoad(session)
    {
        session.notificationManager = this.notificationManager;
    }

    /** @override */
    onSessionMount(sessionProvider)
    {
        DefaultNotifications.initialize(this.notificationManager);
    }

    /** @override */
    onSessionUnmount(sessionProvider)
    {
        DefaultNotifications.terminate(this.notificationManager);
    }

    /** @override */
    onSessionUnload(session)
    {
        this.notificationManager.clearNotifications();

        delete session.notificationManager;
    }
}
NotificationService.INSTANCE = new NotificationService();
NotificationService.CONTEXT = null;

export default NotificationService;
