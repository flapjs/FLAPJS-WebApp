class RemoteSession
{
    constructor(sessionID, sessionName)
    {
        this._sessionID = sessionID;
        this._sessionName = sessionName;
    }

    getSessionID()
    {
        return this._sessionID;
    }

    getSessionName()
    {
        return this._sessionName;
    }
}

export default RemoteSession;
