/**
 * An interface for module services. A service is the "data" and system handling
 * for any global resource. It includes not only setup and teardown functionality,
 * but also context providers as a way to connect and update the UI automatically
 * when data changes (by using the dispatch() from the provider's counterpart, the consumer).
 * 
 * By default, all data is store within the SessionProvider. But you should localize
 * any data that won't affect the ENTIRE app (forcing everything to re-render) to your
 * own context provider. To do so, set the Class.CONTEXT value to an object containing
 * a `Provider` property, whose value is the context's provider class, and any consumers
 * you will want. For ease of use, a ServiceContextFactory already has a createServiceContext()
 * implemented for you so just call that with the appropriate arguments, and that should
 * be good.
 */
class AbstractService
{
    /**
     * The service key to be registered with the session. It must be unique.
     * 
     * @returns {string} The unique service key.
     */
    static get SERVICE_KEY() { return 'abstractService'; }

    /** Services must have a no-args constructor. */
    constructor()
    {
        this._provider = null;
    }

    setProvider(provider)
    {
        this._provider = provider;
        return this;
    }

    // These callbacks will only be called if Class.CONTEXT is defined.
    reducer(state, action) {}

    /**
     * Called by ModuleManager (if CONTEXT is defined) to handle to set up the state of the service provider.
     * Usually, you would want to expose the interface by setting properties in the
     * passed-in state. This state is the object that will be referenced when someone
     * uses the CONTEXT.StateProvider React element.
     * 
     * Any initialization that depends on other services should be handled in
     * onSessionLoad() or onSessionMount() instead.
     * 
     * @param {object} state The state of the service provider.
     */
    onServiceLoad(state) {}

    /**
     * Called by ModuleManager (if CONTEXT is defined) to handle any set up with the service provider itself.
     * This is called AFTER onServiceLoad().
     * 
     * @param {ServiceProvider} provider The service provider containing the state and dispatch.
     */
    onServiceMount(provider) {}

    /**
     * Called by ModuleManager (if CONTEXT is defined) to handle any tear down with the service provider itself.
     * This is called BEFORE onServiceUnload().
     * 
     * @param {ServiceProvider} provider The service provider container the state and dispatch.
     */
    onServiceUnmount(provider) {}

    /**
     * Called by ModuleManager (if CONTEXT is defined) to handle any tear down with the state of the service provider.
     * Do remove ALL properties, listeners, handlers, etc. from the state to prevent memory leaks!
     * 
     * @param {object} state The state of the service provider.
     */
    onServiceUnload(state) {}

    // These callbacks will be called every time, regardless if Class.CONTEXT is null.

    /**
     * Called by ModuleManager to handle any set up with the session state.
     * 
     * @param {object} session The session state.
     */
    onSessionLoad(session) {}

    /**
     * Called by ModuleManager to handle any set up with the session provider.
     * This is called AFTER onSessionLoad().
     * 
     * @param {SessionProvider} provider The session provider containing state and dispatch.
     */
    onSessionMount(provider) {}

    /**
     * Called by ModuleManager to handle any tear down with the session provider.
     * This is called BEFORE onSessionUnload().
     * 
     * @param {SessionProvider} provider The session provider containing state and dispatch.
     */
    onSessionUnmount(provider) {}

    /**
     * Called by ModuleManager to handle any tear down with the session state.
     * 
     * @param {object} session The session state.
     */
    onSessionUnload(session) {}

    getProvider() { return this._provider; }
}
/** The singleton instance for this service. */
AbstractService.INSTANCE = new AbstractService();
/** The service context for this service. If null, any onService() callbacks will NOT be called. */
AbstractService.CONTEXT = null;

export default AbstractService;
