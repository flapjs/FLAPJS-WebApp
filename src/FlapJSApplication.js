import React from 'react';
import ReactDOM from 'react-dom';

import * as FlapJSModules from './FlapJSModules.js';

import App from './components/app/App.jsx';
import ModuleManager from './session/ModuleManager.js';
import BaseModule from './modules/base/BaseModule.js';

class FlapJSApplication
{
    constructor(rootElement)
    {
        this.rootElement = rootElement;
        this.moduleManager = new ModuleManager(this, BaseModule);
    }

    async loadModuleByID(moduleID)
    {
        if (!(moduleID in FlapJSModules))
        {
            throw new Error(`Cannot find header for module id '${moduleID}' - missing module entry in FlapJSModules`);
        }

        // eslint-disable-next-line import/namespace
        const moduleHeader = FlapJSModules[moduleID];
        // DEBUG: This is just to slow down module loading. For testing purposes.
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Actually go fetch it now...
        return (await moduleHeader.fetch()).default;
    }

    /** @override */
    render(nullFirstRender = false)
    {
        if (nullFirstRender)
        {
            ReactDOM.render(null, this.rootElement);
        }

        const props = {
            module: this.moduleManager.getCurrentModule(),
            changeModule: this.moduleManager.changeModule,
            renderModule: this.moduleManager.renderModuleLayer,
        };

        ReactDOM.render(
            React.createElement(
                App, props
            ),
            this.rootElement
        );
    }

    getRenderRootElement()
    {
        return this.rootElement;
    }

    getModuleManager()
    {
        return this.moduleManager;
    }
}

const DOCUMENT_ROOT_ELEMENT = document.getElementById('root');
const INSTANCE = new FlapJSApplication(DOCUMENT_ROOT_ELEMENT);
export default INSTANCE;
