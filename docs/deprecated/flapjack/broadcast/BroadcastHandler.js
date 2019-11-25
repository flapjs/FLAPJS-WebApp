class MessageHandler
{
    constructor()
    {
        this._broadcastManager = null;
    }

    setBroadcastManager(broadcastManager)
    {
        this._broadcastManager = broadcastManager;
        return this;
    }

    onBroadcastMessage(type, src, dst, message)
    {
        return false;
    }

    getBroadcastManager() { return this._broadcastManager; }
}

export default MessageHandler;
