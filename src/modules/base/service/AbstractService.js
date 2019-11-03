class AbstractService
{
    /** Services must have a no-args constructor. */
    constructor() {}

    load(session)
    {
        return this;
    }

    mount(sessionProvider)
    {
        return this;
    }

    unmount(sessionProvider)
    {
        return this;
    }

    unload(session)
    {
        return this;
    }
}

export default AbstractService;
