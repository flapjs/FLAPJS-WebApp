const MODULE = {
    id: 'node',
    version: '1.0.0',
    serices: {},
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
