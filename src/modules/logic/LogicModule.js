const MODULE = {
    id: 'logic',
    version: '1.0.0',
    renders: {},
    imports: [],
    exports: {},
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
