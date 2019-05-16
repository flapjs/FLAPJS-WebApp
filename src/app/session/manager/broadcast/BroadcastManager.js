import Broadcast from 'util/broadcast/Broadcast.js';
import RemoteSession from './RemoteSession.js';
import {stringHash} from 'util/MathHelper.js';

const SESSION_START_MESSAGE_TYPE = 'session-start';
const SESSION_UPDATE_MESSAGE_TYPE = 'session-update';
const SESSION_STOP_MESSAGE_TYPE = 'session-stop';

class BroadcastManager
{
    constructor(app)
    {
        this._app = app;
        this._session = null;
        this._sessionID = null;
        this._remoteSessions = new Map();

        this._handlers = [];
    }

    addMessageHandler(handler)
    {
        this._handlers.push(handler);
        handler.setBroadcastManager(this);
        return this;
    }

    removeMessageHandler(handler)
    {
        this._handlers.splice(this._handlers.indexOf(handler), 1);
    }

    clear()
    {
        this._handlers.length = 0;
    }

    sendMessageTo(dst, type, message)
    {
        Broadcast.sendMessage(this._sessionID, dst, type, message);
    }

    //DuckType(BroadcastListener)
    onBroadcastMessage(type, src, dst, message)
    {
    //Ignore any messages not meant for me ;)
        if (dst && dst.startsWith('#') && dst !== this._sessionID) return;

        if (type === SESSION_START_MESSAGE_TYPE)
        {
            this._remoteSessions.set(src, new RemoteSession(src, message['name'] || 'Workspace #' + stringHash(src)));
            Broadcast.sendMessage(this._sessionID, src, SESSION_UPDATE_MESSAGE_TYPE);
        }
        else if (type === SESSION_STOP_MESSAGE_TYPE)
        {
            this._remoteSessions.delete(src);
        }
        else if (type === SESSION_UPDATE_MESSAGE_TYPE)
        {
            this._remoteSessions.set(src, new RemoteSession(src, message['name'] || 'Workspace #' + stringHash(src)));
        }
        else
        {
            //Try to handle the message
            for(const handler of this._handlers)
            {
                const result = handler.onBroadcastMessage(type, src, dst, message);

                //If the message is handled, consume it.
                if (result) break;
            }
        }
    }

    //DuckType(SessionListener)
    onSessionStart(session)
    {
        this._session = session;
        this._sessionID = session.getSessionID();

        Broadcast.addListener(this);
        Broadcast.sendMessage(this._sessionID, 'all', SESSION_START_MESSAGE_TYPE);
    }

    //DuckType(SessionListener)
    onSessionStop(session)
    {
        Broadcast.sendMessage(this._sessionID, 'all', SESSION_STOP_MESSAGE_TYPE);
        Broadcast.removeListener(this);

        this.clear();
        this._session = null;
        this._sessionID = null;
    }

    getRemoteSessions() { return this._remoteSessions.values(); }
    getSessionID() { return this._sessionID; }
    getSession() { return this._session; }
    getApp() { return this._app; }
}

export default BroadcastManager;
