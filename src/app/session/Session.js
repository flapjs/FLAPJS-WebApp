class Session
{
  constructor(app, ModuleClass)
  {
    this._app = app;
    this._name = I18N.toString("file.untitled");
    this._module = null;
    this._moduleClass = null;

    this._listeners = [];
  }

  addListener(listener)
  {
    this._listeners.push(listener);
    return this;
  }

  start(ModuleClass)
  {
    this._moduleClass = ModuleClass;
    this._module = new ModuleClass(this._app);

    for(const listener of this._listeners)
    {
      listener.onSessionStart(this);
    }

    this._module.initialize(this._app);
  }

  stop()
  {
    for(const listener of this._listeners)
    {
      listener.onSessionStop(this);
    }

    this._module.destroy(this._app);
    this._moduleClass = null;
    this._module = null;
  }

  getCurrentModule()
  {
    return this._module;
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

  getProjectName()
  {
    return this._name;
  }

  getApp()
  {
    return this._app;
  }
}

export default Session;
