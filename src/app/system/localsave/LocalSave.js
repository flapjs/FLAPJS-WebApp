const LocalSave = {
  _handlers: new Set(),
  _intervalID: null,
  _intervalMillis: 1000,
  setAutoSaveInterval: function(millis)
  {
    if (!millis || millis <= 0) throw new Error("AutoSave interval must be greater than 0");
    this._intervalMillis = millis;
  },
  registerHandler: function(handler)
  {
    if (this._handlers.has(handler))
    {
      throw new Error("Cannot register handler, since it is already registered");
    }
    this._handlers.add(handler);
  },
  unregisterHandler: function(handler)
  {
    if (!this._handlers.has(handler))
    {
      throw new Error("Cannot remove handler, since it is not yet registered");
    }
    this._handlers.delete(handler);
  },
  initialize: function()
  {
    if (this._init) throw new Error("Cannot initialize LocalSave, since it is already initialized");

    if (this.doesSupportLocalStorage())
    {
      //Prepare autosave
      this._intervalID = setInterval(this.onIntervalUpdate.bind(this), this._intervalMillis);
      this._init = true;
    }
    else
    {
      //Does not support local storage, so ignore everything...
    }
  },
  terminate: function()
  {
    if (!this._init) throw new Error("Cannot terminate LocalSave, since it is not yet initialized");

    clearInterval(this._intervalID);

    this._handlers.clear();
    this._init = false;
  },
  loadFromStorage: function(saveKey)
  {
    if (!this.doesSupportLocalStorage()) return {};

    const item = JSON.parse(localStorage.getItem(saveKey));
    return item ? item : null;
  },
  saveToStorage: function(saveKey, jsonData)
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

    let flag = jsonData;
    if (flag)
    {
      //Don't save empty objects, cause that is wasteful.
      for(let key in jsonData)
      {
        if (jsonData.hasOwnProperty(key))
        {
          flag = false;
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
  },
  existsInStorage: function(saveKey)
  {
    if (!this.doesSupportLocalStorage()) return false;
    return localStorage.getItem(saveKey) != null;
  },
  clearStorage: function()
  {
    if (!this.doesSupportLocalStorage()) return;

    localStorage.clear();
  },
  onIntervalUpdate: function()
  {
    //Save most recent save for all registered handlers
    for(let handler of this._handlers)
    {
      try
      {
        handler.onAutoSave();
      }
      catch(e)
      {
        console.error(e);
      }
    }
  },
  doesSupportLocalStorage: function()
  {
    //check if browser support local storage
    return typeof Storage !== 'undefined';
  }
};
export default LocalSave;
