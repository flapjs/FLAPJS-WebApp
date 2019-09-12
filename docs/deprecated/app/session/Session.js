import Modules from 'modules/Modules.js';
import LocalStorage from 'util/storage/LocalStorage.js';
import * as URLHelper from 'util/URLHelper.js';
import { guid } from 'util/MathHelper.js';

import Logger from 'util/logger/Logger.js';
const LOGGER_TAG = 'Session';

const DEFAULT_MODULE_ID = 'fsa';
export const CURRENT_MODULE_STORAGE_ID = 'currentModule';
const MODULE_LOAD_DELAY = 300;
let MODULE_TIMEOUT = null;

class Session
{
    constructor()
    {
        this._name = I18N.toString('file.untitled');
        this._module = null;
        this._moduleClass = null;
        this._moduleStarted = false;
        this._app = null;

        this._sessionID = null;

        this._listeners = [];
    }

    addListener(listener)
    {
        this._listeners.push(listener);
        return this;
    }

    startSession(app, moduleName = null)
    {
        if (this._module !== null) return;

        Logger.out(LOGGER_TAG, `Starting session for module '${moduleName}'...`);

        // Load from storage, url, or default, if not specified...
        if (!moduleName || moduleName.length <= 0)
        {
            const urlParams = URLHelper.getURLParameters(URLHelper.getCurrentURL());
            if ('module' in urlParams) moduleName = urlParams['module'];
            if (!moduleName || moduleName.length <= 0)
            {
                moduleName = LocalStorage.getData(CURRENT_MODULE_STORAGE_ID);
                if (!moduleName || moduleName.length <= 0)
                {
                    moduleName = DEFAULT_MODULE_ID;
                }
            }
        }

        // Check registered module info...
        let moduleInfo = Modules[moduleName];
        if (!moduleInfo)
        {
            moduleName = DEFAULT_MODULE_ID;
            moduleInfo = Modules[moduleName];
            
            if (!moduleInfo)
            {
                window.alert('Cannot find registered module with id \'' + moduleName + '\'');
                return;
            }
        }
        const useExperimental = moduleInfo['experimental'];
        if (useExperimental && !app.isExperimental())
        {
            window.alert('Cannot load experimental module with id \'' + moduleName + '\' on stable app version.');
            return;
        }
        else if (!useExperimental && app.isExperimental())
        {
            window.alert('Cannot load stable module with id \'' + moduleName + '\' on experimental app version.');
            return;
        }

        // Overwrite any past calls...
        if (MODULE_TIMEOUT) clearTimeout(MODULE_TIMEOUT);

        MODULE_TIMEOUT = setTimeout(() =>
        {
            moduleInfo.fetch((ModuleClass) =>
            {
                MODULE_TIMEOUT = null;

                this._app = app;
                this._moduleClass = ModuleClass;
                this._sessionID = '#' + guid();
                try
                {
                    this._module = new ModuleClass(app);

                    // Allows renderers to be created...
                    app.forceUpdate();

                    this._module.initialize(app);

                    for (const listener of this._listeners)
                    {
                        listener.onSessionStart(this);
                    }

                    LocalStorage.setData(CURRENT_MODULE_STORAGE_ID, moduleName);

                    this._moduleStarted = true;
                }
                catch (e)
                {
                    window.alert('Could not load module with id \'' + moduleName + '\':\n' + e.message);
                }
            });
        }, MODULE_LOAD_DELAY);
    }

    restartSession(app, moduleName = null)
    {
        if (this._module === null) throw new Error('Cannot restart session that is not yet started');

        this.stopSession(app);
        this.startSession(app, moduleName);
    }

    updateSession(app)
    {
        if (this._module && this._moduleStarted)
        {
            this._module.update(app);
        }
    }

    stopSession(app)
    {
        if (this._module === null) return;

        Logger.out(LOGGER_TAG, 'Stopping session...');

        for (const listener of this._listeners)
        {
            listener.onSessionStop(this);
        }

        this._module.destroy(this._app);
        this._moduleStarted = false;
        this._moduleClass = null;
        this._module = null;
        this._sessionID = null;
        this._app = null;
    }

    setProjectName(name)
    {
        if (!name || name.length <= 0)
        {
            this._name = I18N.toString('file.untitled');
        }
        else
        {
            this._name = name;
        }

        const value = this._name;
        const element = document.getElementById('window-title');
        const string = element.innerHTML;
        const separator = string.indexOf('-');
        if (separator !== -1)
        {
            element.innerHTML = string.substring(0, separator).trim() + ' - ' + value;
        }
        else
        {
            element.innerHTML = string + ' - ' + value;
        }
    }

    getProjectName() { return this._name; }
    getCurrentModule() { return this._module; }
    isModuleLoaded() { return this._module !== null; }
    getSessionID() { return this._sessionID; }
    getApp() { return this._app; }
}

export default Session;
