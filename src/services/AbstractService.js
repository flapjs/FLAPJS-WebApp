class AbstractService
{
    /** @override */
    static get SERVICE_KEY() { return 'abstractService'; }

    /** Services must have a no-args constructor. */
    constructor() {}

    // These callbacks will only be called if Class.CONTEXT is defined.
    onServiceLoad(state) {}
    onServiceMount(provider) {}
    onServiceUnmount(provider) {}
    onServiceUnload(state) {}

    // These callbacks will be called every time, regardless if Class.CONTEXT is null.
    onSessionLoad(session) {}
    onSessionMount(provider) {}
    onSessionUnmount(provider) {}
    onSessionUnload(session) {}

    /**
     * Use onSessionLoad instead.
     * 
     * @deprecated
     * @param {Session} session The session state.
     * @returns {this} Self.
     */
    load(session)
    {
        this.onSessionLoad(session);
        return this;
    }

    /**
     * Use onSessionMount instead.
     * 
     * @deprecated
     * @param {SessionProvider} sessionProvider The session provider.
     * @returns {this} Self.
     */
    mount(sessionProvider)
    {
        this.onSessionMount(sessionProvider);
        return this;
    }

    /**
     * Use onSessionUnmount instead.
     * 
     * @deprecated
     * @param {SessionProvider} sessionProvider The session provider.
     * @returns {this} Self.
     */
    unmount(sessionProvider)
    {
        this.onSessionUnmount(sessionProvider);
        return this;
    }

    /**
     * Use onSessionUnload instead.
     * 
     * @deprecated
     * @param {Session} session The session state.
     * @returns {this} Self.
     */
    unload(session)
    {
        this.onSessionUnload(session);
        return this;
    }
}
AbstractService.INSTANCE = new AbstractService();
AbstractService.CONTEXT = null;

export default AbstractService;
