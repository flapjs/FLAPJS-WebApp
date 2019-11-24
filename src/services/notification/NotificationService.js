import AbstractService from '../AbstractService.js';
import { createServiceContext } from '@flapjs/services/util/ServiceContextFactory.js';

import NotificationManager from './NotificationManager.js';

class NotificationService extends AbstractService
{
    /** @override */
    static get SERVICE_KEY() { return 'notificationService'; }
    
    constructor()
    {
        super();

        this.notificationManager = new NotificationManager();
    }

    /** @override */
    reducer(state, action)
    {
        switch(action.type)
        {
            case 'push':
                state.notificationManager.pushNotification(action.content, action.message, action.tags, action.props, action.replace);
                return {
                    notifications: state.notificationManager.getNotifications(),
                    notificationCount: state.notificationManager.countNotifications()
                };
            case 'close':
                state.notificationManager.removeNotification(action.notification);
                return {
                    notifications: state.notificationManager.getNotifications(),
                    notificationCount: state.notificationManager.countNotifications()
                };
            case 'clear':
                state.notificationManager.clearNotifications(action.tags);
                return {
                    notifications: state.notificationManager.getNotifications(),
                    notificationCount: state.notificationManager.countNotifications()
                };
        } 
    }

    /** @override */
    onServiceLoad(state)
    {
        state.notificationManager = this.notificationManager;
        state.notificationCount = this.notificationManager.countNotifications();
        state.notifications = this.notificationManager.getNotifications();
    }

    /** @override */
    onServiceMount(provider)
    {
    }

    /** @override */
    onServiceUnmount(provider)
    {
    }

    /** @override */
    onServiceUnload(state)
    {
        delete state.notificationManager;
        delete state.notificationCount;
        delete state.notifications;
    }

    /** @override */
    onSessionLoad(session)
    {
    }

    /** @override */
    onSessionUnload(session)
    {
    }
}
NotificationService.INSTANCE = new NotificationService();
NotificationService.CONTEXT = createServiceContext('NotificationService', NotificationService.INSTANCE);

export default NotificationService;
