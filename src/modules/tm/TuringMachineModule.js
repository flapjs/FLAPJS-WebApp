const MODULE = {
    id: 'tm',
    version: '1.0.0',
    services: {},
    renders: {},
    reducer(state, action)
    {
        switch(action.type)
        {
            default:
                throw new Error(`Unsupported action ${action}.`);
        }
    },
    load(session)
    {
    },
    unload(session)
    {
    }
};

export default MODULE;
