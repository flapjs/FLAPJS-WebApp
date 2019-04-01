const AUTOSAVE_INTERVAL = 1000;

const AutoSave = {
  _init: false,
  _handlers: [],
  _interval: null,
  _storage: null,
  initialize(dataStorage)
  {
    if (!dataStorage) throw new Error("Unable to initialize AutoSave for unknown data storage");
    if (!dataStorage.isSupported()) return;

    this._storage = dataStorage;
    this._init = true;
    for(const handler of this._handlers)
    {
      handler.onAutoSaveLoad(this._storage);
    }

    this.onIntervalUpdate = this.onIntervalUpdate.bind(this);
    this._interval = setInterval(this.onIntervalUpdate, AUTOSAVE_INTERVAL);
  },
  destroy()
  {
    if (!this._storage.isSupported()) return;

    clearInterval(this._interval);

    this._init = false;
    for(const handler of this._handlers)
    {
      handler.onAutoSaveUnload(this._storage);
    }
    this._handlers.length = 0;
    this._storage = null;
  },
  onIntervalUpdate()
  {
    for(const handler of this._handlers)
    {
      handler.onAutoSaveUpdate(this._storage);
    }
  },
  register(handler)
  {
    this._handlers.push(handler);
    if (this._init)
    {
      handler.onAutoSaveLoad(this._storage);
    }
    return this;
  },
  unregister(handler)
  {
    this._handlers.splice(this._handlers.indexOf(handler), 1);
    if (this._init)
    {
      handler.onAutoSaveUnload(this._storage);
    }
    return this;
  }
};

export default AutoSave;
