const Eventable = {
  __events: null,
  mixin(targetClass)
  {
    Object.assign(targetClass.prototype, Eventable);
    targetClass.prototype.__events = new Map();
  },
  addListener(eventName, listener)
  {
    if (!this.__events.has(eventName)) this.__events.set(eventName, []);

    const listeners = this.__events.get(eventName);
    listeners.push(listener);
  },
  removeListener(eventName, listener)
  {
    if (!this.__events.has(eventName)) return;

    const listeners = this.__events.get(eventName);
    listeners.splice(listeners.indexOf(listener), 1);
  },
  removeAllListeners(eventName)
  {
    if (!this.__events.has(eventName)) return;

    const listeners = this.__events.get(eventName);
    listeners.length = 0;
  },
  clearListeners()
  {
    this.__events.clear();
  },
  countListeners(eventName)
  {
    return this.__events.has(eventName) ? this.__events.get(eventName).length : 0;
  },
  getListeners(eventName)
  {
    return this.__events.get(eventName);
  },
  emit(eventName)
  {
    if (!this.__events.has(eventName)) return;

    //Can pass additional args to listeners here...
    const args = Array.prototype.splice.call(arguments, 1);
    const listeners = this.__events.get(eventName).slice();
    for(let listener of listeners)
    {
      const result = listener.apply(null, args);
      if (result) break;
    }

    this.onEventProcessed(eventName, args);
  },
  on(eventName, listener)
  {
    this.addListener(eventName, listener);
  },
  once(eventName, listener)
  {
    const f = () => {
      listener.apply(null, arguments);
      this.removeEventListener(f);
    };
    this.addListener(eventName, f);
  },
  onEventProcessed(eventName, args)
  {
    //Do nothing...
  }
};

export default Eventable;
