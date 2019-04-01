const SessionStorage = {
  clear()
  {
    if (!this.isSupprted()) return;
    sessionStorage.clear();
  },
  setData(key, value)
  {
    if (!this.isSupprted()) return;

    // Opera 12.10 and Firefox 18 and later support
    let hidden, visibilityChange;
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

    //Don't save anything if hidden...
    if (document[hidden]) return;

    if (value)
    {
      sessionStorage.setItem(key, value);
    }
    else
    {
      sessionStorage.removeItem(key);
    }
  },
  getData(key, defaultValue=null)
  {
    if (!this.isSupprted()) return defaultValue;
    return sessionStorage.getItem(key) || defaultValue;
  },
  setDataAsObject(key, objectValue)
  {
    try
    {
      if (objectValue && Object.keys(objectValue).length > 0)
      {
        this.setData(key, JSON.stringify(objectValue));
      }
      else
      {
        this.setData(key, null);
      }
    }
    catch (e)
    {
      console.error(e);
    }
  },
  getDataAsObject(key, defaultValue=null)
  {
    const result = this.getData(key, null);
    if (result)
    {
      try
      {
        return JSON.parse(result);
      }
      catch (e)
      {
        console.error(e);
        return defaultValue;
      }
    }
    else
    {
      return defaultValue;
    }
  },
  isSupprted()
  {
    return typeof sessionStorage !== 'undefined';
  }
};

export default SessionStorage;
