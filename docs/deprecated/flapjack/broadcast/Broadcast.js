const Broadcast = {
    _channel: null,
    _listeners: [],
    initialize(channelName)
    {
        if (!this.isSupported()) return;

        this._channel = new BroadcastChannel(channelName);
        this._channel.onmessage = this.onBroadcastMessage.bind(this);
    },
    destroy()
    {
        if (!this.isSupported()) return;

        this._channel.close();
        this._channel = null;
        this._listeners.length = 0;
    },
    addListener(listener)
    {
        this._listeners.push(listener);
        return this;
    },
    removeListener(listener)
    {
        this._listeners.splice(this._listeners.indexOf(listener), 1);
    },
    sendMessage(source, destination, type, data={})
    {
        if (!this.isSupported()) return;

        const result = {
            type: type,
            src: source,
            dst: destination
        };

        Object.assign(result, data);
        this._channel.postMessage(result);
    },
    onBroadcastMessage(ev)
    {
        const messageType = ev.data['type'];
        const messageSource = ev.data['src'];
        const messageDestination = ev.data['dst'];
        for(const listener of this._listeners)
        {
            if (typeof listener['onBroadcastMessage'] === 'function')
            {
                listener.onBroadcastMessage(messageType, messageSource, messageDestination, ev.data);
            }
        }
    },
    getListeners()
    {
        return this._listeners;
    },
    getChannel()
    {
        return this._channel;
    },
    isSupported()
    {
        return 'BroadcastChannel' in self;
    }
};

export default Broadcast;
