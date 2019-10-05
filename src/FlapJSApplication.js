import React from 'react';
import ReactDOM from 'react-dom';

import * as FlapJSModules from './FlapJSModules.js';

import App from './components/app/App.jsx';
import ModuleManager from './modules/ModuleManager.js';
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
        return (await moduleHeader.fetch()).default;
    }

    /** @override */
    render()
    {
        const props = {
            session: this.moduleManager.getCurrentSession().setApplication(this),
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
