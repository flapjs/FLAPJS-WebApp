export const SERVICE_LIST_SYMBOL = Symbol('serviceList');

class ServiceHandler
{
    constructor() {}

    prepareServicesForModule(session, currentModule)
    {
        if (!currentModule) return;

        const serviceList = session[SERVICE_LIST_SYMBOL] = [];
        if ('services' in currentModule)
        {
            const services = currentModule.services;
            if (Array.isArray(services))
            {
                for(const service of services)
                {
                    const instance = session[service.SERVICE_KEY] = service.INSTANCE;
                    serviceList.push(instance);
                }
            }
            else if (typeof services === 'function')
            {
                const instance = session[services.SERVICE_KEY] = services.INSTANCE;
                serviceList.push(instance);
            }
        }
    }

    loadServicesForModule(session, currentModule)
    {
        const serviceList = session[SERVICE_LIST_SYMBOL];

        // Load services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        if (serviceList.length > 0) serviceList.reduce((prev, current) => current.onSessionLoad(session), serviceList[0]);
    }

    didMountSession(sessionProvider)
    {
        const serviceList = sessionProvider.state[SERVICE_LIST_SYMBOL];

        // Mount services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        if (serviceList.length > 0) serviceList.reduce((prev, current) => current.onSessionMount(sessionProvider), serviceList[0]);
    }

    willUnmountSession(sessionProvider)
    {
        const serviceList = sessionProvider.state[SERVICE_LIST_SYMBOL];

        // Unmount services...
        // NOTE: This is used as a reverse iterator :P
        if (serviceList.length > 0) serviceList.reduceRight((prev, current) => current.onSessionUnmount(sessionProvider), serviceList[serviceList.length - 1]);
    }

    destroySession(session)
    {
        const serviceList = session[SERVICE_LIST_SYMBOL];

        // Unload services...
        // NOTE: This is used as a reverse iterator :P
        if (serviceList.length > 0) serviceList.reduceRight((prev, current) => current.onSessionUnload(session), serviceList[serviceList.length - 1]);
        serviceList.length = 0;
    }
}

export default ServiceHandler;
