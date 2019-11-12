import React from 'react';
import ReactDOM from 'react-dom';

import * as FlapJSModules from './FlapJSModules.js';

import App from './components/app/App.jsx';
import ModuleManager, { EVENT_ON_CHANGE_MODULE } from './session/ModuleManager.js';
import ModuleSaver from './session/ModuleSaver.js';
import BaseModule from './modules/base/BaseModule.js';

class FlapJSApplication
{
    constructor(rootElement)
    {
        this.rootElement = rootElement;
        this.moduleManager = new ModuleManager(this, BaseModule);
        this.moduleSaver = new ModuleSaver();

        this.handleChangeModule = this.handleChangeModule.bind(this);
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
        // await new Promise(resolve => setTimeout(resolve, 3000));
        // Actually go fetch it now...
        return (await moduleHeader.fetch()).default;
    }

    async start()
    {
        // Load the module from storage, if available...
        if (this.moduleSaver.hasPreviousModuleID())
        {
            const prevModuleID = this.moduleSaver.loadFromPreviousModuleID();
            const prevModule = await this.loadModuleByID(prevModuleID);
            await this.moduleManager.changeModule(prevModule);
        }
        else
        {
            await this.moduleManager.changeModule(BaseModule);
        }
        
        // Save the module to storage, if it changes...
        this.moduleManager.addEventListener(EVENT_ON_CHANGE_MODULE,
            nextModuleID => this.moduleSaver.saveToPreviousModuleID(nextModuleID));

        // Start the app...
        this.render();
    }
    
    render()
    {
        const props = {
            module: this.moduleManager.getCurrentModule(),
            session: this.moduleManager.getCurrentSession(),
            reducer: this.moduleManager.getCurrentReducer(),
            changeModule: this.handleChangeModule,
        };

        ReactDOM.render(
            React.createElement(
                App, props
            ),
            this.rootElement
        );
    }
    
    handleChangeModule(nextModuleID)
    {
        this.loadModuleByID(nextModuleID)
            .then(nextModule => this.moduleManager.changeModule(nextModule))
            .then(() => this.render());
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
