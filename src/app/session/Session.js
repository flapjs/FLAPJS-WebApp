class Session
{
  constructor(app)
  {
    this._app = app;
    this._name = I18N.toString("file.untitled");
    this._module = null;
  }

  //TODO: not yet used...
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
