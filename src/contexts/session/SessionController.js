class SessionController
{
    constructor()
    {
        this.session = null;
    }

    bindSession(session)
    {
        this.session = session;
    }

    get(key)
    {
        return this.session.state[key];
    }

    dispatch(action)
    {
        this.session.dispatch(action);
    }
}

export default SessionController;
