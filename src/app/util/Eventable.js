const ALLOW_AUTOMATIC_REGISTER = false;

const Eventable = {
  mixin(targetClass)
  {
    const targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, Eventable);
    delete targetPrototype.mixin;
    targetPrototype.__eventListeners = new Map();
  },

  registerEvent(eventName)
  {
    if (!this.__eventListeners.has(eventName))
    {
      this.__eventListeners.set(eventName, []);
    }
    else
    {
      throw new Error("Already registered event \'" + eventName + "\'");
    }
  },

  unregisterEvent(eventName)
  {
    if (this.__eventListeners.has(eventName))
    {
      this.__eventListeners.delete(eventName);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }
  },

  addEventListener(eventName, listener)
  {
    let listeners;
    if (this.__eventListeners.has(eventName))
    {
      listeners = this.__eventListeners.get(eventName);
    }
    else if (ALLOW_AUTOMATIC_REGISTER)
    {
      listeners = [];
      this.__eventListeners.set(eventName, listeners);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }

    listeners.push(listener);
  },

  removeEventListener(eventName, listener)
  {
    if (this.__eventListeners.has(eventName))
    {
      const listeners = this.__eventListeners.get(eventName);
      let flag = false;
      let i = listeners.length;
      while(i--)
      {
        if (listeners[i] === listener)
        {
          listeners.splice(i, 1);
          flag = true;
        }
      }

      if (!flag)
      {
        throw new Error("Unable to find listener for event \'" + eventName + "\'");
      }
    }
    else
    {
      throw new Error("Unknown event \'" + eventName + "\'");
    }
  },

  clearEventListeners(eventName)
  {
    if (this.__eventListeners.has(eventName))
    {
      const listeners = this.__eventListeners.get(eventName);
      listeners.length = 0;
    }
    else if (ALLOW_AUTOMATIC_REGISTER)
    {
      listeners = [];
      this.__eventListeners.set(eventName, listeners);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }
  },

  countEventListeners(eventName)
  {
    return this.__eventListeners.has(eventName) ? this.__eventListeners.get(eventName).length : 0;
  },

  getEventListeners(eventName)
  {
    return this.__eventListeners.get(eventName);
  },

  on(eventName, listener)
  {
    this.addEventListener(eventName, listener);
  },

  once(eventName, listener)
  {
    const f = (...args) => {
      try
      {
        listener.apply(null, args);
      }
      finally
      {
        this.removeEventListener(eventName, f);
      }
    };

    this.addEventListener(eventName, f);
  },

  emit(eventName, ...args)
  {
    try
    {
      let listeners;
      if (ALLOW_AUTOMATIC_REGISTER && !this.__eventListeners.has(eventName))
      {
        listeners = [];
        this.__eventListeners.set(eventName, listeners);
      }
      else
      {
        listeners = this.__eventListeners.get(eventName);

        let result = null;
        let i = listeners.length;
        while(i--)
        {
          try
          {
            result = listeners[i].apply(null, args);
          }
          catch(e)
          {
            console.error(e);
          }

          if (result === true) break;
        }
      }
    }
    finally
    {
      this.onEventProcessed(eventName, ...args);
    }
  },

  onEventProcessed(eventName, ...args)
  {
    //Do nothing.
  }
};

export default Eventable;
