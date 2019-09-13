/** Creates a context state. This helps maintain a consistant shape for all notification contexts. */
export function createContextState(provider, manager)
{
    if (manager) manager.bindProviderContext(provider);
    
    return {
        notifications: [],
        getNotificationManager() { return manager; },
    };
}
