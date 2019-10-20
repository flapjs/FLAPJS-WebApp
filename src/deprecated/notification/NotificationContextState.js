/**
 * Creates a context state. This helps maintain a consistant shape
 * for all notification contexts.
 * 
 * @param {Provider} provider The provider to bind to.
 * @param {NotificationManager} manager The manager to bind with.
 * @returns {object} The notification context state object.
 */
export function createContextState(provider, manager)
{
    if (manager) manager.bindProviderContext(provider);
    
    return {
        notifications: [],
        getNotificationManager() { return manager; },
    };
}
