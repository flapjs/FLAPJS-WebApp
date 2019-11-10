import React from 'react';
import PropTypes from 'prop-types';

import DeprecatedServiceProviders from '@flapjs/deprecated/DeprecatedServiceProviders.jsx';

import { ThemeProvider } from '@flapjs/components/theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import { DrawerProvider } from '@flapjs/components/drawer/context/DrawerContext.jsx';
import { SessionProvider } from '@flapjs/session/context/SessionContext.jsx';

import ModuleSessionHandler from '@flapjs/components/app/ModuleSessionHandler.js';

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
        
        this.moduleSessionHandler.onPreLoad(session);

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

        this.moduleSessionHandler.onLoad(session);

        // Load services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        if (this.moduleServices.length > 0) this.moduleServices.reduce((prev, current) => current.load(session), this.moduleServices[0]);

        this.moduleSessionHandler.onPostLoad(session);
    }

    onSessionDidMount(sessionProvider)
    {
        // Mount services...
        // NOTE: This is used as a forward iterator :P (to match the reverse iterator)
        if (this.moduleServices.length > 0) this.moduleServices.reduce((prev, current) => current.mount(sessionProvider), this.moduleServices[0]);

        this.moduleSessionHandler.onDidMount(sessionProvider);
    }

    onSessionWillUnmount(sessionProvider)
    {
        this.moduleSessionHandler.onWillUnmount(sessionProvider);

        // Unmount services...
        // NOTE: This is used as a reverse iterator :P
        if (this.moduleServices.length > 0) this.moduleServices.reduceRight((prev, current) => current.unmount(sessionProvider), this.moduleServices[this.moduleServices.length - 1]);
    }

    onSessionUnload(session)
    {
        this.moduleSessionHandler.onUnload(session);

        // Unload services...
        // NOTE: This is used as a reverse iterator :P
        if (this.moduleServices.length > 0) this.moduleServices.reduceRight((prev, current) => current.unload(session), this.moduleServices[this.moduleServices.length - 1]);
        this.moduleServices.length = 0;
    }
    
    /** @override */
    render()
    {
        const props = this.props;

        const app = props.app;

        return (
            <LocalizationProvider localeCode="en">
                <ThemeProvider source={() => document.getElementById('root')}>
                    <DrawerProvider>
                        <SessionProvider
                            ref={this.moduleSession}
                            reducer={this.moduleSessionHandler.reducer}
                            onLoad={this.onSessionLoad}
                            onDidMount={this.onSessionDidMount}
                            onWillUnmount={this.onSessionWillUnmount}
                            onUnload={this.onSessionUnload}>
                            <DeprecatedServiceProviders app={app}>
                                {props.children}
                            </DeprecatedServiceProviders>
                        </SessionProvider>
                    </DrawerProvider>
                </ThemeProvider>
            </LocalizationProvider>
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
