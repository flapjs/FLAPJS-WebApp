import Modules from 'modules/Modules.js';
import LocalSave from 'system/localsave/LocalSave.js';
import * as URLHelper from 'util/URLHelper.js';

const DEFAULT_MODULE_ID = "fsa2"
export const CURRENT_MODULE_STORAGE_ID = "currentModule";
const MODULE_LOAD_DELAY = 300;
let MODULE_TIMEOUT = null;

class Session
{
  constructor()
  {
    this._name = I18N.toString("file.untitled");
    this._module = null;
    this._moduleClass = null;
    this._app = null;

    this._listeners = [];
  }

  addListener(listener)
  {
    this._listeners.push(listener);
    return this;
  }

  startSession(app, moduleName=null)
  {
    //Load from storage, url, or default, if not specified...
    if (!moduleName || moduleName.length <= 0)
    {
      const urlParams = URLHelper.getURLParameters(URLHelper.getCurrentURL());
      if ('module' in urlParams) moduleName = urlParams['module'];
      if (!moduleName || moduleName.length <= 0)
      {
        moduleName = LocalSave.getStringFromStorage(CURRENT_MODULE_STORAGE_ID);
        if (!moduleName || moduleName.length <= 0)
        {
          moduleName = DEFAULT_MODULE_ID;
        }
      }
    }

    //Check registered module info...
    const moduleInfo = Modules[moduleName];
    if (!moduleInfo)
    {
      window.alert("Cannot find registered module with id \'" + moduleName + "\'");
      return;
    }
    const useExperimental = moduleInfo['experimental'];
    if (useExperimental && !app.isExperimental())
    {
      window.alert("Cannot load experimental module with id \'" + moduleName + "\' on stable app version.");
      return;
    }
    else if (!useExperimental && app.isExperimental())
    {
      window.alert("Cannot load stable module with id \'" + moduleName + "\' on experimental app version.");
      return;
    }

    //Overwrite any past calls...
    if (MODULE_TIMEOUT) clearTimeout(MODULE_TIMEOUT);

    MODULE_TIMEOUT = setTimeout(() => {
      moduleInfo.fetch((ModuleClass) => {
        MODULE_TIMEOUT = null;

        this._app = app;
        this._moduleClass = ModuleClass;
        try
        {
          this._module = new ModuleClass(app);
          this._module.initialize(app);

          for(const listener of this._listeners)
          {
            listener.onSessionStart(this);
          }

          LocalSave.setStringToStorage(CURRENT_MODULE_STORAGE_ID, moduleName);
        }
        catch (e)
        {
          console.log(e);
          window.alert("Could not load module with id \'" + moduleName + "\'");
        }
      });
    }, MODULE_LOAD_DELAY);
  }

  restartSession(app, moduleName=null)
  {
    this.stopSession(app);
    this.startSession(app, moduleName);
  }

  stopSession(app)
  {
    for(const listener of this._listeners)
    {
      listener.onSessionStop(this);
    }

    this._module.destroy(this._app);
    this._moduleClass = null;
    this._module = null;
  }

  setProjectName(name)
  {
    if (!name || name.length <= 0)
    {
      this._name = I18N.toString("file.untitled");
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
      element.innerHTML = string.substring(0, separator).trim() + " - " + value;
    }
    else
    {
      element.innerHTML = string + " - " + value;
    }
  }

  getProjectName() { return this._name; }
  getApp() { return this._app; }
  getCurrentModule() { return this._module; }
}

export default Session;
