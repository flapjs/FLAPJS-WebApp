import React from 'react';
import PropTypes from 'prop-types';

import AppServiceProviders from '@flapjs/components/app/structure/AppServiceProviders.jsx';
import DeprecatedServiceProviders from '@flapjs/deprecated/DeprecatedServiceProviders.jsx';

import { SessionProvider } from '@flapjs/session/context/SessionContext.jsx';

import ModuleSessionHandler from '@flapjs/components/app/ModuleSessionHandler.js';
import ModuleManager from '@flapjs/session/ModuleManager.js';

class AppServices extends React.Component
{
    constructor(props)
    {
        super(props);

        const app = props.app;

        this.moduleSessionHandler = new ModuleSessionHandler(app.props.module, app.props.changeModule);
        this.moduleServices = [];

        this.onSessionLoad = this.onSessionLoad.bind(this);
        this.onSessionDidMount = this.onSessionDidMount.bind(this);
        this.onSessionWillUnmount = this.onSessionWillUnmount.bind(this);
        this.onSessionUnload = this.onSessionUnload.bind(this);
    }

    onSessionLoad(session)
    {
        const app = this.props.app;
        const currentModule = app.props.module;

        // Create services...
        if (currentModule && typeof currentModule.services === 'object')
        {
            for(const serviceKey of Object.keys(currentModule.services))
            {
                const ServiceClass = currentModule.services[serviceKey];
                const serviceInstance = new ServiceClass();
                session[serviceKey] = serviceInstance;
                this.moduleServices.push(serviceInstance);
            }
        }

        this.moduleSessionHandler.onPreLoad(session);

        // Load services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        this.moduleServices.reduce((prev, current) => current.load(session));

        this.moduleSessionHandler.onLoad(session);
    }

    onSessionDidMount(sessionProvider)
    {
        // Mount services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        this.moduleServices.reduce((prev, current) => current.mount(sessionProvider));

        this.moduleSessionHandler.onDidMount(sessionProvider);
    }

    onSessionWillUnmount(sessionProvider)
    {
        this.moduleSessionHandler.onWillUnmount(sessionProvider);

        // Unmount services...
        // NOTE: This is used as a reverse iterator :P
        this.moduleServices.reduceRight((prev, current) => current.unmount(sessionProvider));
    }

    onSessionUnload(session)
    {
        this.moduleSessionHandler.onUnload(session);

        // Unload services...
        // NOTE: This is used as a reverse iterator :P
        this.moduleServices.reduceRight((prev, current) => current.unload(session));
        this.moduleServices.length = 0;
    }

    /**
     * @deprecated
     * @param currentModule
     * @param children
     * @param callback
     */
    renderModuleServices(currentModule, children, callback)
    {
        let result = children;

        if (currentModule && typeof currentModule.services === 'object')
        {
            result = ModuleManager.renderServices(
                currentModule.services,
                {},
                children,
                serviceRefs => this.moduleServiceRefs = { session: this.moduleSession, ...serviceRefs }
            );
        }

        return result;
    }

    /** @override */
    render()
    {
        const props = this.props;

        const app = props.app;

        return (
            <SessionProvider
                ref={this.moduleSession}
                reducer={this.moduleSessionHandler.reducer}
                onLoad={this.onSessionLoad}
                onDidMount={this.onSessionDidMount}
                onWillUnmount={this.onSessionWillUnmount}
                onUnload={this.onSessionUnload}>
                <AppServiceProviders appProps={app.props}>
                    <DeprecatedServiceProviders app={app}>
                        {props.children}
                    </DeprecatedServiceProviders>
                </AppServiceProviders>
            </SessionProvider>
        );
    }
}
AppServices.propTypes = {
    children: PropTypes.node.isRequired,
    app: PropTypes.object.isRequired,
    onLoad: PropTypes.func,
    onUnload: PropTypes.func,
};

export default AppServices;
