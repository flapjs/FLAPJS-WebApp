/** Creates a context state. This helps maintain a consistant shape for all hotkey contexts. */
export function createContextState(provider, manager)
{
    if (manager) manager.bindProviderContext(provider);
    
    return {
        // TODO: this needs to somehow represent the state of the hotkey manager
        // Right now, it is just set to something random just to get an update.
        value: '',
        getHotKeyManager() { return manager; },
    };
}
