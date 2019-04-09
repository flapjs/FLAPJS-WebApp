class LocalSaveManager
{
  constructor()
  {
    this._handlers = new Set();
    this._intervalID = null;
    this._intervalMillis = 1000;

    this._init = false;

    this.onIntervalUpdate = this.onIntervalUpdate.bind(this);
  }

  setAutoSaveInterval(millis)
  {
    if (!millis || millis <= 0) throw new Error("AutoSave interval must be greater than 0");
    this._intervalMillis = millis;
  }

  registerHandler(handler)
  {
    if (this._handlers.has(handler))
    {
      throw new Error("Cannot register handler, since it is already registered");
    }

    if (this._init)
    {
      //NOTE: Due to duck typing, it might not exist...
      if (typeof handler['onLoadSave'] === 'function')
      {
        handler.onLoadSave();
      }
    }

    this._handlers.add(handler);
  }

  unregisterHandler(handler)
  {
    if (!this._handlers.has(handler))
    {
      throw new Error("Cannot remove handler, since it is not yet registered");
    }

    if (this._init)
    {
      //NOTE: Due to duck typing, it might not exist...
      if (typeof handler['onUnloadSave'] === 'function')
      {
        handler.onUnloadSave();
      }
    }

    this._handlers.delete(handler);
  }

  initialize()
  {
    if (this._init) throw new Error("Cannot initialize LocalSave, since it is already initialized");

    if (this.doesSupportLocalStorage())
    {
      this._init = true;

      for(const handler of this._handlers)
      {
        //NOTE: Due to duck typing, it might not exist...
        if (typeof handler['onLoadSave'] === 'function')
        {
          handler.onLoadSave();
        }
      }

      //Prepare autosave
      this._intervalID = setInterval(this.onIntervalUpdate, this._intervalMillis);
    }
    else
    {
      //Does not support local storage, so ignore everything...
    }
  }

  terminate()
  {
    if (!this._init) throw new Error("Cannot terminate LocalSave, since it is not yet initialized");

    clearInterval(this._intervalID);

    for(const handler of this._handlers)
    {
      //NOTE: Due to duck typing, it might not exist...
      if (typeof handler['onUnloadSave'] === 'function')
      {
        handler.onUnloadSave();
      }
    }

    this._handlers.clear();
    this._init = false;
  }

  onIntervalUpdate()
  {
    //Save most recent save for all registered handlers
    for(let handler of this._handlers)
    {
      try
      {
        //NOTE: Due to duck typing, it might not exist...
        if (typeof handler['onAutoSave'] === 'function')
        {
          handler.onAutoSave();
        }
      }
      catch(e)
      {
        console.error(e);
      }
    }
  }

  setStringToStorage(saveKey, stringData)
  {
    if (!this.doesSupportLocalStorage()) return;
    if (stringData.length > 0)
    {
      localStorage.setItem(saveKey, stringData);
    }
    else
    {
      localStorage.removeItem(saveKey);
    }
  }

  getStringFromStorage(saveKey)
  {
    if (!this.doesSupportLocalStorage()) return "";
    return localStorage.getItem(saveKey) || "";
  }

  loadFromStorage(saveKey)
  {
    if (!this.doesSupportLocalStorage()) return null;
    try
    {
      const value = localStorage.getItem(saveKey);
      if (value && value.length > 0)
      {
        return JSON.parse(value);
      }
      else
      {
        return null;
      }
    }
    catch(e)
    {
      console.error(e);
      return {};
    }
  }

  saveToStorage(saveKey, jsonData)
  {
    if (!this.doesSupportLocalStorage()) return;

    let hidden, visibilityChange;

    // Opera 12.10 and Firefox 18 and later support
    if (typeof document.hidden !== "undefined")
    {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    }
    else if (typeof document.msHidden !== "undefined")
    {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    }
    else if (typeof document.webkitHidden !== "undefined")
    {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    if (document[hidden])
    {
      //Don't save anything...
      return;
    }

    try
    {
      if (typeof jsonData == 'object')
      {
        let flag = jsonData;
        if (flag)
        {
          flag = false;

          //Don't save empty objects, cause that is wasteful.
          for(let key in jsonData)
          {
            if (jsonData.hasOwnProperty(key))
            {
              flag = true;
              break;
            }
          }
        }

        //Save or remove the data...
        if (flag)
        {
          localStorage.setItem(saveKey, JSON.stringify(jsonData));
        }
        else
        {
          localStorage.removeItem(saveKey);
        }
      }
      else if (typeof jsonData == 'string')
      {
        const flag = jsonData.length <= 0;

        //Save or remove the data...
        if (flag)
        {
          localStorage.setItem(saveKey, jsonData);
        }
        else
        {
          localStorage.removeItem(saveKey);
        }
      }
    }
    catch(e)
    {
      console.error(e);
    }
  }

  existsInStorage(saveKey)
  {
    if (!this.doesSupportLocalStorage()) return false;
    return localStorage.getItem(saveKey) != null;
  }

  clearStorage()
  {
    if (!this.doesSupportLocalStorage()) return;

    localStorage.clear();
  }

  doesSupportLocalStorage()
  {
    //check if browser support local storage
    return typeof Storage !== 'undefined';
  }
}
export default LocalSaveManager;
