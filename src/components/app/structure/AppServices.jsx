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

        this.moduleServiceRefs = {};
        this.moduleSession = React.createRef();
        this.moduleSessionHandler = new ModuleSessionHandler(app.props.module, app.props.changeModule);
    }

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

        // this.moduleSessionHandler.onLoad(this.moduleSession.current, this.moduleServiceRefs);

        if (typeof this.props.onLoad === 'function')
        {
            this.props.onLoad(this.moduleServiceRefs);
        }
        return result;
    }

    /** @override */
    componentWillUnmount()
    {
        // this.moduleSessionHandler.onUnload(this.moduleSession.current, this.moduleServiceRefs);

        if (typeof this.props.onUnload === 'function')
        {
            this.props.onUnload(this.moduleServiceRefs);
        }
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
                onLoad={this.moduleSessionHandler.onLoad}
                onDidMount={this.moduleSessionHandler.onDidMount}
                onWillUnmount={this.moduleSessionHandler.onWillUnmount}
                onUnload={this.moduleSessionHandler.onUnload}>
                <AppServiceProviders appProps={app.props}>
                    <DeprecatedServiceProviders app={app}>
                        {this.renderModuleServices(app.props.module, props.children)}
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
