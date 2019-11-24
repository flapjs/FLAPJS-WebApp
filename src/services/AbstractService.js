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
}
AbstractService.INSTANCE = new AbstractService();
AbstractService.CONTEXT = null;

export default AbstractService;
